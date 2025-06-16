import path from 'path';
import { TestCase, TestType, FileSummary, TestTypeCounts, TestDescription } from './types';
import { TagProcessor } from './tag-processor';
import { LinkGenerator } from './link-generator';

export class PytestExtractor {
  private tagProcessor: TagProcessor;
  
  constructor(
    private linkGenerator: LinkGenerator,
    private verbose: boolean = false
  ) {
    this.tagProcessor = new TagProcessor(verbose);
  }

  /**
   * Extract tests from Python pytest file content
   */
  extractTests(content: string, filePath: string): TestCase[] {
    const tests: TestCase[] = [];
    const lines = content.split('\n');
    
    let currentClass: string | null = null;
    let currentMarkers: string[] = [];
    let inDocstring = false;
    let docstringLines: string[] = [];
    let docstringEndLineNumber = -1;
    let docstringQuoteType = '';
    let indentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      const lineNumber = i + 1;

      // Track indentation for scope detection
      const currentIndent = line.search(/\S/);
      if (currentIndent !== -1) {
        indentLevel = currentIndent;
      }

      // Handle multi-line docstrings
      if (!inDocstring && (trimmedLine.startsWith('"""') || trimmedLine.startsWith('\'\'\''))) {
        inDocstring = true;
        docstringLines = [];
        docstringQuoteType = trimmedLine.startsWith('"""') ? '"""' : '\'\'\'';
        
        // Check if docstring starts and ends on same line
        const restOfLine = trimmedLine.substring(3);
        if (restOfLine.includes(docstringQuoteType)) {
          // Single line docstring
          const docContent = restOfLine.substring(0, restOfLine.indexOf(docstringQuoteType));
          if (docContent.trim()) {
            docstringLines.push(docContent.trim());
          }
          inDocstring = false;
          docstringEndLineNumber = lineNumber;
        }
        continue;
      }
      
      if (inDocstring) {
        if (trimmedLine.includes(docstringQuoteType)) {
          // End of docstring
          const beforeQuotes = trimmedLine.substring(0, trimmedLine.indexOf(docstringQuoteType));
          if (beforeQuotes.trim()) {
            docstringLines.push(beforeQuotes.trim());
          }
          inDocstring = false;
          docstringEndLineNumber = lineNumber;
        } else {
          // Continue docstring
          if (trimmedLine) {
            docstringLines.push(trimmedLine);
          }
        }
        continue;
      }

      // Extract pytest markers (@pytest.mark.* or @mark.*)
      const markerMatch = trimmedLine.match(/^@(?:pytest\.)?mark\.(\w+)(?:\([^)]*\))?/);
      if (markerMatch) {
        currentMarkers.push(markerMatch[1]);
        continue;
      }

      // Extract test key markers (like @mark.test_key('ETCM-6996'))
      const testKeyMatch = trimmedLine.match(/^@(?:pytest\.)?mark\.test_key\(['"]([^'"]+)['"]\)/);
      if (testKeyMatch) {
        currentMarkers.push(`test_key:${testKeyMatch[1]}`);
        continue;
      }

      // Extract test classes
      const classMatch = trimmedLine.match(/^class\s+(Test\w+)\s*(?:\([^)]*\))?\s*:/);
      if (classMatch) {
        currentClass = classMatch[1];
        // Reset markers when entering a new class
        currentMarkers = [];
        docstringLines = [];
        docstringEndLineNumber = -1;
        continue;
      }

      // Extract test functions
      const testMatch = trimmedLine.match(/^def\s+(test_\w+)\s*\([^)]*\)\s*:/);
      if (testMatch) {
        const testName = testMatch[1];
        const fullTestName = currentClass ? `${currentClass}::${testName}` : testName;
        const describeName = currentClass || path.basename(filePath, '.py');
        
        // Look ahead for docstring after the function definition
        let functionDocstring: string[] = [];
        for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine.startsWith('"""') || nextLine.startsWith('\'\'\'')) {
            const quoteType = nextLine.startsWith('"""') ? '"""' : '\'\'\'';
            functionDocstring = [];
            
            // Check if it's a single-line docstring
            if (nextLine.substring(3).includes(quoteType)) {
              const content = nextLine.substring(3, nextLine.lastIndexOf(quoteType));
              if (content.trim()) {
                functionDocstring.push(content.trim());
              }
              break;
            } else {
              // Multi-line docstring
              for (let k = j + 1; k < lines.length; k++) {
                const docLine = lines[k].trim();
                if (docLine.includes(quoteType)) {
                  const beforeQuotes = docLine.substring(0, docLine.indexOf(quoteType));
                  if (beforeQuotes.trim()) {
                    functionDocstring.push(beforeQuotes.trim());
                  }
                  break;
                } else if (docLine) {
                  functionDocstring.push(docLine);
                }
              }
              break;
            }
          } else if (nextLine && !nextLine.startsWith('#') && nextLine !== '') {
            // Hit non-comment, non-empty line - no docstring found
            break;
          }
        }
        
        // Parse docstring for description (prioritize function docstring over any previous docstring)
        const description = functionDocstring.length > 0
          ? this.parseTestDescription(functionDocstring)
          : this.isDocstringRelevantToTest(docstringLines, docstringEndLineNumber, lineNumber) 
            ? this.parseTestDescription(docstringLines) 
            : '';
        
        // Generate link to the test
        const link = this.linkGenerator.generateTestLink(filePath, lineNumber, describeName, testName);
        
        // Extract tags from markers and description
        const tags = [...currentMarkers, ...this.tagProcessor.extractTags(describeName, description)];
        
        tests.push({
          testName: fullTestName,
          shortName: testName,
          describeName,
          link,
          description,
          lineNumber,
          tags,
          testType: this.determineTestType(currentMarkers),
          framework: 'pytest'
        });

        if (this.verbose) {
          console.log(`   Found test: ${fullTestName} with markers: [${currentMarkers.join(', ')}]`);
        }

        // Reset markers and docstring after processing
        currentMarkers = [];
        docstringLines = [];
        docstringEndLineNumber = -1;
      }

      // Reset class scope when leaving class (based on indentation)
      if (currentClass && currentIndent === 0 && trimmedLine && !trimmedLine.startsWith('#')) {
        currentClass = null;
      }
    }

    return tests;
  }

  /**
   * Generate a summary for the file including test type counts
   */
  generateFileSummary(tests: TestCase[]): FileSummary {
    const total = tests.length;
    const categories: Record<string, number> = {};
    const tags = new Set<string>();
    const testTypes = this.countTestTypes(tests);

    tests.forEach(test => {
      // Categorize by describe name (class or file)
      const category = test.describeName;
      categories[category] = (categories[category] || 0) + 1;
      
      // Collect tags
      test.tags.forEach(tag => tags.add(tag));
    });

    return {
      total,
      categories,
      tags: Array.from(tags),
      testTypes,
      framework: 'pytest'
    };
  }

  /**
   * Parse docstring content for test description and steps
   */
  private parseTestDescription(docstringLines: string[]): string {
    if (docstringLines.length === 0) {
      return '';
    }

    const parsed: TestDescription = {
      description: [],
      given: '',
      when: '',
      then: '',
      and: [],
      steps: []
    };

    let currentSection = 'description';
    
    for (const line of docstringLines) {
      const trimmed = line.trim();
      
      if (!trimmed) continue;

      // Check for bullet points (steps)
      if (trimmed.startsWith('* ')) {
        parsed.steps.push(trimmed.substring(2).trim());
        continue;
      }

      // Check for BDD-style tags
      if (trimmed.toLowerCase().startsWith('@given')) {
        currentSection = 'given';
        parsed.given = trimmed.substring(6).trim();
        continue;
      }
      if (trimmed.toLowerCase().startsWith('@when')) {
        currentSection = 'when';
        parsed.when = trimmed.substring(5).trim();
        continue;
      }
      if (trimmed.toLowerCase().startsWith('@then')) {
        currentSection = 'then';
        parsed.then = trimmed.substring(5).trim();
        continue;
      }
      if (trimmed.toLowerCase().startsWith('@and')) {
        parsed.and.push(trimmed.substring(4).trim());
        continue;
      }

      // Add to current section
      if (currentSection === 'description') {
        parsed.description.push(trimmed);
      }
    }

    // Format the description
    let result = parsed.description.join(' ').trim();
    
    // Add BDD sections if present
    if (parsed.given) result += `\n\n**Given:** ${parsed.given}`;
    if (parsed.when) result += `\n**When:** ${parsed.when}`;
    if (parsed.then) result += `\n**Then:** ${parsed.then}`;
    parsed.and.forEach(andClause => {
      result += `\n**And:** ${andClause}`;
    });

    // Add steps if present
    if (parsed.steps.length > 0) {
      result += '\n\n**Steps:**\n';
      parsed.steps.forEach(step => {
        result += `- ${step}\n`;
      });
    }

    return result.trim();
  }

  /**
   * Determine test type from markers
   */
  private determineTestType(markers: string[]): TestType {
    if (markers.includes('skip') || markers.includes('skipif')) return 'skipped';
    if (markers.includes('parametrize')) return 'parametrize';
    if (markers.some(m => m.startsWith('test_key:'))) return 'marked';
    if (markers.length > 0) return 'marked';
    return 'regular';
  }

  /**
   * Count test types in a test array
   */
  private countTestTypes(tests: TestCase[]): TestTypeCounts {
    const counts: TestTypeCounts = {
      regular: 0,
      skipped: 0,
      todo: 0,
      each: 0,
      only: 0,
      concurrent: 0,
      benchmark: 0,
      marked: 0,
      parametrize: 0
    };

    tests.forEach(test => {
      counts[test.testType]++;
    });

    return counts;
  }

  /**
   * Check if the docstring is relevant to the current test
   */
  private isDocstringRelevantToTest(docstringLines: string[], docstringEndLineNumber: number, testLineNumber: number): boolean {
    if (docstringLines.length === 0 || docstringEndLineNumber === -1) {
      return false;
    }
    
    // Docstring should be within 3 lines of the test (allowing for decorators)
    const distance = testLineNumber - docstringEndLineNumber;
    return distance >= 0 && distance <= 3;
  }
}
