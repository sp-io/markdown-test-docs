import { TestCase, FileSummary } from './types';
import { LinkGenerator } from './link-generator';
export declare class PytestExtractor {
    private linkGenerator;
    private verbose;
    private tagProcessor;
    constructor(linkGenerator: LinkGenerator, verbose?: boolean);
    /**
     * Extract tests from Python pytest file content
     */
    extractTests(content: string, filePath: string): TestCase[];
    /**
     * Generate a summary for the file including test type counts
     */
    generateFileSummary(tests: TestCase[]): FileSummary;
    /**
     * Parse docstring content for test description and steps
     */
    private parseTestDescription;
    /**
     * Determine test type from markers
     */
    private determineTestType;
    /**
     * Count test types in a test array
     */
    private countTestTypes;
    /**
     * Check if the docstring is relevant to the current test
     */
    private isDocstringRelevantToTest;
}
