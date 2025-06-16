import { FileDocumentation } from './types';
import { LinkGenerator } from './link-generator';
export declare class MarkdownGenerator {
    private linkGenerator;
    constructor(linkGenerator: LinkGenerator);
    /**
     * Generate enhanced markdown content for a single file
     */
    generateMarkdownContent(fileData: FileDocumentation): string;
    /**
     * Generate comprehensive ALL_TESTS.md file with all test cases
     */
    generateAllTestsContent(documentation: Map<string, FileDocumentation>): string;
    /**
     * Generate the index file listing all documented files
     */
    generateIndexContent(documentation: Map<string, FileDocumentation>): string;
    /**
     * Get test type emoji for display
     */
    private getTestTypeEmoji;
    /**
     * Escape markdown special characters for table cells - preserves line breaks as <br>
     */
    private escapeMarkdownForTable;
    /**
     * Escape markdown special characters
     */
    private escapeMarkdown;
}
