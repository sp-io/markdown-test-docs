#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command-line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    source: null,
    output: null,
    githubUrl: null,
    githubBranch: null,
    repositoryRoot: null,
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && i + 1 < args.length) {
      options.source = args[i + 1];
      i++;
    } else if (args[i] === '--output' && i + 1 < args.length) {
      options.output = args[i + 1];
      i++;
    } else if (args[i] === '--github-url' && i + 1 < args.length) {
      options.githubUrl = args[i + 1];
      i++;
    } else if (args[i] === '--github-branch' && i + 1 < args.length) {
      options.githubBranch = args[i + 1];
      i++;
    } else if (args[i] === '--repository-root' && i + 1 < args.length) {
      options.repositoryRoot = args[i + 1];
      i++;
    } else if (args[i] === '--verbose' || args[i] === '-v') {
      options.verbose = true;
    }
  }

  return options;
}

/**
 * Markdown documentation generator for Jest test files
 * Extracts test information from TypeScript test files and generates markdown documentation
 */
class MarkdownDocsGenerator {
  /**
   * @param {Object} options - Configuration options
   * @param {string} [options.sourceDir] - Custom source directory path
   * @param {string} [options.outputDir] - Custom output directory path
   * @param {string} [options.githubUrl] - GitHub repository URL (e.g., 'https://github.com/username/repo')
   * @param {string} [options.githubBranch] - GitHub branch name (default: 'main')
   * @param {string} [options.repositoryRoot] - Repository root directory (default: current working directory)
   * @param {boolean} [options.verbose] - Enable verbose logging (default: false)
   */
  constructor(options = {}) {
    this.testDir = options.sourceDir ? path.resolve(options.sourceDir) : path.join(__dirname, 'src', 'test');
    this.docsDir = options.outputDir ? path.resolve(options.outputDir) : path.join(__dirname, 'doc', 'tests');
    this.githubUrl = options.githubUrl || null;
    this.githubBranch = options.githubBranch || 'main';
    this.repositoryRoot = options.repositoryRoot ? path.resolve(options.repositoryRoot) : process.cwd();
    this.verbose = options.verbose || false;
    this.testFiles = [];
    this.documentation = new Map();
    this.knownTags = new Set(['given', 'when', 'then', 'and']);

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
  async generate() {
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
  ensureDocsDirectory() {
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
      console.log(`📁 Created directory: ${this.docsDir}`);
    }
  }

  /**
   * Recursively find all test files
   */
  findTestFiles() {
    const findTestFilesRecursive = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          findTestFilesRecursive(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.spec.ts'))) {
          this.testFiles.push(fullPath);
        }
      }
    };

    findTestFilesRecursive(this.testDir);
    console.log(`🔍 Found ${this.testFiles.length} test files`);
  }

  /**
   * Process a single test file and extract test information
   */
  async processTestFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.testDir, filePath);
    const fileName = path.basename(filePath, '.test.ts');
    
    const tests = this.extractTests(content, filePath);
    
    if (tests.length > 0) {
      this.documentation.set(relativePath, {
        fileName,
        filePath: relativePath,
        fullPath: filePath,
        tests,
        summary: this.generateFileSummary(tests)
      });
    }
  }

  /**
   * Extract test information from file content
   */
  extractTests(content, filePath) {
    const tests = [];
    const lines = content.split('\n');
    
    let currentDescribe = null;
    let currentTest = null;
    let inComment = false;
    let commentLines = [];
    let braceLevel = 0;
    let inDescribeBlock = false;
    let inTestBlock = false;

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
        inDescribeBlock = true;
        continue;
      }

      // Extract test cases (it, test)
      const testMatch = line.match(/(?:it|test)(?:\.each\([^)]*\))?\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (testMatch && currentDescribe) {
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
          tags: this.extractTags(currentDescribe.name, description)
        });

        // Reset comment lines after processing
        commentLines = [];
        inTestBlock = true;
      }

      // Reset scope tracking when leaving blocks
      if (braceLevel < currentDescribe?.level) {
        inDescribeBlock = false;
        currentDescribe = null;
      }
    }

    return tests;
  }

  /**
   * Parse test description from TSDoc comments
   */
  parseTestDescription(commentLines) {
    if (commentLines.length === 0) {
      return '';
    }

    const sections = {
      description: [],
      given: '',
      when: '',
      then: '',
      and: []
    };
    
    let currentSection = 'description';
    let currentText = '';

    for (const line of commentLines) {
      if (line.startsWith('@given')) {
        // Save previous section
        if (currentText.trim()) {
          if (currentSection === 'description') {
            sections.description.push(currentText.trim());
          } else if (currentSection === 'and') {
            sections.and.push(currentText.trim());
          } else {
            sections[currentSection] = currentText.trim();
          }
        }
        currentSection = 'given';
        currentText = line.replace('@given', '').trim();
      } else if (line.startsWith('@when')) {
        // Save previous section
        if (currentText.trim()) {
          if (currentSection === 'description') {
            sections.description.push(currentText.trim());
          } else if (currentSection === 'and') {
            sections.and.push(currentText.trim());
          } else {
            sections[currentSection] = currentText.trim();
          }
        }
        currentSection = 'when';
        currentText = line.replace('@when', '').trim();
      } else if (line.startsWith('@then')) {
        // Save previous section
        if (currentText.trim()) {
          if (currentSection === 'description') {
            sections.description.push(currentText.trim());
          } else if (currentSection === 'and') {
            sections.and.push(currentText.trim());
          } else {
            sections[currentSection] = currentText.trim();
          }
        }
        currentSection = 'then';
        currentText = line.replace('@then', '').trim();
      } else if (line.startsWith('@and')) {
        // Save previous section
        if (currentText.trim()) {
          if (currentSection === 'description') {
            sections.description.push(currentText.trim());
          } else if (currentSection === 'and') {
            sections.and.push(currentText.trim());
          } else {
            sections[currentSection] = currentText.trim();
          }
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
      if (currentSection === 'description') {
        sections.description.push(currentText.trim());
      } else if (currentSection === 'and') {
        sections.and.push(currentText.trim());
      } else {
        sections[currentSection] = currentText.trim();
      }
    }

    // Build formatted description
    const formattedParts = [];
    
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
   * Extract tags from test name and description
   */
  extractTags(describeName, description) {
    const tags = [];
    
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
   * @param {string} filePath - Full path to the test file
   * @param {number} lineNumber - Line number of the test
   * @param {string} describeName - Name of the describe block
   * @param {string} testName - Name of the test case
   * @returns {string} Link to the test (GitHub URL if configured, otherwise relative path)
   */
  generateTestLink(filePath, lineNumber, describeName, testName) {
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
   * Generate a summary for the file
   */
  generateFileSummary(tests) {
    const total = tests.length;
    const categories = {};
    const tags = new Set();

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
      tags: Array.from(tags)
    };
  }

  /**
   * Generate markdown files for each test file
   */
  generateMarkdownFiles() {
    for (const [relativePath, fileData] of this.documentation) {
      const markdownPath = path.join(this.docsDir, `${fileData.fileName}.md`);
      const content = this.generateMarkdownContent(fileData);
      
      fs.writeFileSync(markdownPath, content, 'utf8');
      console.log(`📝 Generated: ${markdownPath}`);
    }
  }

  /**
   * Generate markdown content for a single file
   */
  generateMarkdownContent(fileData) {
    const { fileName, filePath, tests, summary } = fileData;
    
    let content = `# ${fileName} Test Documentation\n\n`;
    content += `**File:** \`${filePath}\`\n\n`;
    content += `**Total Tests:** ${summary.total}\n\n`;
    
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

    // Add test cases table
    content += '## Test Cases\n\n';
    content += '| Test Name | Link | Description |\n';
    content += '|-----------|------|-------------|\n';
    
    for (const test of tests) {
      const testName = this.escapeMarkdown(test.testName);
      const link = `[L${test.lineNumber}](${test.link})`;
      const description = this.escapeMarkdown(test.description || 'No description available');
      
      content += `| ${testName} | ${link} | ${description} |\n`;
    }

    content += '\n---\n';
    content += `*Generated on ${new Date().toISOString()}*\n`;

    return content;
  }

  /**
   * Escape markdown special characters
   */
  escapeMarkdown(text) {
    return text
      .replace(/\|/g, '\\|')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Generate comprehensive ALL_TESTS.md file with all test cases
   */
  generateAllTestsFile() {
    const allTestsPath = path.join(this.docsDir, 'ALL_TESTS.md');
    
    // Collect all tests from all files
    const allTests = [];
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
    const categoryStats = {};
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
    content += '| Category | File | Test Name | Link | Description |\n';
    content += '|----------|------|-----------|------|-------------|\n';
    
    for (const test of allTests) {
      const category = this.escapeMarkdown(test.category);
      const fileName = `[${test.fileName}](${test.fileName}.md)`;
      const testName = this.escapeMarkdown(test.testName);
      const link = `[L${test.lineNumber}](${test.link})`;
      const description = this.escapeMarkdown(test.description || 'No description available');
      
      content += `| ${category} | ${fileName} | ${testName} | ${link} | ${description} |\n`;
    }

    // Add tag-based index
    const allTags = new Set();
    allTests.forEach(test => {
      test.tags.forEach(tag => allTags.add(tag));
    });

    if (allTags.size > 0) {
      content += '\n## Tests by Tag\n\n';
      
      for (const tag of Array.from(allTags).sort()) {
        const testsWithTag = allTests.filter(test => test.tags.includes(tag));
        content += `### ${tag} (${testsWithTag.length} tests)\n\n`;
        
        content += '| File | Test Name | Link |\n';
        content += '|------|-----------|------|\n';
        
        for (const test of testsWithTag) {
          const fileName = `[${test.fileName}](${test.fileName}.md)`;
          const testName = this.escapeMarkdown(test.testName);
          const link = `[L${test.lineNumber}](${test.link})`;
          
          content += `| ${fileName} | ${testName} | ${link} |\n`;
        }
        content += '\n';
      }
    }

    content += '\n---\n';
    content += `*Generated on ${new Date().toISOString()}*\n`;
    content += '*Generator: markdown-docs.cjs*\n';

    fs.writeFileSync(allTestsPath, content, 'utf8');
    console.log(`📊 Generated all tests file: ${allTestsPath}`);
  }

  /**
   * Get category name from file path
   */
  getCategoryFromPath(relativePath) {
    const dir = path.dirname(relativePath);
    return dir.charAt(0).toUpperCase() + dir.slice(1);
  }
  /**
   * Generate the index file listing all documented files
   */
  generateIndexFile() {
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
      const markdownFile = `${fileName}.md`;
      const testCount = fileData.summary.total;
      const categories = Object.keys(fileData.summary.categories).join(', ');
      const tags = fileData.summary.tags.join(', ');
      
      content += `| [${fileName}](${markdownFile}) | ${testCount} | ${categories} | ${tags} |\n`;
    }

    // Add detailed breakdown by directory
    content += '\n## Directory Structure\n\n';
    const directories = new Map();
    
    for (const [relativePath, fileData] of this.documentation) {
      const dir = path.dirname(relativePath);
      if (!directories.has(dir)) {
        directories.set(dir, []);
      }
      directories.get(dir).push(fileData);
    }

    for (const [dir, files] of directories) {
      content += `### ${dir}\n\n`;
      const totalTests = files.reduce((sum, file) => sum + file.summary.total, 0);
      content += `**Files:** ${files.length} | **Tests:** ${totalTests}\n\n`;
      
      for (const file of files.sort((a, b) => a.fileName.localeCompare(b.fileName))) {
        content += `- [${file.fileName}](${file.fileName}.md) (${file.summary.total} tests)\n`;
      }
      content += '\n';
    }

    content += '\n---\n';
    content += `*Generated on ${new Date().toISOString()}*\n`;
    content += '*Generator: markdown-docs.cjs*\n';

    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`📋 Generated index: ${indexPath}`);
  }
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  const generator = new MarkdownDocsGenerator({
    sourceDir: options.source,
    outputDir: options.output,
    githubUrl: options.githubUrl,
    githubBranch: options.githubBranch,
    repositoryRoot: options.repositoryRoot,
    verbose: options.verbose
  });

  generator.generate().catch(error => {
    console.error('❌ Error generating documentation:', error);
    process.exit(1);
  });
}

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
Usage: markdown-docs.cjs [options]

Options:
  --source <path>          Specify custom source directory (default: ./src/test)
  --output <path>          Specify custom output directory (default: ./doc/tests)
  --github-url <url>       GitHub repository URL (e.g., 'https://github.com/username/repo')
  --github-branch <branch> GitHub branch name (default: 'main')
  --repository-root <path> Repository root directory (default: current working directory)
  --verbose, -v            Enable verbose logging (shows unknown tags and additional info)

Examples:
  markdown-docs.cjs --source ./custom/test-dir --output ./custom/docs-dir
  
  markdown-docs.cjs --github-url https://github.com/username/repo --github-branch main
  
  markdown-docs.cjs --source ./src/test --github-url https://github.com/username/repo --repository-root ./ --verbose
`);
}

module.exports = MarkdownDocsGenerator;
