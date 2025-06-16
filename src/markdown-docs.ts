import path from 'path';
import { GeneratorOptions, FileDocumentation, TestFramework } from './types';
import { FileUtils } from './file-utils';
import { LinkGenerator } from './link-generator';
import { TestExtractor } from './test-extractor';
import { PytestExtractor } from './pytest-extractor';
import { FrameworkDetector } from './framework-detector';
import { MarkdownGenerator } from './markdown-generator';

/**
 * Markdown documentation generator for Jest and Vitest test files
 * Extracts test information from TypeScript test files and generates markdown documentation
 */
class MarkdownDocsGenerator {
  private readonly testDir: string;
  private readonly docsDir: string;
  private readonly verbose: boolean;
  private readonly testFramework: TestFramework;
  private readonly fileUtils: FileUtils;
  private readonly linkGenerator: LinkGenerator;
  private readonly testExtractor: TestExtractor;
  private readonly pytestExtractor: PytestExtractor;
  private readonly markdownGenerator: MarkdownGenerator;
  private readonly documentation: Map<string, FileDocumentation>;

  /**
   * @param options - Configuration options
   */
  constructor(options: GeneratorOptions = {}) {
    this.fileUtils = new FileUtils(options.verbose || false);
    
    this.testDir = this.fileUtils.isNonEmptyString(options.sourceDir) 
      ? path.resolve(options.sourceDir) 
      : path.join(process.cwd(), 'src', 'test');
    
    this.docsDir = this.fileUtils.isNonEmptyString(options.outputDir) 
      ? path.resolve(options.outputDir) 
      : path.join(process.cwd(), 'doc', 'tests');
    
    const githubUrl = this.fileUtils.isNonEmptyString(options.githubUrl) 
      ? options.githubUrl.replace(/\.git$/, '') 
      : null;
    const githubBranch = this.fileUtils.isNonEmptyString(options.githubBranch) 
      ? options.githubBranch 
      : 'main';
    const repositoryRoot = this.fileUtils.isNonEmptyString(options.repositoryRoot) 
      ? path.resolve(options.repositoryRoot) 
      : process.cwd();
    
    this.verbose = options.verbose || false;
    this.testFramework = options.testFramework || 'auto';
    this.documentation = new Map<string, FileDocumentation>();

    // Initialize modules
    this.linkGenerator = new LinkGenerator(githubUrl, githubBranch, repositoryRoot);
    this.testExtractor = new TestExtractor(this.linkGenerator, this.verbose);
    this.pytestExtractor = new PytestExtractor(this.linkGenerator, this.verbose);
    this.markdownGenerator = new MarkdownGenerator(this.linkGenerator);

    console.log(`Source directory: ${this.testDir}`);
    console.log(`Output directory: ${this.docsDir}`);
    console.log(`Test framework: ${this.testFramework}`);
    console.log(`Repository root: ${repositoryRoot}`);
    if (githubUrl) {
      console.log(`GitHub URL: ${githubUrl}`);
      console.log(`GitHub branch: ${githubBranch}`);
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
    this.fileUtils.ensureDirectory(this.docsDir);
    
    // Find all test files
    const testFiles = this.fileUtils.findTestFiles(this.testDir, this.testFramework);
    
    // Process each test file
    for (const testFile of testFiles) {
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
   * Process a single test file and extract test information
   */
  private async processTestFile(filePath: string): Promise<void> {
    const content = this.fileUtils.readFileContent(filePath);
    const relativePath = path.relative(this.testDir, filePath);
    const fileName = this.fileUtils.getFileNameWithoutExtension(filePath);
    
    // Detect framework for this specific file
    const fileFramework = this.testFramework === 'auto' 
      ? FrameworkDetector.detectFramework(filePath, content)
      : this.testFramework;
    
    // Choose appropriate extractor
    const tests = fileFramework === 'pytest' 
      ? this.pytestExtractor.extractTests(content, filePath)
      : this.testExtractor.extractTests(content, filePath);
    
    if (this.verbose) {
      console.log(`   Found ${tests.length} tests in ${fileName} (${fileFramework})`);
      const summary = fileFramework === 'pytest'
        ? this.pytestExtractor.generateFileSummary(tests)
        : this.testExtractor.generateFileSummary(tests);
      console.log(`   Test types: Regular: ${summary.testTypes.regular}, Skipped: ${summary.testTypes.skipped}, Todo: ${summary.testTypes.todo}, Each: ${summary.testTypes.each}, Only: ${summary.testTypes.only}, Concurrent: ${summary.testTypes.concurrent}, Benchmark: ${summary.testTypes.benchmark}, Marked: ${summary.testTypes.marked}, Parametrize: ${summary.testTypes.parametrize}`);
    }
    
    if (tests.length > 0) {
      this.documentation.set(relativePath, {
        fileName,
        filePath: relativePath,
        fullPath: filePath,
        tests,
        summary: fileFramework === 'pytest'
          ? this.pytestExtractor.generateFileSummary(tests)
          : this.testExtractor.generateFileSummary(tests),
        framework: fileFramework
      });
    } else if (this.verbose) {
      console.log(`   ⚠️  No tests extracted from ${fileName} - check test structure`);
    }
  }

  /**
   * Generate markdown files for each test file
   */
  private generateMarkdownFiles(): void {
    for (const [relativePath, fileData] of this.documentation) {
      const markdownRelativePath = this.linkGenerator.getMarkdownPath(relativePath);
      const markdownPath = path.join(this.docsDir, markdownRelativePath);
      const content = this.markdownGenerator.generateMarkdownContent(fileData);
      
      this.fileUtils.writeFile(markdownPath, content);
    }
  }

  /**
   * Generate comprehensive ALL_TESTS.md file with all test cases
   */
  private generateAllTestsFile(): void {
    const allTestsPath = path.join(this.docsDir, 'ALL_TESTS.md');
    const content = this.markdownGenerator.generateAllTestsContent(this.documentation);
    
    this.fileUtils.writeFile(allTestsPath, content);
    console.log(`📊 Generated all tests file: ${allTestsPath}`);
  }

  /**
   * Generate the index file listing all documented files
   */
  private generateIndexFile(): void {
    const indexPath = path.join(this.docsDir, 'README.md');
    const content = this.markdownGenerator.generateIndexContent(this.documentation);
    
    this.fileUtils.writeFile(indexPath, content);
    console.log(`📋 Generated index: ${indexPath}`);
  }
}

export default MarkdownDocsGenerator;
