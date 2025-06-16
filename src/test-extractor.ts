import { TestCase, TestType, DescribeBlock, FileSummary, TestTypeCounts } from './types';
import { TagProcessor } from './tag-processor';
import { LinkGenerator } from './link-generator';

export class TestExtractor {
  private tagProcessor: TagProcessor;
  
  constructor(
    private linkGenerator: LinkGenerator,
    private verbose: boolean = false
  ) {
    this.tagProcessor = new TagProcessor(verbose);
  }

  /**
   * Extract tests from file content
   */
  extractTests(content: string, filePath: string): TestCase[] {
    const tests: TestCase[] = [];
    const lines = content.split('\n');
    
    let currentDescribe: DescribeBlock | null = null;
    let inComment = false;
    let commentLines: string[] = [];
    let commentEndLineNumber = -1;
    let braceLevel = 0;
    let inDynamicTestBlock = false;
    let dynamicTestTemplate = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNumber = i + 1;

      // Track brace levels for scope detection
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      braceLevel += openBraces - closeBraces;

      // Handle multi-line comments
      if (line.startsWith('/**')) {
        inComment = true;
        commentLines = [];
        continue;
      }
      if (inComment) {
        if (line.includes('*/')) {
          inComment = false;
          commentEndLineNumber = lineNumber;
        } else {
          // Clean up comment line
          const cleanLine = line.replace(/^\s*\*\s?/, '').trim();
          if (cleanLine) {
            commentLines.push(cleanLine);
          }
        }
        continue;
      }

      // Extract describe blocks
      const describeMatch = line.match(/describe\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (describeMatch) {
        currentDescribe = {
          name: describeMatch[1],
          lineNumber,
          level: braceLevel
        };
        // Reset comment lines when entering a new describe block to prevent
        // describe-level comments from being applied to tests
        commentLines = [];
        commentEndLineNumber = -1;
        continue;
      }

      // Check for dynamic test patterns (forEach, map, etc.)
      const dynamicTestMatch = line.match(/\.forEach\s*\(\s*\([^)]*\)\s*=>\s*\{/);
      if (dynamicTestMatch && currentDescribe) {
        inDynamicTestBlock = true;
        
        // Look ahead to find the test template
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const testTemplateMatch = lines[j].match(/(?:it|test|bench)(?:\.(?:skip|only|todo|concurrent|each\([^)]*\)))?\s*\(\s*[`'"]([^`'"]*)[`'"]/);
          if (testTemplateMatch) {
            dynamicTestTemplate = testTemplateMatch[1];
            
            const description = this.isCommentRelevantToTest(commentLines, commentEndLineNumber, lineNumber) 
              ? this.tagProcessor.parseTestDescription(commentLines, this.verbose) 
              : 'Dynamic test generated from forEach loop';
            const link = this.linkGenerator.generateTestLink(filePath, lineNumber, currentDescribe.name, dynamicTestTemplate);
            
            tests.push({
              testName: `${currentDescribe.name} > ${dynamicTestTemplate} (dynamic)`,
              shortName: `${dynamicTestTemplate} (dynamic)`,
              describeName: currentDescribe.name,
              link,
              description,
              lineNumber,
              tags: this.tagProcessor.extractTags(currentDescribe.name, description).concat(['dynamic']),
              testType: 'each' // Dynamic tests are considered parametric
            });
            
            if (this.verbose) {
              console.log(`   Found dynamic test pattern: ${dynamicTestTemplate}`);
            }
            
            break;
          }
        }
        
        // Reset comment lines after processing
        commentLines = [];
        commentEndLineNumber = -1;
        continue;
      }

      // Extract regular test cases (it, test, bench) with enhanced pattern matching
      let testMatch = line.match(/(?:it|test|bench)(?:\.(?:skip|only|todo|concurrent|each\([^)]*\)))?\s*\(\s*[`'"]([^`'"]*)[`'"]/);
      
      // Also try to match template literals and dynamic test names
      if (!testMatch) {
        testMatch = line.match(/(?:it|test|bench)(?:\.(?:skip|only|todo|concurrent|each\([^)]*\)))?\s*\(\s*`([^`]*)`/);
      }
      
      // Handle test calls that span multiple lines - look for test name in subsequent lines
      if (!testMatch && line.match(/(?:it|test|bench)(?:\.(?:skip|only|todo|concurrent|each\([^)]*\)))?\s*\(\s*$/)) {
        // Look ahead for the test name on the next few lines
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nameMatch = lines[j].match(/^\s*[`'"]([^`'"]+)[`'"]/);
          if (nameMatch) {
            testMatch = [line + lines[j], nameMatch[1]];
            break;
          }
        }
      }
      
      if (testMatch && currentDescribe && !inDynamicTestBlock) {
        const testName = testMatch[1];
        const fullTestName = `${currentDescribe.name} > ${testName}`;
        const description = this.isCommentRelevantToTest(commentLines, commentEndLineNumber, lineNumber) 
          ? this.tagProcessor.parseTestDescription(commentLines, this.verbose) 
          : '';
        
        // Generate link to the test
        const link = this.linkGenerator.generateTestLink(filePath, lineNumber, currentDescribe.name, testName);
        
        tests.push({
          testName: fullTestName,
          shortName: testName,
          describeName: currentDescribe.name,
          link,
          description,
          lineNumber,
          tags: this.tagProcessor.extractTags(currentDescribe.name, description),
          testType: this.determineTestType(Array.isArray(testMatch) ? testMatch[0] : line)
        });

        // Reset comment lines after processing
        commentLines = [];
        commentEndLineNumber = -1;
      }

      // Handle multiline test definitions and it.each patterns
      const testStartMatch = line.match(/(?:it|test|bench)(?:\.(?:skip|only|todo|concurrent|each\([^)]*\)|each\s*\(|skip|only|todo|concurrent))/);
      if (testStartMatch && currentDescribe && !inDynamicTestBlock && !testMatch) {
        // Look ahead for the test name on subsequent lines (up to 15 lines for complex each patterns)
        let testName = '';
        let foundLineNumber = lineNumber;
        
        for (let j = i; j < Math.min(i + 15, lines.length); j++) {
          const nameMatch = lines[j].match(/[`'"]([^`'"]+)[`'"]/);
          if (nameMatch) {
            testName = nameMatch[1];
            foundLineNumber = j + 1;
            break;
          }
        }
        
        if (testName) {
          const fullTestName = `${currentDescribe.name} > ${testName}`;
          const description = this.isCommentRelevantToTest(commentLines, commentEndLineNumber, lineNumber) 
            ? this.tagProcessor.parseTestDescription(commentLines, this.verbose) 
            : '';
          
          // Generate link to the test
          const link = this.linkGenerator.generateTestLink(filePath, foundLineNumber, currentDescribe.name, testName);
          
          // Add "parameterized" tag for .each tests
          const tags = this.tagProcessor.extractTags(currentDescribe.name, description);
          if (testStartMatch[0].includes('.each')) {
            tags.push('parameterized');
          }
          
          tests.push({
            testName: fullTestName,
            shortName: testName,
            describeName: currentDescribe.name,
            link,
            description,
            lineNumber: foundLineNumber,
            tags,
            testType: this.determineTestType(testStartMatch[0])
          });

          // Reset comment lines after processing
          commentLines = [];
          commentEndLineNumber = -1;
        }
      }

      // Handle simple test calls without JSDoc comments but with inline tags (like @smoke, @healthcheck)
      const simpleTestMatch = line.match(/(?:it|test|bench)(?:\.(?:skip|only|todo|concurrent))?\s*\(\s*[`'"]([^`'"]*@[^`'"]*)[`'"]/);
      if (simpleTestMatch && currentDescribe && !inDynamicTestBlock && !testMatch) {
        const testName = simpleTestMatch[1];
        const fullTestName = `${currentDescribe.name} > ${testName}`;
        
        // Extract inline tags from test name
        const inlineTags = this.tagProcessor.extractInlineTags(testName);
        const cleanTestName = testName.replace(/@\w+/g, '').trim();
        
        // Use previous comment if available and relevant, or create basic description
        const description = this.isCommentRelevantToTest(commentLines, commentEndLineNumber, lineNumber) 
          ? this.tagProcessor.parseTestDescription(commentLines, this.verbose) 
          : 'Test with inline tags';
        
        // Generate link to the test
        const link = this.linkGenerator.generateTestLink(filePath, lineNumber, currentDescribe.name, cleanTestName);
        
        const allTags = this.tagProcessor.extractTags(currentDescribe.name, description).concat(inlineTags);
        
        tests.push({
          testName: `${currentDescribe.name} > ${cleanTestName}`,
          shortName: cleanTestName,
          describeName: currentDescribe.name,
          link,
          description,
          lineNumber,
          tags: allTags,
          testType: this.determineTestType(line)
        });

        // Reset comment lines after processing
        commentLines = [];
        commentEndLineNumber = -1;
      }

      // Reset scope tracking when leaving blocks
      if (currentDescribe && braceLevel < currentDescribe.level) {
        currentDescribe = null;
        inDynamicTestBlock = false;
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
      // Categorize by describe name
      const category = test.describeName;
      categories[category] = (categories[category] || 0) + 1;
      
      // Collect tags
      test.tags.forEach(tag => tags.add(tag));
    });

    return {
      total,
      categories,
      tags: Array.from(tags),
      testTypes
    };
  }

  /**
   * Determine test type from line content
   */
  private determineTestType(line: string): TestType {
    if (line.includes('.skip')) return 'skipped';
    if (line.includes('.todo')) return 'todo';
    if (line.includes('.each')) return 'each';
    if (line.includes('.only')) return 'only';
    if (line.includes('.concurrent')) return 'concurrent';
    if (line.match(/\bbench\s*\(/)) return 'benchmark';
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
      benchmark: 0
    };

    tests.forEach(test => {
      counts[test.testType]++;
    });

    return counts;
  }

  /**
   * Check if the comment is relevant to the current test
   * Comments should be within 3 lines of the test declaration to be considered relevant
   */
  private isCommentRelevantToTest(commentLines: string[], commentEndLineNumber: number, testLineNumber: number): boolean {
    if (commentLines.length === 0 || commentEndLineNumber === -1) {
      return false;
    }
    
    // Comment should be within 3 lines of the test (allowing for some whitespace)
    const distance = testLineNumber - commentEndLineNumber;
    return distance >= 0 && distance <= 3;
  }
}
