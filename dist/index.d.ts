/**
 * Export the main MarkdownDocsGenerator class
 * This allows importing the generator in TypeScript projects
 */
/**
 * Markdown documentation generator for Jest/Vitest test files
 * Extracts test information from TypeScript test files and generates markdown documentation
 */
export declare class MarkdownDocsGenerator {
    private testDir;
    private docsDir;
    private githubUrl;
    private githubBranch;
    private repositoryRoot;
    private verbose;
    private testFiles;
    private documentation;
    private knownTags;
    /**
     * @param {Object} options - Configuration options
     * @param {string} [options.sourceDir] - Custom source directory path
     * @param {string} [options.outputDir] - Custom output directory path
     * @param {string} [options.githubUrl] - GitHub repository URL (e.g., 'https://github.com/username/repo')
     * @param {string} [options.githubBranch] - GitHub branch name (default: 'main')
     * @param {string} [options.repositoryRoot] - Repository root directory (default: current working directory)
     * @param {boolean} [options.verbose] - Enable verbose logging (default: false)
     */
    constructor(options?: {
        sourceDir?: string;
        outputDir?: string;
        githubUrl?: string;
        githubBranch?: string;
        repositoryRoot?: string;
        verbose?: boolean;
    });
    /**
     * Initialize the documentation generation process
     */
    generate(): Promise<void>;
    /**
     * Ensure the documentation directory exists
     */
    private ensureDocsDirectory;
    /**
     * Recursively find all test files
     */
    private findTestFiles;
    /**
     * Process a single test file and extract test information
     */
    private processTestFile;
    /**
     * Generate a link to the specific test in the file
     */
    private generateTestLink;
    /**
     * Generate markdown files for each test file
     */
    private generateMarkdownFiles;
    /**
     * Generate comprehensive ALL_TESTS.md file with all test cases
     */
    private generateAllTestsFile;
    /**
     * Generate the index file listing all documented files
     */
    private generateIndexFile;
}
