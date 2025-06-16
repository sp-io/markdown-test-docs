import { TestFramework } from './types';
export declare class FrameworkDetector {
    /**
     * Detect test framework based on file extension and content
     */
    static detectFramework(filePath: string, content?: string): TestFramework;
    /**
     * Check if file is a test file based on naming conventions
     */
    static isTestFile(filePath: string): boolean;
    /**
     * Get file extensions for a specific framework
     */
    static getFrameworkExtensions(framework: TestFramework): string[];
}
