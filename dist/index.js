/**
 * Export the main MarkdownDocsGenerator class
 * This allows importing the generator in TypeScript projects
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownDocsGenerator = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
/**
 * Markdown documentation generator for Jest/Vitest test files
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
                }
                else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.spec.ts'))) {
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
        // Implementation will be added in the future
        // This is a placeholder method for the TypeScript version
        console.log(`Processing file: ${filePath}`);
    }
    /**
     * Generate a link to the specific test in the file
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
        }
        else {
            // Fallback to relative path from repository root
            return `${repoRelativePath.replace(/\\/g, '/')}#L${lineNumber}`;
        }
    }
    /**
     * Generate markdown files for each test file
     */
    generateMarkdownFiles() {
        // Implementation will be added in the future
        // This is a placeholder method for the TypeScript version
        console.log('Generating markdown files...');
    }
    /**
     * Generate comprehensive ALL_TESTS.md file with all test cases
     */
    generateAllTestsFile() {
        // Implementation will be added in the future
        // This is a placeholder method for the TypeScript version
        console.log('Generating all tests file...');
    }
    /**
     * Generate the index file listing all documented files
     */
    generateIndexFile() {
        // Implementation will be added in the future
        // This is a placeholder method for the TypeScript version
        console.log('Generating index file...');
    }
}
exports.MarkdownDocsGenerator = MarkdownDocsGenerator;
// Enable direct execution from command line
if (require.main === module) {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--source' && i + 1 < args.length) {
            options.sourceDir = args[i + 1];
            i++;
        }
        else if (args[i] === '--output' && i + 1 < args.length) {
            options.outputDir = args[i + 1];
            i++;
        }
        else if (args[i] === '--github-url' && i + 1 < args.length) {
            options.githubUrl = args[i + 1];
            i++;
        }
        else if (args[i] === '--github-branch' && i + 1 < args.length) {
            options.githubBranch = args[i + 1];
            i++;
        }
        else if (args[i] === '--repository-root' && i + 1 < args.length) {
            options.repositoryRoot = args[i + 1];
            i++;
        }
        else if (args[i] === '--verbose' || args[i] === '-v') {
            options.verbose = true;
        }
    }
    const generator = new MarkdownDocsGenerator(options);
    generator.generate().catch(error => {
        console.error('❌ Error generating documentation:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map
