import { GeneratorOptions } from './types';
/**
 * Markdown documentation generator for Jest and Vitest test files
 * Extracts test information from TypeScript test files and generates markdown documentation
 */
declare class MarkdownDocsGenerator {
    private readonly testDir;
    private readonly docsDir;
    private readonly verbose;
    private readonly testFramework;
    private readonly fileUtils;
    private readonly linkGenerator;
    private readonly testExtractor;
    private readonly pytestExtractor;
    private readonly markdownGenerator;
    private readonly documentation;
    /**
     * @param options - Configuration options
     */
    constructor(options?: GeneratorOptions);
    /**
     * Initialize the documentation generation process
     */
    generate(): Promise<void>;
    /**
     * Process a single test file and extract test information
     */
    private processTestFile;
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
export default MarkdownDocsGenerator;
