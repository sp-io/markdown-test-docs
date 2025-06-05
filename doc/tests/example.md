# example Test Documentation

**File:** `test/example.test.ts`

**Total Tests:** 4

**Tags:** `error-case`, `advanced`

## Test Categories

- **MarkdownDocsGenerator:** 3 tests
- **Documentation Generation [@advanced]:** 1 tests

## Test Cases

| Test Name | Link | Description |
|-----------|------|-------------|
| MarkdownDocsGenerator > should initialize with default directories | [L14](src/test/example.test.ts#L14) | **Test constructor initialization**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** no options are provided<br>**Then:** it should use default directories |
| MarkdownDocsGenerator > should initialize with custom directories | [L25](src/test/example.test.ts#L25) | **Test custom directory configuration**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** custom directories are provided<br>**Then:** it should use the custom directories |
| MarkdownDocsGenerator > should handle errors when source directory does not exist | [L39](src/test/example.test.ts#L39) | **Test error handling**<br>**Given:** an invalid source directory<br>**When:** the generator tries to find test files<br>**Then:** it should handle the error gracefully |
| Documentation Generation [@advanced] > should parse complex test structures | [L65](src/test/example.test.ts#L65) | **Advanced feature test**<br>**Given:** a test file with complex structure<br>**When:** the documentation is generated<br>**Then:** it should correctly parse all test cases<br>**And:** a MarkdownDocsGenerator configured to parse it |

---
*Generated on 2025-06-05T08:52:55.946Z*
