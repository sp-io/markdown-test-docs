# example_pytest Test Documentation

**File:** `test/test_example_pytest.py`

**Total Tests:** 5

## Test Type Summary

| Type | Count | Percentage |
|------|--------|------------|
| ✅ Regular | 1 | 20.0% |
| 🏷️ Marked | 3 | 60.0% |
| 🔢 Parametrize | 1 | 20.0% |

**Tags:** `ariadne`, `substrate`, `test_key`, `skip_blockchain`, `active_flow`, `parametrize`

## Test Categories

- **TestSmoke:** 3 tests
- **test_example_pytest:** 2 tests

## Test Cases

| Type | Link | Test Name | Description |
|------|------|-----------|-------------|
| 🏷️ | [L15](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L15) | TestSmoke::block producing | Test node producing a block<br><br>**Steps:**<br>- get latest partner chain block<br>- wait for a predefined time<br>- get latest partner chain block one more time<br>- verify that block numbers increased |
| 🏷️ | [L31](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L31) | TestSmoke::transaction | Test node making a transaction<br><br>**Steps:**<br>- create a transaction<br>- sign transaction<br>- submit transaction<br>- check a balance of receiver was updated |
| 🏷️ | [L59](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L59) | TestSmoke::lock transaction | Test that the user can lock tokens on a partner chain<br><br>**Steps:**<br>- create new transaction<br>- lock transaction by calling lock() from ActiveFlow module<br>- sign and submit transaction by calling extrinsic methods from substrate API |
| 🔢 | [L86](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L86) | multiplication | Test multiplication function with multiple inputs<br><br>**Given:** an input value<br>**When:** multiplying by 2<br>**Then:** result should match expected value |
| ✅ | [L96](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L96) | simple assertion | Simple test without any special markers |

---
