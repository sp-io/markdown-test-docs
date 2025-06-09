interface GeneratorOptions {
    sourceDir?: string;
    outputDir?: string;
    githubUrl?: string;
    githubBranch?: string;
    repositoryRoot?: string;
    verbose?: boolean;
}
/**
 * Markdown documentation generator for pytest test files
 * Extracts test information from Python test files and generates markdown documentation
 */
declare class PytestMarkdownGenerator {
    private readonly testDir;
    private readonly docsDir;
    private readonly githubUrl;
    private readonly githubBranch;
    private readonly repositoryRoot;
    private readonly verbose;
    private readonly testFiles;
    private readonly documentation;
    private readonly knownTags;
    constructor(options?: GeneratorOptions);
    generate(): Promise<void>;
    private ensureDocsDirectory;
    private findTestFiles;
    private processTestFile;
    private extractTests;
    private extractMarkers;
    private parseTestDescription;
    private saveSectionText;
    private extractTags;
    private generateTestLink;
    private generateFileSummary;
    private generateMarkdownFiles;
    private generateMarkdownContent;
    private escapeMarkdown;
    private generateAllTestsFile;
    private getCategoryFromPath;
    private generateIndexFile;
}
export default PytestMarkdownGenerator;
