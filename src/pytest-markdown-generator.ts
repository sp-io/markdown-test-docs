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

interface TestClass {
  name: string;
  lineNumber: number;
  level: number;
}

interface TestCase {
  testName: string;
  shortName: string;
  className: string;
  link: string;
  description: string;
  lineNumber: number;
  tags: string[];
  markers: string[];
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

interface FileSummary {
  total: number;
  categories: Record<string, number>;
  tags: string[];
  markers: string[];
}

interface FileDocumentation {
  fileName: string;
  filePath: string;
  fullPath: string;
  tests: TestCase[];
  summary: FileSummary;
}

/**
 * Markdown documentation generator for pytest test files
 * Extracts test information from Python test files and generates markdown documentation
 */
class PytestMarkdownGenerator {
  private readonly testDir: string;
  private readonly docsDir: string;
  private readonly githubUrl: string | null;
  private readonly githubBranch: string;
  private readonly repositoryRoot: string;
  private readonly verbose: boolean;
  private readonly testFiles: string[];
  private readonly documentation: Map<string, FileDocumentation>;
  private readonly knownTags: Set<string>;

  constructor(options: GeneratorOptions = {}) {
    const isNonEmptyString = (str: string | undefined): str is string => {
      return typeof str === 'string' && str.trim().length > 0;
    };

    this.testDir = isNonEmptyString(options.sourceDir) ? path.resolve(options.sourceDir) : path.join(process.cwd(), 'tests');
    this.docsDir = isNonEmptyString(options.outputDir) ? path.resolve(options.outputDir) : path.join(process.cwd(), 'docs', 'tests');
    this.githubUrl = isNonEmptyString(options.githubUrl) ? options.githubUrl.replace(/\.git$/, '') : null;
    this.githubBranch = isNonEmptyString(options.githubBranch) ? options.githubBranch : 'main';
    this.repositoryRoot = isNonEmptyString(options.repositoryRoot) ? path.resolve(options.repositoryRoot) : process.cwd();
    this.verbose = options.verbose || false;
    this.testFiles = [];
    this.documentation = new Map<string, FileDocumentation>();
    this.knownTags = new Set(['given', 'when', 'then', 'and', 'param', 'fixture', 'mark', 'parametrize']);

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

  async generate(): Promise<void> {
    console.log('🚀 Starting pytest documentation generation...');
    
    this.ensureDocsDirectory();
    this.findTestFiles();
    
    for (const testFile of this.testFiles) {
      console.log(`📄 Processing: ${testFile}`);
      await this.processTestFile(testFile);
    }
    
    this.generateMarkdownFiles();
    this.generateAllTestsFile();
    this.generateIndexFile();
    
    console.log(`✅ Documentation generated successfully in ${this.docsDir}`);
  }

  private ensureDocsDirectory(): void {
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
      console.log(`📁 Created directory: ${this.docsDir}`);
    }
  }

  private findTestFiles(): void {
    console.log(`🔍 Looking for test files in: ${this.testDir}`);
    
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
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== '__pycache__') {
          findTestFilesRecursive(fullPath);
        } else if (entry.isFile() && (entry.name.startsWith('test_') || entry.name.endsWith('_test.py')) && entry.name.endsWith('.py')) {
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

  private async processTestFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.testDir, filePath);
    
    let fileName = path.basename(filePath);
    if (fileName.endsWith('.py')) {
      fileName = fileName.replace('.py', '');
    }
    
    const tests = this.extractTests(content, filePath);
    
    if (this.verbose) {
      console.log(`   Found ${tests.length} tests in ${fileName}`);
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

  private extractTests(content: string, filePath: string): TestCase[] {
    const tests: TestCase[] = [];
    const lines = content.split('\n');
    
    let currentClass: TestClass | null = null;
    let inDocstring = false;
    let docstringLines: string[] = [];
    let docstringIndentLevel = 0;
    let indentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      const lineNumber = i + 1;

      // Calculate indentation level
      const currentIndentLevel = line.length - line.trimLeft().length;

      // Handle triple-quoted docstrings
      if (!inDocstring && (trimmedLine.startsWith('"""') || trimmedLine.startsWith('\'\'\''))) {
        const quote = trimmedLine.startsWith('"""') ? '"""' : '\'\'\'';
        inDocstring = true;
        docstringLines = [];
        docstringIndentLevel = currentIndentLevel;
        
        // Check if docstring starts and ends on same line
        const afterQuote = trimmedLine.substring(3);
        if (afterQuote.includes(quote)) {
          inDocstring = false;
          const docContent = afterQuote.replace(quote, '').trim();
          if (docContent) {
            docstringLines.push(docContent);
          }
        } else {
          const docContent = afterQuote.trim();
          if (docContent) {
            docstringLines.push(docContent);
          }
        }
        continue;
      }

      if (inDocstring) {
        const quote = docstringLines.length === 0 && trimmedLine.includes('"""') ? '"""' : '\'\'\'';
        if (trimmedLine.includes(quote)) {
          inDocstring = false;
          const docContent = trimmedLine.replace(quote, '').trim();
          if (docContent) {
            docstringLines.push(docContent);
          }
        } else {
          // Remove common indentation from docstring lines
          const docContent = currentIndentLevel >= docstringIndentLevel + 4 
            ? line.substring(docstringIndentLevel + 4) 
            : trimmedLine;
          if (docContent.trim()) {
            docstringLines.push(docContent);
          }
        }
        continue;
      }

      // Extract class definitions
      const classMatch = trimmedLine.match(/^class\s+(\w+)(?:\([^)]*\))?:/);
      if (classMatch) {
        currentClass = {
          name: classMatch[1],
          lineNumber,
          level: currentIndentLevel
        };
        indentLevel = currentIndentLevel;
        continue;
      }

      // Reset class context when leaving class scope
      if (currentClass && currentIndentLevel <= currentClass.level && trimmedLine) {
        currentClass = null;
      }

      // Extract test functions - use matchAll to find ALL test functions
      const testMatches = [...line.matchAll(/^def\s+(test_\w+)\s*\([^)]*\):/g)];
      if (testMatches.length > 0) {
        for (const testMatch of testMatches) {
          const testName = testMatch[1];
          const className = currentClass?.name || 'Module Level Tests';
          const fullTestName = currentClass ? `${className}::${testName}` : testName;
          
          // Look for decorators above the test function
          const markers = this.extractMarkers(lines, i);
          
          const description = this.parseTestDescription(docstringLines);
          const link = this.generateTestLink(filePath, lineNumber, className, testName);
          
          tests.push({
            testName: fullTestName,
            shortName: testName,
            className,
            link,
            description,
            lineNumber,
            tags: this.extractTags(className, description, docstringLines),
            markers
          });
        }

        // Reset docstring after processing
        docstringLines = [];
      }

      // Clear docstring if we hit non-docstring, non-test code
      if (trimmedLine && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('@') && 
          !testMatches.length && !classMatch) {
        docstringLines = [];
      }
    }

    return tests;
  }

  private extractMarkers(lines: string[], testLineIndex: number): string[] {
    const markers: string[] = [];
    
    // Look backwards from test function for decorators
    for (let i = testLineIndex - 1; i >= 0; i--) {
      const line = lines[i].trim();
      
      if (!line || line.startsWith('#')) {
        continue;
      }
      
      if (line.startsWith('@')) {
        // Extract pytest markers
        const markerMatch = line.match(/@pytest\.mark\.(\w+)(?:\([^)]*\))?/);
        if (markerMatch) {
          markers.unshift(markerMatch[1]);
        }
        
        // Extract parametrize
        const paramMatch = line.match(/@pytest\.mark\.parametrize/);
        if (paramMatch) {
          markers.unshift('parametrize');
        }
        
        // Extract fixture
        const fixtureMatch = line.match(/@pytest\.fixture/);
        if (fixtureMatch) {
          markers.unshift('fixture');
        }
        
        continue;
      }
      
      // Stop if we hit non-decorator, non-comment line
      break;
    }
    
    return markers;
  }

  private parseTestDescription(docstringLines: string[]): string {
    if (docstringLines.length === 0) {
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

    for (const line of docstringLines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().startsWith('given:') || trimmedLine.toLowerCase().startsWith('given ')) {
        this.saveSectionText(sections, currentSection, currentText.trim());
        currentSection = 'given';
        currentText = trimmedLine.replace(/^given:?\s*/i, '');
      } else if (trimmedLine.toLowerCase().startsWith('when:') || trimmedLine.toLowerCase().startsWith('when ')) {
        this.saveSectionText(sections, currentSection, currentText.trim());
        currentSection = 'when';
        currentText = trimmedLine.replace(/^when:?\s*/i, '');
      } else if (trimmedLine.toLowerCase().startsWith('then:') || trimmedLine.toLowerCase().startsWith('then ')) {
        this.saveSectionText(sections, currentSection, currentText.trim());
        currentSection = 'then';
        currentText = trimmedLine.replace(/^then:?\s*/i, '');
      } else if (trimmedLine.toLowerCase().startsWith('and:') || trimmedLine.toLowerCase().startsWith('and ')) {
        this.saveSectionText(sections, currentSection, currentText.trim());
        currentSection = 'and';
        currentText = trimmedLine.replace(/^and:?\s*/i, '');
      } else if (trimmedLine.startsWith('Args:') || trimmedLine.startsWith('Parameters:') || 
                 trimmedLine.startsWith('Returns:') || trimmedLine.startsWith('Raises:')) {
        // Skip standard docstring sections
        continue;
      } else {
        if (currentText) {
          currentText += ' ' + trimmedLine;
        } else {
          currentText = trimmedLine;
        }
      }
    }

    // Save the last section
    if (currentText.trim()) {
      this.saveSectionText(sections, currentSection, currentText.trim());
    }

    // Build formatted description
    const formattedParts: string[] = [];
    
    if (sections.description.length > 0) {
      formattedParts.push(`**${sections.description.join(' ')}**`);
    }
    
    if (sections.given) {
      formattedParts.push(`**Given:** ${sections.given}`);
    }
    if (sections.when) {
      formattedParts.push(`**When:** ${sections.when}`);
    }
    if (sections.then) {
      formattedParts.push(`**Then:** ${sections.then}`);
    }
    
    if (sections.and.length > 0) {
      sections.and.forEach(andClause => {
        formattedParts.push(`**And:** ${andClause}`);
      });
    }

    return formattedParts.join('<br>');
  }

  private saveSectionText(sections: TestDescription, currentSection: keyof TestDescription, text: string): void {
    if (!text) return;
    
    if (currentSection === 'description') {
      sections.description.push(text);
    } else if (currentSection === 'and') {
      sections.and.push(text);
    } else {
      sections[currentSection] = text;
    }
  }

  private extractTags(className: string, description: string, docstringLines: string[]): string[] {
    const tags: string[] = [];
    
    // Extract tags from class name
    const classTagMatches = className.match(/Test(\w+)/);
    if (classTagMatches) {
      tags.push(classTagMatches[1].toLowerCase());
    }

    // Extract tags from docstring
    const allDocText = docstringLines.join(' ').toLowerCase();
    
    if (allDocText.includes('integration') || allDocText.includes('e2e')) {
      tags.push('integration');
    }
    if (allDocText.includes('unit')) {
      tags.push('unit');
    }
    if (allDocText.includes('smoke')) {
      tags.push('smoke');
    }
    if (description.toLowerCase().includes('failure') || description.toLowerCase().includes('error')) {
      tags.push('error-case');
    }
    if (description.toLowerCase().includes('should not') || description.toLowerCase().includes('should fail')) {
      tags.push('negative-test');
    }

    return [...new Set(tags)];
  }

  private generateTestLink(filePath: string, lineNumber: number, className: string, testName: string): string {
    const repoRelativePath = path.relative(this.repositoryRoot, filePath);
    
    if (this.githubUrl) {
      const normalizedGithubUrl = this.githubUrl.replace(/\/$/, '');
      const githubPath = repoRelativePath.replace(/\\/g, '/');
      return `${normalizedGithubUrl}/blob/${this.githubBranch}/${githubPath}#L${lineNumber}`;
    } else {
      return `${repoRelativePath.replace(/\\/g, '/')}#L${lineNumber}`;
    }
  }

  private generateFileSummary(tests: TestCase[]): FileSummary {
    const total = tests.length;
    const categories: Record<string, number> = {};
    const tags = new Set<string>();
    const markers = new Set<string>();

    tests.forEach(test => {
      const category = test.className;
      categories[category] = (categories[category] || 0) + 1;
      
      test.tags.forEach(tag => tags.add(tag));
      test.markers.forEach(marker => markers.add(marker));
    });

    return {
      total,
      categories,
      tags: Array.from(tags),
      markers: Array.from(markers)
    };
  }

  private generateMarkdownFiles(): void {
    for (const [relativePath, fileData] of this.documentation) {
      let markdownRelativePath = relativePath;
      if (markdownRelativePath.endsWith('.py')) {
        markdownRelativePath = markdownRelativePath.replace(/\.py$/, '.md');
      }
      
      const markdownPath = path.join(this.docsDir, markdownRelativePath);
      
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

  private generateMarkdownContent(fileData: FileDocumentation): string {
    const { fileName, filePath, tests, summary } = fileData;
    
    let content = `# ${fileName} Test Documentation\n\n`;
    content += `**File:** \`${filePath}\`\n\n`;
    content += `**Total Tests:** ${summary.total}\n\n`;
    
    if (summary.tags.length > 0) {
      content += `**Tags:** ${summary.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`;
    }

    if (summary.markers.length > 0) {
      content += `**Pytest Markers:** ${summary.markers.map(marker => `\`@pytest.mark.${marker}\``).join(', ')}\n\n`;
    }

    if (Object.keys(summary.categories).length > 1) {
      content += '## Test Categories\n\n';
      for (const [category, count] of Object.entries(summary.categories)) {
        content += `- **${category}:** ${count} tests\n`;
      }
      content += '\n';
    }

    content += '## Test Cases\n\n';
    content += '| Link | Test Name | Markers | Description |\n';
    content += '|------|-----------|---------|-------------|\n';
    
    for (const test of tests) {
      const testName = this.escapeMarkdown(test.testName);
      const link = `[L${test.lineNumber}](${test.link})`;
      const markers = test.markers.length > 0 
        ? test.markers.map(m => `\`@${m}\``).join(' ') 
        : '-';
      const description = this.escapeMarkdown(test.description || 'No description available');
      
      content += `| ${link} | ${testName} | ${markers} | ${description} |\n`;
    }

    content += '\n---\n';

    return content;
  }

  private escapeMarkdown(text: string): string {
    return text
      .replace(/\|/g, '\\|')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private generateAllTestsFile(): void {
    const allTestsPath = path.join(this.docsDir, 'ALL_TESTS.md');
    
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

    allTests.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      if (a.fileName !== b.fileName) {
        return a.fileName.localeCompare(b.fileName);
      }
      return a.lineNumber - b.lineNumber;
    });

    let content = '# All Pytest Tests Documentation\n\n';
    content += 'This file contains a comprehensive list of all test cases across the entire project.\n\n';
    content += `**Total Test Files:** ${this.documentation.size}\n`;
    content += `**Total Test Cases:** ${allTests.length}\n\n`;

    const categoryStats: Record<string, number> = {};
    allTests.forEach(test => {
      categoryStats[test.category] = (categoryStats[test.category] || 0) + 1;
    });

    content += '## Test Distribution\n\n';
    for (const [category, count] of Object.entries(categoryStats).sort()) {
      content += `- **${category}:** ${count} tests\n`;
    }
    content += '\n';

    content += '## All Test Cases\n\n';
    content += '| Category | File | Link | Test Name | Markers | Description |\n';
    content += '|----------|------|------|-----------|---------|-------------|\n';
    
    for (const test of allTests) {
      const category = this.escapeMarkdown(test.category);
      let markdownRelativePath = test.filePath;
      if (markdownRelativePath.endsWith('.py')) {
        markdownRelativePath = markdownRelativePath.replace(/\.py$/, '.md');
      }
      const fileName = `[${test.fileName}](${markdownRelativePath})`;
      const testName = this.escapeMarkdown(test.testName);
      const link = `[L${test.lineNumber}](${test.link})`;
      const markers = test.markers.length > 0 
        ? test.markers.map(m => `\`@${m}\``).join(' ') 
        : '-';
      const description = this.escapeMarkdown(test.description || 'No description available');
      
      content += `| ${category} | ${fileName} | ${link} | ${testName} | ${markers} | ${description} |\n`;
    }

    // Add marker-based index
    const allMarkers = new Set<string>();
    allTests.forEach(test => {
      test.markers.forEach(marker => allMarkers.add(marker));
    });

    if (allMarkers.size > 0) {
      content += '\n## Tests by Pytest Marker\n\n';
      
      for (const marker of Array.from(allMarkers).sort()) {
        const testsWithMarker = allTests.filter(test => test.markers.includes(marker));
        content += `### @pytest.mark.${marker} (${testsWithMarker.length} tests)\n\n`;
        
        content += '| File | Link | Test Name |\n';
        content += '|------|------|-----------|\n';
        
        for (const test of testsWithMarker) {
          let markdownRelativePath = test.filePath;
          if (markdownRelativePath.endsWith('.py')) {
            markdownRelativePath = markdownRelativePath.replace(/\.py$/, '.md');
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
    content += '*Generator: pytest-markdown-generator*\n';

    fs.writeFileSync(allTestsPath, content, 'utf8');
    console.log(`📊 Generated all tests file: ${allTestsPath}`);
  }

  private getCategoryFromPath(relativePath: string): string {
    const dir = path.dirname(relativePath);
    return dir === '.' ? 'Root' : dir.charAt(0).toUpperCase() + dir.slice(1);
  }

  private generateIndexFile(): void {
    const indexPath = path.join(this.docsDir, 'README.md');
    
    let content = '# Pytest Test Documentation Index\n\n';
    content += 'This directory contains automatically generated documentation for all pytest test files.\n\n';
    content += `**Total Files:** ${this.documentation.size}\n`;
    content += `**Total Tests:** ${Array.from(this.documentation.values()).reduce((sum, file) => sum + file.summary.total, 0)}\n\n`;

    content += '## Quick Navigation\n\n';
    content += '- 📊 **[ALL_TESTS.md](ALL_TESTS.md)** - Comprehensive list of all test cases\n';
    content += '- 📁 **Individual Files** - Detailed documentation for each test file\n\n';

    content += '## Files Overview\n\n';
    content += '| File | Test Count | Categories | Tags | Markers |\n';
    content += '|------|------------|------------|------|---------|\n';

    const sortedFiles = Array.from(this.documentation.entries()).sort(([a], [b]) => a.localeCompare(b));
    
    for (const [relativePath, fileData] of sortedFiles) {
      const fileName = fileData.fileName;
      let markdownRelativePath = relativePath;
      if (markdownRelativePath.endsWith('.py')) {
        markdownRelativePath = markdownRelativePath.replace(/\.py$/, '.md');
      }
      const testCount = fileData.summary.total;
      const categories = Object.keys(fileData.summary.categories).join(', ');
      const tags = fileData.summary.tags.join(', ');
      const markers = fileData.summary.markers.join(', ');
      
      content += `| [${fileName}](${markdownRelativePath}) | ${testCount} | ${categories} | ${tags} | ${markers} |\n`;
    }

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
        if (markdownRelativePath.endsWith('.py')) {
          markdownRelativePath = markdownRelativePath.replace(/\.py$/, '.md');
        }
        content += `- [${file.fileName}](${markdownRelativePath}) (${file.summary.total} tests)\n`;
      }
      content += '\n';
    }

    content += '\n---\n';
    content += '*Generator: pytest-markdown-generator*\n';

    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`📋 Generated index: ${indexPath}`);
  }
}

export default PytestMarkdownGenerator;