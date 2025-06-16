export declare class TagProcessor {
    private readonly knownTags;
    constructor(verbose?: boolean);
    /**
     * Extract tags from test name and description
     */
    extractTags(describeName: string, description: string): string[];
    /**
     * Extract inline tags from test names (e.g., @smoke, @healthcheck)
     */
    extractInlineTags(testName: string): string[];
    /**
     * Parse test description from TSDoc comments
     */
    parseTestDescription(commentLines: string[], verbose?: boolean): string;
    /**
     * Helper method to save section text to the appropriate section
     */
    private saveSectionText;
}
