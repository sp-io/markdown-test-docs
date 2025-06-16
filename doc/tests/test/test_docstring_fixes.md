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
| ✅ | [L10](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L10) | negative balance burn | Test that trying to burn negative balance should fail<br><br>**Steps:**<br>- attempt to burn negative balance<br>- check that an exception is raised |
| ✅ | [L21](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L21) | long receiver address | Test that setting the receiver address to a value that is more than 32 bytes does not<br>succeed and doesn't break the chain<br><br>**Steps:**<br>- attempt to burn with a pc_addr more than 32 bytes long<br>- check that an exception is raised<br>- check that rpc remains functional |
| 🔢 | [L35](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L35) | simple parametrize | Test parametrized function<br><br>**Given:** an input value<br>**When:** doubling it<br>**Then:** should get expected result |

---
