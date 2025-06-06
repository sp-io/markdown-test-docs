/**
 * Example test file to demonstrate documentation generation
 */

import { MarkdownDocsGenerator } from '../main';

describe('MarkdownDocsGenerator', () => {
  /**
   * Test constructor initialization
   * @given a new MarkdownDocsGenerator instance
   * @when no options are provided
   * @then it should use default directories
   */
  it('should initialize with default directories', () => {
    const generator = new MarkdownDocsGenerator();
    expect(generator).toBeDefined();
  });

  /**
   * Test custom directory configuration
   * @given a new MarkdownDocsGenerator instance
   * @when custom directories are provided
   * @then it should use the custom directories
   */
  it('should initialize with custom directories', () => {
    const generator = new MarkdownDocsGenerator({
      sourceDir: './custom-source',
      outputDir: './custom-output'
    });
    expect(generator).toBeDefined();
  });

  /**
   * Test error handling
   * @given an invalid source directory
   * @when the generator tries to find test files
   * @then it should handle the error gracefully
   */
  it('should handle errors when source directory does not exist', async () => {
    // Mock console.error to avoid polluting test output
    const originalConsoleError = console.error;
    console.error = jest.fn();

    try {
      const generator = new MarkdownDocsGenerator({
        sourceDir: './non-existent-directory',
      });

      await expect(generator.generate()).rejects.toThrow('no such file or directory');
    } finally {
      // Restore console.error in a `finally` block to ensure it always gets restored
      console.error = originalConsoleError;
    }
  });
});

describe('Documentation Generation [@advanced]', () => {
  /**
   * Advanced feature test
   * @given a test file with complex structure
   * @and a MarkdownDocsGenerator configured to parse it
   * @when the documentation is generated
   * @then it should correctly parse all test cases
   */
  it('should parse complex test structures', () => {
    // This is a placeholder test for demonstration purposes
    expect(true).toBe(true);
  });
});