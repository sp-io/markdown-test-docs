interface GeneratorOptions {
    sourceDir?: string;
    outputDir?: string;
    githubUrl?: string;
    githubBranch?: string;
    repositoryRoot?: string;
    verbose?: boolean;
}
/**
 * Markdown documentation generator for Jest and Vitest test files
 * Extracts test information from TypeScript test files and generates markdown documentation
 */
declare class MarkdownDocsGenerator {
    private readonly testDir;
    private readonly docsDir;
    private readonly githubUrl;
    private readonly githubBranch;
    private readonly repositoryRoot;
    private readonly verbose;
    private readonly testFiles;
    private readonly documentation;
    private readonly knownTags;
    /**
     * @param options - Configuration options
     */
    constructor(options?: GeneratorOptions);
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
     * Extract test information from file content
     */
    private extractTests;
    /**
     * Parse test description from TSDoc comments
     */
    private parseTestDescription;
    /**
     * Helper method to save section text to the appropriate section
     */
    private saveSectionText;
    /**
     * Extract tags from test name and description
     */
    private extractTags;
    /**
     * Generate a link to the specific test in the file
     */
    private generateTestLink;
    /**
     * Generate a summary for the file
     */
    private generateFileSummary;
    /**
     * Generate markdown files for each test file
     */
    private generateMarkdownFiles;
    /**
     * Generate markdown content for a single file
     */
    private generateMarkdownContent;
    /**
     * Escape markdown special characters
     */
    private escapeMarkdown;
    /**
     * Generate comprehensive ALL_TESTS.md file with all test cases
     */
    private generateAllTestsFile;
    /**
     * Get category name from file path
     */
    private getCategoryFromPath;
    /**
     * Generate the index file listing all documented files
     */
    private generateIndexFile;
}
export default MarkdownDocsGenerator;
