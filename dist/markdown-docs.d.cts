#!/usr/bin/env node
export = MarkdownDocsGenerator;
/**
 * Markdown documentation generator for Jest test files
 * Extracts test information from TypeScript test files and generates markdown documentation
 */
declare class MarkdownDocsGenerator {
    /**
     * @param {Object} options - Configuration options
     * @param {string} [options.sourceDir] - Custom source directory path
     * @param {string} [options.outputDir] - Custom output directory path
     */
    constructor(options?: {
        sourceDir?: string | undefined;
        outputDir?: string | undefined;
    });
    testDir: string;
    docsDir: string;
    testFiles: any[];
    documentation: Map<any, any>;
    /**
     * Initialize the documentation generation process
     */
    generate(): Promise<void>;
    /**
     * Ensure the documentation directory exists
     */
    ensureDocsDirectory(): void;
    /**
     * Recursively find all test files
     */
    findTestFiles(): void;
    /**
     * Process a single test file and extract test information
     */
    processTestFile(filePath: any): Promise<void>;
    /**
     * Extract test information from file content
     */
    extractTests(content: any, filePath: any): {
        testName: string;
        shortName: any;
        describeName: any;
        link: string;
        description: string;
        lineNumber: number;
        tags: any[];
    }[];
    /**
     * Parse test description from TSDoc comments
     */
    parseTestDescription(commentLines: any): string;
    /**
     * Extract tags from test name and description
     */
    extractTags(describeName: any, description: any): any[];
    /**
     * Generate a link to the specific test in the file
     */
    generateTestLink(filePath: any, lineNumber: any, describeName: any, testName: any): string;
    /**
     * Generate a summary for the file
     */
    generateFileSummary(tests: any): {
        total: any;
        categories: {};
        tags: any[];
    };
    /**
     * Generate markdown files for each test file
     */
    generateMarkdownFiles(): void;
    /**
     * Generate markdown content for a single file
     */
    generateMarkdownContent(fileData: any): string;
    /**
     * Escape markdown special characters
     */
    escapeMarkdown(text: any): any;
    /**
     * Generate comprehensive ALL_TESTS.md file with all test cases
     */
    generateAllTestsFile(): void;
    /**
     * Get category name from file path
     */
    getCategoryFromPath(relativePath: any): string;
    /**
     * Generate the index file listing all documented files
     */
    generateIndexFile(): void;
}
