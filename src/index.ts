/**
 * Export the main MarkdownDocsGenerator class
 * This allows importing the generator in TypeScript projects
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Markdown documentation generator for Jest/Vitest test files
 * Extracts test information from TypeScript test files and generates markdown documentation
 */
export class MarkdownDocsGenerator {
  private testDir: string;
  private docsDir: string;
  private githubUrl: string | null;
  private githubBranch: string;
  private repositoryRoot: string;
  private verbose: boolean;
  private testFiles: string[];
  private documentation: Map<string, any>;
  private knownTags: Set<string>;

  /**
   * @param {Object} options - Configuration options
   * @param {string} [options.sourceDir] - Custom source directory path
   * @param {string} [options.outputDir] - Custom output directory path
   * @param {string} [options.githubUrl] - GitHub repository URL (e.g., 'https://github.com/username/repo')
   * @param {string} [options.githubBranch] - GitHub branch name (default: 'main')
   * @param {string} [options.repositoryRoot] - Repository root directory (default: current working directory)
   * @param {boolean} [options.verbose] - Enable verbose logging (default: false)
   */
  constructor(options: { 
    sourceDir?: string; 
    outputDir?: string; 
    githubUrl?: string;
    githubBranch?: string;
    repositoryRoot?: string;
    verbose?: boolean;
  } = {}) {
    this.testDir = options.sourceDir ? path.resolve(options.sourceDir) : path.join(process.cwd(), 'src', 'test');
    this.docsDir = options.outputDir ? path.resolve(options.outputDir) : path.join(process.cwd(), 'doc', 'tests');
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
    const findTestFilesRecursive = (dir: string): void => {
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
  private async processTestFile(filePath: string): Promise<void> {
    // Implementation will be added in the future
    // This is a placeholder method for the TypeScript version
    console.log(`Processing file: ${filePath}`);
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
   * Generate markdown files for each test file
   */
  private generateMarkdownFiles(): void {
    // Implementation will be added in the future
    // This is a placeholder method for the TypeScript version
    console.log('Generating markdown files...');
  }

  /**
   * Generate comprehensive ALL_TESTS.md file with all test cases
   */
  private generateAllTestsFile(): void {
    // Implementation will be added in the future
    // This is a placeholder method for the TypeScript version
    console.log('Generating all tests file...');
  }

  /**
   * Generate the index file listing all documented files
   */
  private generateIndexFile(): void {
    // Implementation will be added in the future
    // This is a placeholder method for the TypeScript version
    console.log('Generating index file...');
  }
}

// Enable direct execution from command line
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options: { 
    sourceDir?: string; 
    outputDir?: string;
    githubUrl?: string;
    githubBranch?: string;
    repositoryRoot?: string;
    verbose?: boolean;
  } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && i + 1 < args.length) {
      options.sourceDir = args[i + 1];
      i++;
    } else if (args[i] === '--output' && i + 1 < args.length) {
      options.outputDir = args[i + 1];
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

  const generator = new MarkdownDocsGenerator(options);
  generator.generate().catch(error => {
    console.error('❌ Error generating documentation:', error);
    process.exit(1);
  });
}
