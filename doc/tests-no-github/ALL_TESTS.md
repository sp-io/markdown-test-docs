# All Tests Documentation

This file contains a comprehensive list of all test cases across the entire project.

**Total Test Files:** 1
**Total Test Cases:** 4

## Test Distribution

- **.:** 4 tests

## All Test Cases

| Category | File | Test Name | Link | Description |
|----------|------|-----------|------|-------------|
| . | [example](example.md) | MarkdownDocsGenerator > should initialize with default directories | [L14](src/test/example.test.ts#L14) | **Test constructor initialization**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** no options are provided<br>**Then:** it should use default directories |
| . | [example](example.md) | MarkdownDocsGenerator > should initialize with custom directories | [L25](src/test/example.test.ts#L25) | **Test custom directory configuration**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** custom directories are provided<br>**Then:** it should use the custom directories |
| . | [example](example.md) | MarkdownDocsGenerator > should handle errors when source directory does not exist | [L39](src/test/example.test.ts#L39) | **Test error handling**<br>**Given:** an invalid source directory<br>**When:** the generator tries to find test files<br>**Then:** it should handle the error gracefully |
| . | [example](example.md) | Documentation Generation [@advanced] > should parse complex test structures | [L64](src/test/example.test.ts#L64) | **Advanced feature test**<br>**Given:** a test file with complex structure<br>**When:** the documentation is generated<br>**Then:** it should correctly parse all test cases |

## Tests by Tag

### advanced (1 tests)

| File | Test Name | Link |
|------|-----------|------|
| [example](example.md) | Documentation Generation [@advanced] > should parse complex test structures | [L64](src/test/example.test.ts#L64) |

### error-case (1 tests)

| File | Test Name | Link |
|------|-----------|------|
| [example](example.md) | MarkdownDocsGenerator > should handle errors when source directory does not exist | [L39](src/test/example.test.ts#L39) |


---
*Generated on 2025-06-05T08:09:32.188Z*
*Generator: markdown-docs.cjs*
