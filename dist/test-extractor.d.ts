import { TestCase, FileSummary } from './types';
import { LinkGenerator } from './link-generator';
export declare class TestExtractor {
    private linkGenerator;
    private verbose;
    private tagProcessor;
    constructor(linkGenerator: LinkGenerator, verbose?: boolean);
    /**
     * Extract tests from file content
     */
    extractTests(content: string, filePath: string): TestCase[];
    /**
     * Generate a summary for the file including test type counts
     */
    generateFileSummary(tests: TestCase[]): FileSummary;
    /**
     * Determine test type from line content
     */
    private determineTestType;
    /**
     * Count test types in a test array
     */
    private countTestTypes;
    /**
     * Check if the comment is relevant to the current test
     * Comments should be within 3 lines of the test declaration to be considered relevant
     */
    private isCommentRelevantToTest;
}
