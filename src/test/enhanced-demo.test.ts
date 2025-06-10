/**
 * Enhanced demo test file showing different test types
 */

describe('Enhanced Test Type Demo', () => {
  /**
   * @given a basic test case
   * @when it runs normally
   * @then it should pass
   */
  it('should be a regular test', () => {
    expect(true).toBe(true);
  });

  /**
   * @given a test that needs to be temporarily disabled
   * @when marked with .skip
   * @then it should be documented but not executed
   */
  it.skip('should be a skipped test', () => {
    expect(false).toBe(true); // This would fail if not skipped
  });

  /**
   * @given a test that is not yet implemented
   * @when marked with .todo
   * @then it should be documented as planned work
   */
  it.todo('should be a todo test');

  /**
   * @given multiple test scenarios
   * @when using parameterized testing
   * @then all combinations should be tested efficiently
   */
  it.each([
    { input: 1, expected: 2 },
    { input: 2, expected: 4 },
    { input: 3, expected: 6 }
  ])('should handle each test with input $input expecting $expected', ({ input, expected }) => {
    expect(input * 2).toBe(expected);
  });

  /**
   * @given a test that can run independently
   * @when marked with .concurrent
   * @then it should run in parallel with other concurrent tests
   */
  it.concurrent('should be a concurrent test', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(true).toBe(true);
  });

  /**
   * This test should NOT be committed - for demo purposes only
   * @given a test marked with .only
   * @when it runs
   * @then only this test will execute
   */
  // it.only('should be an only test (DO NOT COMMIT)', () => {
  //   expect(true).toBe(true);
  // });
});

describe('Performance Tests', () => {
  /**
   * @given a function to benchmark
   * @when measuring performance
   * @then execution time should be recorded
   */
  // Note: bench() is Vitest specific, but included for demo
  // bench('should benchmark array operations', () => {
  //   const arr = Array.from({ length: 1000 }, (_, i) => i);
  //   return arr.reduce((sum, val) => sum + val, 0);
  // });
});
