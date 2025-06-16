# All Tests Documentation

This file contains a comprehensive list of all test cases across the entire project.

**Total Test Files:** 1
**Total Test Cases:** 5

## Test Type Summary

| Type | Count | Percentage |
|------|--------|------------|
| ✅ Regular | 1 | 20.0% |
| 🏷️ Marked | 3 | 60.0% |
| 🔢 Parametrize | 1 | 20.0% |

## Test Distribution

- **.:** 5 tests

## All Test Cases

| Category | File | Link | Test Name | Description |
|----------|------|------|-----------|-------------|
| . | [example_pytest](test_example_pytest.py) | [L15](src/test/test_example_pytest.py#L15) | TestSmoke::test_block_producing | **Steps:** - get latest partner chain block - wait for a predefined time - get latest partner chain block one more time - verify that block numbers increased |
| . | [example_pytest](test_example_pytest.py) | [L31](src/test/test_example_pytest.py#L31) | TestSmoke::test_transaction | **Steps:** - create a transaction - sign transaction - submit transaction - check a balance of receiver was updated |
| . | [example_pytest](test_example_pytest.py) | [L59](src/test/test_example_pytest.py#L59) | TestSmoke::test_lock_transaction | **Steps:** - create new transaction - lock transaction by calling lock() from ActiveFlow module - sign and submit transaction by calling extrinsic methods from substrate API |
| . | [example_pytest](test_example_pytest.py) | [L86](src/test/test_example_pytest.py#L86) | test_multiplication | **Given:** an input value **When:** multiplying by 2 **Then:** result should match expected value |
| . | [example_pytest](test_example_pytest.py) | [L96](src/test/test_example_pytest.py#L96) | test_simple_assertion | Simple test without any special markers |

## Tests by Tag

### active_flow (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test_example_pytest.py) | [L59](src/test/test_example_pytest.py#L59) | TestSmoke::test_lock_transaction |

### ariadne (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test_example_pytest.py) | [L15](src/test/test_example_pytest.py#L15) | TestSmoke::test_block_producing |
| [example_pytest](test_example_pytest.py) | [L31](src/test/test_example_pytest.py#L31) | TestSmoke::test_transaction |

### parametrize (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test_example_pytest.py) | [L86](src/test/test_example_pytest.py#L86) | test_multiplication |

### skip_blockchain (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test_example_pytest.py) | [L59](src/test/test_example_pytest.py#L59) | TestSmoke::test_lock_transaction |

### substrate (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test_example_pytest.py) | [L15](src/test/test_example_pytest.py#L15) | TestSmoke::test_block_producing |
| [example_pytest](test_example_pytest.py) | [L31](src/test/test_example_pytest.py#L31) | TestSmoke::test_transaction |

### test_key (3 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test_example_pytest.py) | [L15](src/test/test_example_pytest.py#L15) | TestSmoke::test_block_producing |
| [example_pytest](test_example_pytest.py) | [L31](src/test/test_example_pytest.py#L31) | TestSmoke::test_transaction |
| [example_pytest](test_example_pytest.py) | [L59](src/test/test_example_pytest.py#L59) | TestSmoke::test_lock_transaction |


---
*Generator: markdown-docs.ts*
