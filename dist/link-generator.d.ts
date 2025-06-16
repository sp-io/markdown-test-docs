export declare class LinkGenerator {
    private githubUrl;
    private githubBranch;
    private repositoryRoot;
    constructor(githubUrl: string | null, githubBranch: string, repositoryRoot: string);
    /**
     * Generate a link to the specific test in the file
     */
    generateTestLink(filePath: string, lineNumber: number, describeName: string, testName: string): string;
    /**
     * Convert test file path to markdown path while preserving directory structure
     */
    getMarkdownPath(relativePath: string): string;
    /**
     * Get category name from file path
     */
    getCategoryFromPath(relativePath: string): string;
}
