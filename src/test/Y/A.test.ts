/**
 * Test file in subdirectory Y
 */

describe('Sample test in Y directory', () => {
  /**
   * @given a test file in subdirectory Y with same name as file in X
   * @when running the documentation generator
   * @then it should create separate markdown files preserving directory structure
   */
  it('should create separate documentation file', () => {
    expect(true).toBe(true);
  });
});
