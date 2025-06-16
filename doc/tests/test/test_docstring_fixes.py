# docstring_fixes Test Documentation

**File:** `test/test_docstring_fixes.py`

**Total Tests:** 3

## Test Type Summary

| Type | Count | Percentage |
|------|--------|------------|
| ✅ Regular | 2 | 66.7% |
| 🔢 Parametrize | 1 | 33.3% |

**Tags:** `negative-test`, `parametrize`

## Test Cases

| Type | Link | Test Name | Description |
|------|------|-----------|-------------|
| ✅ | [L10](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L10) | test_negative_balance_burn | Test that trying to burn negative balance should fail **Steps:** - attempt to burn negative balance - check that an exception is raised |
| ✅ | [L21](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L21) | test_long_receiver_address | Test that setting the receiver address to a value that is more than 32 bytes does not succeed and doesn't break the chain **Steps:** - attempt to burn with a pc_addr more than 32 bytes long - check that an exception is raised - check that rpc remains functional |
| 🔢 | [L35](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L35) | test_simple_parametrize | Test parametrized function **Given:** an input value **When:** doubling it **Then:** should get expected result |

---
