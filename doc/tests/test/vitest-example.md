# vitest-example Test Documentation

**File:** `test/vitest-example.test.ts`

**Total Tests:** 7

## Test Type Summary

| Type | Count | Percentage |
|------|--------|------------|
| ✅ Regular | 2 | 28.6% |
| ⏭️ Skipped | 1 | 14.3% |
| 🔄 Each | 1 | 14.3% |
| 🎯 Only | 1 | 14.3% |
| ⚡ Concurrent | 1 | 14.3% |
| 📊 Benchmark | 1 | 14.3% |

## ⚠️ Warnings

🚨 **Tests marked with .only found (1)** - These should not be committed to version control

**Tags:** `parameterized`

## Test Categories

- **Vitest Compatibility Tests:** 6 tests
- **Vitest Benchmarks:** 1 tests

## Test Cases

| Type | Link | Test Name | Description |
|------|------|-----------|-------------|
| ✅ | [L13](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L13) | Vitest Compatibility Tests > should handle basic it() tests | **Given:** a basic test case<br>**When:** the test is executed<br>**Then:** it should pass |
| ✅ | [L22](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L22) | Vitest Compatibility Tests > should handle test() function | **Given:** a test function<br>**When:** using test() instead of it()<br>**Then:** it should also work |
| ⏭️ | [L31](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L31) | Vitest Compatibility Tests > should handle skipped tests | **Given:** a skipped test<br>**When:** marked with .skip<br>**Then:** it should be documented but not executed |
| 🎯 | [L40](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L40) | Vitest Compatibility Tests > should handle only tests | **Given:** an only test<br>**When:** marked with .only<br>**Then:** only this test should run |
| ⚡ | [L49](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L49) | Vitest Compatibility Tests > should handle concurrent tests | **Given:** a concurrent test<br>**When:** marked with .concurrent<br>**Then:** it should run in parallel |
| 🔄 | [L63](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L63) | Vitest Compatibility Tests > should handle each tests with input $input | **Given:** parameterized test data<br>**When:** using each with multiple values<br>**Then:** all combinations should be tested |
| 📊 | [L74](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L74) | Vitest Benchmarks > should handle benchmark tests | **Given:** a function to benchmark<br>**When:** measuring performance<br>**Then:** execution time should be recorded |

---
*Generated on 2025-06-10T12:40:54.021Z*
