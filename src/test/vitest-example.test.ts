/**
 * Example Vitest test file to verify parsing compatibility
 */

import { describe, it, test, bench, expect } from 'vitest';

describe('Vitest Compatibility Tests', () => {
  /**
   * @given a basic test case
   * @when the test is executed
   * @then it should pass
   */
  it('should handle basic it() tests', () => {
    expect(true).toBe(true);
  });

  /**
   * @given a test function
   * @when using test() instead of it()
   * @then it should also work
   */
  test('should handle test() function', () => {
    expect(1 + 1).toBe(2);
  });

  /**
   * @given a skipped test
   * @when marked with .skip
   * @then it should be documented but not executed
   */
  it.skip('should handle skipped tests', () => {
    expect(false).toBe(true);
  });

  /**
   * @given an only test
   * @when marked with .only
   * @then only this test should run
   */
  test.only('should handle only tests', () => {
    expect('vitest').toBe('vitest');
  });

  /**
   * @given a concurrent test
   * @when marked with .concurrent
   * @then it should run in parallel
   */
  it.concurrent('should handle concurrent tests', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(true).toBe(true);
  });

  /**
   * @given parameterized test data
   * @when using each with multiple values
   * @then all combinations should be tested
   */
  test.each([
    { input: 1, expected: 2 },
    { input: 2, expected: 4 },
    { input: 3, expected: 6 }
  ])('should handle each tests with input $input', ({ input, expected }) => {
    expect(input * 2).toBe(expected);
  });
});

describe('Vitest Benchmarks', () => {
  /**
   * @given a function to benchmark
   * @when measuring performance
   * @then execution time should be recorded
   */
  bench('should handle benchmark tests', () => {
    // Some computation to benchmark
    const arr = Array.from({ length: 1000 }, (_, i) => i);
    return arr.reduce((sum, val) => sum + val, 0);
  });
});
