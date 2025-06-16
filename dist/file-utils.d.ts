export declare class FileUtils {
    private verbose;
    constructor(verbose?: boolean);
    /**
     * Ensure a directory exists, creating it if necessary
     */
    ensureDirectory(dirPath: string): void;
    /**
     * Recursively find all test files in a directory
     */
    findTestFiles(sourceDir: string): string[];
    /**
     * Read file content as string
     */
    readFileContent(filePath: string): string;
    /**
     * Write content to file
     */
    writeFile(filePath: string, content: string): void;
    /**
     * Get file name without extension from file path
     */
    getFileNameWithoutExtension(filePath: string): string;
    /**
     * Helper function to check if a string is non-empty
     */
    isNonEmptyString(str: string | undefined): str is string;
}
