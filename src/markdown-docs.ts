import fs from 'fs';
import path from 'path';

interface GeneratorOptions {
  sourceDir?: string;
  outputDir?: string;
  githubUrl?: string;
  githubBranch?: string;
  repositoryRoot?: string;
  verbose?: boolean;
}

interface DescribeBlock {
  name: string;
  lineNumber: number;
  level: number;
}

type TestType = 'regular' | 'skipped' | 'todo' | 'each' | 'only' | 'concurrent' | 'benchmark';

interface TestCase {
  testName: string;
  shortName: string;
  describeName: string;
  link: string;
  description: string;
  lineNumber: number;
  tags: string[];
  testType: TestType;
}

interface TestCaseWithFile extends TestCase {
  fileName: string;
  filePath: string;
  category: string;
}

interface TestDescription {
  description: string[];
  given: string;
  when: string;
  then: string;
  and: string[];
}

interface TestTypeCounts {
  regular: number;
  skipped: number;
  todo: number;
  each: number;
  only: number;
  concurrent: number;
  benchmark: number;
}

interface FileSummary {
  total: number;
  categories: Record<string, number>;
  tags: string[];
  testTypes: TestTypeCounts;
}

interface FileDocumentation {
  fileName: string;
  filePath: string;
  fullPath: string;
  tests: TestCase[];
  summary: FileSummary;
}

/**
 * Markdown documentation generator for Jest and Vitest test files
 * Extracts test information from TypeScript test files and generates markdown documentation
 */
class MarkdownDocsGenerator {
  private readonly testDir: string;
  private readonly docsDir: string;
  private readonly githubUrl: string | null;
  private readonly githubBranch: string;
  private readonly repositoryRoot: string;
  private readonly verbose: boolean;
  private readonly testFiles: string[];
  private readonly documentation: Map<string, FileDocumentation>;
  private readonly knownTags: Set<string>;

  /**
   * @param options - Configuration options
   */
  constructor(options: GeneratorOptions = {}) {
    // Helper function to check if a string is non-empty
    const isNonEmptyString = (str: string | undefined): str is string => {
      return typeof str === 'string' && str.trim().length > 0;
    };

    this.testDir = isNonEmptyString(options.sourceDir) ? path.resolve(options.sourceDir) : path.join(process.cwd(), 'src', 'test');
    this.docsDir = isNonEmptyString(options.outputDir) ? path.resolve(options.outputDir) : path.join(process.cwd(), 'doc', 'tests');
    this.githubUrl = isNonEmptyString(options.githubUrl) ? options.githubUrl.replace(/\.git$/, '') : null;
    this.githubBranch = isNonEmptyString(options.githubBranch) ? options.githubBranch : 'main';
    this.repositoryRoot = isNonEmptyString(options.repositoryRoot) ? path.resolve(options.repositoryRoot) : process.cwd();
    this.verbose = options.verbose || false;
    this.testFiles = [];
    this.documentation = new Map<string, FileDocumentation>();
    this.knownTags = new Set(['given', 'when', 'then', 'and', 'group', 'category']);

    console.log(`Source directory: ${this.testDir}`);
    console.log(`Output directory: ${this.docsDir}`);
    console.log(`Repository root: ${this.repositoryRoot}`);
    if (this.githubUrl) {
      console.log(`GitHub URL: ${this.githubUrl}`);
      console.log(`GitHub branch: ${this.githubBranch}`);
    }
    if (this.verbose) {
      console.log('🔍 Verbose mode enabled');
    }
  }

  /**
   * Initialize the documentation generation process
   */
  async generate(): Promise<void> {
    console.log('🚀 Starting markdown documentation generation...');
    
    // Ensure docs directory exists
    this.ensureDocsDirectory();
    
    // Find all test files
    this.findTestFiles();
    
    // Process each test file
    for (const testFile of this.testFiles) {
      console.log(`📄 Processing: ${testFile}`);
      await this.processTestFile(testFile);
    }
    
    // Generate markdown files
    this.generateMarkdownFiles();
    
    // Generate all tests file
    this.generateAllTestsFile();
    
    // Generate index file
    this.generateIndexFile();
    
    console.log(`✅ Documentation generated successfully in ${this.docsDir}`);
  }

  /**
   * Ensure the documentation directory exists
   */
  private ensureDocsDirectory(): void {
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
      console.log(`📁 Created directory: ${this.docsDir}`);
    }
  }

  /**
   * Recursively find all test files
   */
  private findTestFiles(): void {
    console.log(`🔍 Looking for test files in: ${this.testDir}`);
    
    // Check if directory exists
    if (!fs.existsSync(this.testDir)) {
      throw new Error(`Source directory does not exist: ${this.testDir}`);
    }

    const findTestFilesRecursive = (dir: string): void => {
      if (this.verbose) {
        console.log(`   Scanning directory: ${dir}`);
      }
      
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          findTestFilesRecursive(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.spec.ts'))) {
          this.testFiles.push(fullPath);
          if (this.verbose) {
            console.log(`   Found test file: ${fullPath}`);
          }
        }
      }
    };

    findTestFilesRecursive(this.testDir);
    console.log(`🔍 Found ${this.testFiles.length} test files`);
  }

  /**
   * Process a single test file and extract test information
   */
  private async processTestFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.testDir, filePath);
    
    // Handle both .test.ts and .spec.ts files
    let fileName = path.basename(filePath);
    if (fileName.endsWith('.test.ts')) {
      fileName = fileName.replace('.test.ts', '');
    } else if (fileName.endsWith('.spec.ts')) {
      fileName = fileName.replace('.spec.ts', '');
    }
    
    const tests = this.extractTests(content, filePath);
    
    if (this.verbose) {
      console.log(`   Found ${tests.length} tests in ${fileName}`);
      const typeCounts = this.countTestTypes(tests);
      console.log(`   Test types: Regular: ${typeCounts.regular}, Skipped: ${typeCounts.skipped}, Todo: ${typeCounts.todo}, Each: ${typeCounts.each}, Only: ${typeCounts.only}, Concurrent: ${typeCounts.concurrent}, Benchmark: ${typeCounts.benchmark}`);
    }
    
    if (tests.length > 0) {
      this.documentation.set(relativePath, {
        fileName,
        filePath: relativePath,
        fullPath: filePath,
        tests,
        summary: this.generateFileSummary(tests)
      });
    } else if (this.verbose) {
      console.log(`   ⚠️  No tests extracted from ${fileName} - check test structure`);
    }
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
   * Get test type emoji for display
   */
  private getTestTypeEmoji(testType: TestType): string {
    switch (testType) {
    case 'regular': return '✅';
    case 'skipped': return '⏭️';
    case 'todo': return '📝';
    case 'each': return '🔄';
    case 'only': return '🎯';
    case 'concurrent': return '⚡';
    case 'benchmark': return '📊';
    default: return '❓';
    }
  }
  private extractTests(content: string, filePath: string): TestCase[] {
    const tests: TestCase[] = [];
    const lines = content.split('\n');
    
    let currentDescribe: DescribeBlock | null = null;
    let inComment = false;
    let commentLines: string[] = [];
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
            
            const description = commentLines.length > 0 ? this.parseTestDescription(commentLines) : 'Dynamic test generated from forEach loop';
            const link = this.generateTestLink(filePath, lineNumber, currentDescribe.name, dynamicTestTemplate);
            
            tests.push({
              testName: `${currentDescribe.name} > ${dynamicTestTemplate} (dynamic)`,
              shortName: `${dynamicTestTemplate} (dynamic)`,
              describeName: currentDescribe.name,
              link,
              description,
              lineNumber,
              tags: this.extractTags(currentDescribe.name, description).concat(['dynamic']),
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
        const description = this.parseTestDescription(commentLines);
        
        // Generate link to the test
        const link = this.generateTestLink(filePath, lineNumber, currentDescribe.name, testName);
        
        tests.push({
          testName: fullTestName,
          shortName: testName,
          describeName: currentDescribe.name,
          link,
          description,
          lineNumber,
          tags: this.extractTags(currentDescribe.name, description),
          testType: this.determineTestType(Array.isArray(testMatch) ? testMatch[0] : line)
        });

        // Reset comment lines after processing
        commentLines = [];
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
          const description = this.parseTestDescription(commentLines);
          
          // Generate link to the test
          const link = this.generateTestLink(filePath, foundLineNumber, currentDescribe.name, testName);
          
          // Add "parameterized" tag for .each tests
          const tags = this.extractTags(currentDescribe.name, description);
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
        }
      }

      // Handle simple test calls without JSDoc comments but with inline tags (like @smoke, @healthcheck)
      const simpleTestMatch = line.match(/(?:it|test|bench)(?:\.(?:skip|only|todo|concurrent))?\s*\(\s*[`'"]([^`'"]*@[^`'"]*)[`'"]/);
      if (simpleTestMatch && currentDescribe && !inDynamicTestBlock && !testMatch) {
        const testName = simpleTestMatch[1];
        const fullTestName = `${currentDescribe.name} > ${testName}`;
        
        // Extract inline tags from test name
        const inlineTags = this.extractInlineTags(testName);
        const cleanTestName = testName.replace(/@\w+/g, '').trim();
        
        // Use previous comment if available, or create basic description
        const description = commentLines.length > 0 ? this.parseTestDescription(commentLines) : 'Test with inline tags';
        
        // Generate link to the test
        const link = this.generateTestLink(filePath, lineNumber, currentDescribe.name, cleanTestName);
        
        const allTags = this.extractTags(currentDescribe.name, description).concat(inlineTags);
        
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
   * Parse test description from TSDoc comments
   */
  private parseTestDescription(commentLines: string[]): string {
    if (commentLines.length === 0) {
      return '';
    }

    const sections: TestDescription = {
      description: [],
      given: '',
      when: '',
      then: '',
      and: []
    };
    
    let currentSection: keyof TestDescription = 'description';
    let currentText = '';

    for (const line of commentLines) {
      if (line.startsWith('@given')) {
        // Save previous section
        if (currentText.trim()) {
          this.saveSectionText(sections, currentSection, currentText.trim());
        }
        currentSection = 'given';
        currentText = line.replace('@given', '').trim();
      } else if (line.startsWith('@when')) {
        // Save previous section
        if (currentText.trim()) {
          this.saveSectionText(sections, currentSection, currentText.trim());
        }
        currentSection = 'when';
        currentText = line.replace('@when', '').trim();
      } else if (line.startsWith('@then')) {
        // Save previous section
        if (currentText.trim()) {
          this.saveSectionText(sections, currentSection, currentText.trim());
        }
        currentSection = 'then';
        currentText = line.replace('@then', '').trim();
      } else if (line.startsWith('@and')) {
        // Save previous section
        if (currentText.trim()) {
          this.saveSectionText(sections, currentSection, currentText.trim());
        }
        currentSection = 'and';
        currentText = line.replace('@and', '').trim();
      } else if (line.startsWith('@')) {
        // Check for unknown tags and log if verbose mode is enabled
        const tagMatch = line.match(/^@(\w+)/);
        if (tagMatch) {
          const tag = tagMatch[1];
          if (!this.knownTags.has(tag) && this.verbose) {
            console.log(`⚠️  Unknown tag found: @${tag} (line: "${line.trim()}")`);
          }
        }
        // Skip unknown JSDoc tags
        continue;
      } else {
        // Continue building current section
        if (currentText) {
          currentText += ' ' + line;
        } else {
          currentText = line;
        }
      }
    }

    // Save the last section
    if (currentText.trim()) {
      this.saveSectionText(sections, currentSection, currentText.trim());
    }

    // Build formatted description
    const formattedParts: string[] = [];
    
    // Add main description if available
    if (sections.description.length > 0) {
      formattedParts.push(`**${sections.description.join(' ')}**`);
    }
    
    // Add Given/When/Then sections
    if (sections.given) {
      formattedParts.push(`**Given:** ${sections.given}`);
    }
    if (sections.when) {
      formattedParts.push(`**When:** ${sections.when}`);
    }
    if (sections.then) {
      formattedParts.push(`**Then:** ${sections.then}`);
    }
    
    // Add And sections
    if (sections.and.length > 0) {
      sections.and.forEach(andClause => {
        formattedParts.push(`**And:** ${andClause}`);
      });
    }

    return formattedParts.join('<br>');
  }

  /**
   * Helper method to save section text to the appropriate section
   */
  private saveSectionText(sections: TestDescription, currentSection: keyof TestDescription, text: string): void {
    if (currentSection === 'description') {
      sections.description.push(text);
    } else if (currentSection === 'and') {
      sections.and.push(text);
    } else {
      sections[currentSection] = text;
    }
  }

  /**
   * Extract inline tags from test names (e.g., @smoke, @healthcheck)
   */
  private extractInlineTags(testName: string): string[] {
    const tagMatches = testName.match(/@(\w+)/g);
    return tagMatches ? tagMatches.map(tag => tag.slice(1)) : [];
  }

  /**
   * Extract tags from test name and description
   */
  private extractTags(describeName: string, description: string): string[] {
    const tags: string[] = [];
    
    // Extract tags from describe name (e.g., [@slow][@proving])
    const describeTagMatches = describeName.match(/\[@([^\]]+)\]/g);
    if (describeTagMatches) {
      tags.push(...describeTagMatches.map(tag => tag.slice(2, -1)));
    }

    // Extract additional context tags
    if (description.toLowerCase().includes('failure') || description.toLowerCase().includes('error')) {
      tags.push('error-case');
    }
    if (description.toLowerCase().includes('should not') || description.toLowerCase().includes('should fail')) {
      tags.push('negative-test');
    }

    return tags;
  }

  /**
   * Generate a link to the specific test in the file
   */
  private generateTestLink(filePath: string, lineNumber: number, describeName: string, testName: string): string {
    // Calculate path relative to repository root
    const repoRelativePath = path.relative(this.repositoryRoot, filePath);
    
    if (this.githubUrl) {
      // Normalize GitHub URL (remove trailing slash)
      const normalizedGithubUrl = this.githubUrl.replace(/\/$/, '');
      // Create GitHub blob URL
      const githubPath = repoRelativePath.replace(/\\/g, '/'); // Convert Windows paths to forward slashes
      return `${normalizedGithubUrl}/blob/${this.githubBranch}/${githubPath}#L${lineNumber}`;
    } else {
      // Fallback to relative path from repository root
      return `${repoRelativePath.replace(/\\/g, '/')}#L${lineNumber}`;
    }
  }

  /**
   * Generate a summary for the file including test type counts
   */
  private generateFileSummary(tests: TestCase[]): FileSummary {
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
   * Generate markdown files for each test file
   */
  private generateMarkdownFiles(): void {
    for (const [relativePath, fileData] of this.documentation) {
      // Convert test file path to markdown path while preserving directory structure
      let markdownRelativePath = relativePath;
      if (markdownRelativePath.endsWith('.test.ts')) {
        markdownRelativePath = markdownRelativePath.replace(/\.test\.ts$/, '.md');
      } else if (markdownRelativePath.endsWith('.spec.ts')) {
        markdownRelativePath = markdownRelativePath.replace(/\.spec\.ts$/, '.md');
      }
      
      const markdownPath = path.join(this.docsDir, markdownRelativePath);
      
      // Ensure directory exists
      const markdownDir = path.dirname(markdownPath);
      if (!fs.existsSync(markdownDir)) {
        fs.mkdirSync(markdownDir, { recursive: true });
        if (this.verbose) {
          console.log(`📁 Created directory: ${markdownDir}`);
        }
      }
      
      const content = this.generateMarkdownContent(fileData);
      fs.writeFileSync(markdownPath, content, 'utf8');
      console.log(`📝 Generated: ${markdownPath}`);
    }
  }

  /**
   * Generate enhanced markdown content for a single file
   */
  private generateMarkdownContent(fileData: FileDocumentation): string {
    const { fileName, filePath, tests, summary } = fileData;
    
    let content = `# ${fileName} Test Documentation\n\n`;
    content += `**File:** \`${filePath}\`\n\n`;
    content += `**Total Tests:** ${summary.total}\n\n`;
    
    // Add test type summary
    content += '## Test Type Summary\n\n';
    content += '| Type | Count | Percentage |\n';
    content += '|------|--------|------------|\n';
    
    const testTypeOrder: TestType[] = ['regular', 'skipped', 'todo', 'each', 'only', 'concurrent', 'benchmark'];
    
    for (const testType of testTypeOrder) {
      const count = summary.testTypes[testType];
      if (count > 0) {
        const percentage = ((count / summary.total) * 100).toFixed(1);
        const emoji = this.getTestTypeEmoji(testType);
        const typeLabel = testType.charAt(0).toUpperCase() + testType.slice(1);
        content += `| ${emoji} ${typeLabel} | ${count} | ${percentage}% |\n`;
      }
    }
    content += '\n';

    // Add warnings for potentially problematic test types
    const warnings: string[] = [];
    if (summary.testTypes.skipped > summary.total * 0.2) {
      warnings.push(`⚠️ **High number of skipped tests (${summary.testTypes.skipped}/${summary.total})** - Consider reviewing or removing these tests`);
    }
    if (summary.testTypes.only > 0) {
      warnings.push(`🚨 **Tests marked with .only found (${summary.testTypes.only})** - These should not be committed to version control`);
    }
    if (summary.testTypes.todo > summary.total * 0.3) {
      warnings.push(`📝 **Many TODO tests (${summary.testTypes.todo}/${summary.total})** - Consider implementing these tests`);
    }

    if (warnings.length > 0) {
      content += '## ⚠️ Warnings\n\n';
      warnings.forEach(warning => {
        content += `${warning}\n\n`;
      });
    }
    
    // Add tags if any
    if (summary.tags.length > 0) {
      content += `**Tags:** ${summary.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`;
    }

    // Add categories summary
    if (Object.keys(summary.categories).length > 1) {
      content += '## Test Categories\n\n';
      for (const [category, count] of Object.entries(summary.categories)) {
        content += `- **${category}:** ${count} tests\n`;
      }
      content += '\n';
    }

    // Add test cases table with type indicators
    content += '## Test Cases\n\n';
    content += '| Type | Link | Test Name | Description |\n';
    content += '|------|------|-----------|-------------|\n';
    
    for (const test of tests) {
      const typeEmoji = this.getTestTypeEmoji(test.testType);
      const testName = this.escapeMarkdown(test.testName);
      const link = `[L${test.lineNumber}](${test.link})`;
      const description = this.escapeMarkdown(test.description || 'No description available');
      
      content += `| ${typeEmoji} | ${link} | ${testName} | ${description} |\n`;
    }

    content += '\n---\n';
    content += `*Generated on ${new Date().toISOString()}*\n`;

    return content;
  }

  /**
   * Escape markdown special characters
   */
  private escapeMarkdown(text: string): string {
    return text
      .replace(/\|/g, '\\|')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Generate comprehensive ALL_TESTS.md file with all test cases
   */
  private generateAllTestsFile(): void {
    const allTestsPath = path.join(this.docsDir, 'ALL_TESTS.md');
    
    // Collect all tests from all files
    const allTests: TestCaseWithFile[] = [];
    for (const [relativePath, fileData] of this.documentation) {
      for (const test of fileData.tests) {
        allTests.push({
          ...test,
          fileName: fileData.fileName,
          filePath: relativePath,
          category: this.getCategoryFromPath(relativePath)
        });
      }
    }

    // Sort tests by category, then by file name, then by line number
    allTests.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      if (a.fileName !== b.fileName) {
        return a.fileName.localeCompare(b.fileName);
      }
      return a.lineNumber - b.lineNumber;
    });

    let content = '# All Tests Documentation\n\n';
    content += 'This file contains a comprehensive list of all test cases across the entire project.\n\n';
    content += `**Total Test Files:** ${this.documentation.size}\n`;
    content += `**Total Test Cases:** ${allTests.length}\n\n`;

    // Add statistics by category
    const categoryStats: Record<string, number> = {};
    allTests.forEach(test => {
      categoryStats[test.category] = (categoryStats[test.category] || 0) + 1;
    });

    content += '## Test Distribution\n\n';
    for (const [category, count] of Object.entries(categoryStats).sort()) {
      content += `- **${category}:** ${count} tests\n`;
    }
    content += '\n';

    // Add comprehensive test table
    content += '## All Test Cases\n\n';
    content += '| Category | File | Link | Test Name | Description |\n';
    content += '|----------|------|------|-----------|-------------|\n';
    
    for (const test of allTests) {
      const category = this.escapeMarkdown(test.category);
      let markdownRelativePath = test.filePath;
      if (markdownRelativePath.endsWith('.test.ts')) {
        markdownRelativePath = markdownRelativePath.replace(/\.test\.ts$/, '.md');
      } else if (markdownRelativePath.endsWith('.spec.ts')) {
        markdownRelativePath = markdownRelativePath.replace(/\.spec\.ts$/, '.md');
      }
      const fileName = `[${test.fileName}](${markdownRelativePath})`;
      const testName = this.escapeMarkdown(test.testName);
      const link = `[L${test.lineNumber}](${test.link})`;
      const description = this.escapeMarkdown(test.description || 'No description available');
      
      content += `| ${category} | ${fileName} | ${link} | ${testName} | ${description} |\n`;
    }

    // Add tag-based index
    const allTags = new Set<string>();
    allTests.forEach(test => {
      test.tags.forEach(tag => allTags.add(tag));
    });

    if (allTags.size > 0) {
      content += '\n## Tests by Tag\n\n';
      
      for (const tag of Array.from(allTags).sort()) {
        const testsWithTag = allTests.filter(test => test.tags.includes(tag));
        content += `### ${tag} (${testsWithTag.length} tests)\n\n`;
        
        content += '| File | Link | Test Name |\n';
        content += '|------|------|-----------|\n';
        
        for (const test of testsWithTag) {
          let markdownRelativePath = test.filePath;
          if (markdownRelativePath.endsWith('.test.ts')) {
            markdownRelativePath = markdownRelativePath.replace(/\.test\.ts$/, '.md');
          } else if (markdownRelativePath.endsWith('.spec.ts')) {
            markdownRelativePath = markdownRelativePath.replace(/\.spec\.ts$/, '.md');
          }
          const fileName = `[${test.fileName}](${markdownRelativePath})`;
          const testName = this.escapeMarkdown(test.testName);
          const link = `[L${test.lineNumber}](${test.link})`;
          
          content += `| ${fileName} | ${link} | ${testName} |\n`;
        }
        content += '\n';
      }
    }

    content += '\n---\n';
    content += `*Generated on ${new Date().toISOString()}*\n`;
    content += '*Generator: markdown-docs.ts*\n';

    fs.writeFileSync(allTestsPath, content, 'utf8');
    console.log(`📊 Generated all tests file: ${allTestsPath}`);
  }

  /**
   * Get category name from file path
   */
  private getCategoryFromPath(relativePath: string): string {
    const dir = path.dirname(relativePath);
    return dir.charAt(0).toUpperCase() + dir.slice(1);
  }

  /**
   * Generate the index file listing all documented files
   */
  private generateIndexFile(): void {
    const indexPath = path.join(this.docsDir, 'README.md');
    
    let content = '# Test Documentation Index\n\n';
    content += 'This directory contains automatically generated documentation for all test files.\n\n';
    content += `**Total Files:** ${this.documentation.size}\n`;
    content += `**Total Tests:** ${Array.from(this.documentation.values()).reduce((sum, file) => sum + file.summary.total, 0)}\n\n`;

    // Add quick navigation
    content += '## Quick Navigation\n\n';
    content += '- 📊 **[ALL_TESTS.md](ALL_TESTS.md)** - Comprehensive list of all test cases\n';
    content += '- 📁 **Individual Files** - Detailed documentation for each test file\n\n';

    // Generate summary table
    content += '## Files Overview\n\n';
    content += '| File | Test Count | Categories | Tags |\n';
    content += '|------|------------|------------|------|\n';

    const sortedFiles = Array.from(this.documentation.entries()).sort(([a], [b]) => a.localeCompare(b));
    
    for (const [relativePath, fileData] of sortedFiles) {
      const fileName = fileData.fileName;
      let markdownRelativePath = relativePath;
      if (markdownRelativePath.endsWith('.test.ts')) {
        markdownRelativePath = markdownRelativePath.replace(/\.test\.ts$/, '.md');
      } else if (markdownRelativePath.endsWith('.spec.ts')) {
        markdownRelativePath = markdownRelativePath.replace(/\.spec\.ts$/, '.md');
      }
      const testCount = fileData.summary.total;
      const categories = Object.keys(fileData.summary.categories).join(', ');
      const tags = fileData.summary.tags.join(', ');
      
      content += `| [${fileName}](${markdownRelativePath}) | ${testCount} | ${categories} | ${tags} |\n`;
    }

    // Add detailed breakdown by directory
    content += '\n## Directory Structure\n\n';
    const directories = new Map<string, FileDocumentation[]>();
    
    for (const [relativePath, fileData] of this.documentation) {
      const dir = path.dirname(relativePath);
      if (!directories.has(dir)) {
        directories.set(dir, []);
      }
      directories.get(dir)!.push(fileData);
    }

    for (const [dir, files] of directories) {
      content += `### ${dir}\n\n`;
      const totalTests = files.reduce((sum, file) => sum + file.summary.total, 0);
      content += `**Files:** ${files.length} | **Tests:** ${totalTests}\n\n`;
      
      for (const file of files.sort((a, b) => a.fileName.localeCompare(b.fileName))) {
        let markdownRelativePath = file.filePath;
        if (markdownRelativePath.endsWith('.test.ts')) {
          markdownRelativePath = markdownRelativePath.replace(/\.test\.ts$/, '.md');
        } else if (markdownRelativePath.endsWith('.spec.ts')) {
          markdownRelativePath = markdownRelativePath.replace(/\.spec\.ts$/, '.md');
        }
        content += `- [${file.fileName}](${markdownRelativePath}) (${file.summary.total} tests)\n`;
      }
      content += '\n';
    }

    content += '\n---\n';
    content += `*Generated on ${new Date().toISOString()}*\n`;
    content += '*Generator: markdown-docs.ts*\n';

    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`📋 Generated index: ${indexPath}`);
  }
}

export default MarkdownDocsGenerator;
