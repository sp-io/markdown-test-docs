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
| 🏷️ | [L15](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L15) | TestSmoke::test_block_producing | **Steps:** - get latest partner chain block - wait for a predefined time - get latest partner chain block one more time - verify that block numbers increased |
| 🏷️ | [L31](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L31) | TestSmoke::test_transaction | **Steps:** - create a transaction - sign transaction - submit transaction - check a balance of receiver was updated |
| 🏷️ | [L59](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L59) | TestSmoke::test_lock_transaction | **Steps:** - create new transaction - lock transaction by calling lock() from ActiveFlow module - sign and submit transaction by calling extrinsic methods from substrate API |
| 🔢 | [L86](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L86) | test_multiplication | **Given:** an input value **When:** multiplying by 2 **Then:** result should match expected value |
| ✅ | [L96](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L96) | test_simple_assertion | Simple test without any special markers |

---
