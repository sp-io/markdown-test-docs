# example Test Documentation

**File:** `example.test.ts`

**Total Tests:** 4

**Tags:** `error-case`, `advanced`

## Test Categories

- **MarkdownDocsGenerator:** 3 tests
- **Documentation Generation [@advanced]:** 1 tests

## Test Cases

| Link | Test Name | Description |
|------|-----------|-------------|
| [L14](src/test/example.test.ts#L14) | MarkdownDocsGenerator > should initialize with default directories | **Test constructor initialization**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** no options are provided<br>**Then:** it should use default directories |
| [L25](src/test/example.test.ts#L25) | MarkdownDocsGenerator > should initialize with custom directories | **Test custom directory configuration**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** custom directories are provided<br>**Then:** it should use the custom directories |
| [L39](src/test/example.test.ts#L39) | MarkdownDocsGenerator > should handle errors when source directory does not exist | **Test error handling**<br>**Given:** an invalid source directory<br>**When:** the generator tries to find test files<br>**Then:** it should handle the error gracefully |
| [L65](src/test/example.test.ts#L65) | Documentation Generation [@advanced] > should parse complex test structures | **Advanced feature test**<br>**Given:** a test file with complex structure<br>**When:** the documentation is generated<br>**Then:** it should correctly parse all test cases<br>**And:** a MarkdownDocsGenerator configured to parse it |

---
*Generated on 2025-06-09T12:30:56.945Z*
