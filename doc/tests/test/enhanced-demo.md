# enhanced-demo Test Documentation

**File:** `test/enhanced-demo.test.ts`

**Total Tests:** 7

## Test Type Summary

| Type | Count | Percentage |
|------|--------|------------|
| ✅ Regular | 1 | 14.3% |
| ⏭️ Skipped | 1 | 14.3% |
| 📝 Todo | 1 | 14.3% |
| 🔄 Each | 1 | 14.3% |
| 🎯 Only | 1 | 14.3% |
| ⚡ Concurrent | 1 | 14.3% |
| 📊 Benchmark | 1 | 14.3% |

## ⚠️ Warnings

🚨 **Tests marked with .only found (1)** - These should not be committed to version control

**Tags:** `parameterized`, `negative-test`

## Test Categories

- **Enhanced Test Type Demo:** 6 tests
- **Performance Tests:** 1 tests

## Test Cases

| Type | Link | Test Name | Description |
|------|------|-----------|-------------|
| ✅ | [L11](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L11) | Enhanced Test Type Demo > should be a regular test | **Given:** a basic test case<br>**When:** it runs normally<br>**Then:** it should pass |
| ⏭️ | [L20](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L20) | Enhanced Test Type Demo > should be a skipped test | **Given:** a test that needs to be temporarily disabled<br>**When:** marked with .skip<br>**Then:** it should be documented but not executed |
| 📝 | [L29](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L29) | Enhanced Test Type Demo > should be a todo test | **Given:** a test that is not yet implemented<br>**When:** marked with .todo<br>**Then:** it should be documented as planned work |
| 🔄 | [L40](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L40) | Enhanced Test Type Demo > should handle each test with input $input expecting $expected | **Given:** multiple test scenarios<br>**When:** using parameterized testing<br>**Then:** all combinations should be tested efficiently |
| ⚡ | [L49](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L49) | Enhanced Test Type Demo > should be a concurrent test | **Given:** a test that can run independently<br>**When:** marked with .concurrent<br>**Then:** it should run in parallel with other concurrent tests |
| 🎯 | [L60](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L60) | Enhanced Test Type Demo > should be an only test (DO NOT COMMIT) | **This test should NOT be committed - for demo purposes only**<br>**Given:** a test marked with .only<br>**When:** it runs<br>**Then:** only this test will execute |
| 📊 | [L72](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L72) | Performance Tests > should benchmark array operations | **Given:** a function to benchmark<br>**When:** measuring performance<br>**Then:** execution time should be recorded |

---
*Generated on 2025-06-10T12:38:10.212Z*
