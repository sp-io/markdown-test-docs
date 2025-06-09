# All Tests Documentation

This file contains a comprehensive list of all test cases across the entire project.

**Total Test Files:** 6
**Total Test Cases:** 21

## Test Distribution

- **.:** 19 tests
- **X:** 1 tests
- **Y:** 1 tests

## All Test Cases

| Category | File | Test Name | Link | Description |
|----------|------|-----------|------|-------------|
| . | [and-tag-examples](and-tag-examples.md) | User Authentication [@security] > should authenticate user with valid credentials | [L15](src/test/and-tag-examples.test.ts#L15) | **Simple login test with additional verification**<br>**Given:** a valid user account exists<br>**When:** the user submits correct credentials<br>**Then:** the user should be logged in successfully<br>**And:** session should be created<br>**And:** user should be redirected to dashboard |
| . | [and-tag-examples](and-tag-examples.md) | User Authentication [@security] > should handle multi-factor authentication flow | [L32](src/test/and-tag-examples.test.ts#L32) | **Complex multi-factor authentication scenario**<br>**Given:** a user with 2FA enabled<br>**When:** the user enters valid username and password<br>**Then:** authentication should succeed<br>**And:** the user has access to their authenticator device<br>**And:** the user account is not locked<br>**And:** provides correct 2FA token<br>**And:** confirms their identity<br>**And:** secure session should be established<br>**And:** user permissions should be loaded<br>**And:** audit log should record the login |
| . | [and-tag-examples](and-tag-examples.md) | Data Processing Pipeline [@integration][@slow] > should process data through complete pipeline | [L52](src/test/and-tag-examples.test.ts#L52) | **End-to-end data transformation test**<br>**Given:** raw data is available in the input queue<br>**When:** the processing pipeline starts<br>**Then:** processed data should be available in output<br>**And:** validation rules are configured<br>**And:** output destination is accessible<br>**And:** data validation passes<br>**And:** transformation rules are applied<br>**And:** results are formatted<br>**And:** original data should be archived<br>**And:** processing metrics should be recorded<br>**And:** notifications should be sent to stakeholders |
| . | [and-tag-examples](and-tag-examples.md) | Error Handling [@error-cases] > should handle network failures gracefully | [L69](src/test/and-tag-examples.test.ts#L69) | **Network failure recovery scenario**<br>**Given:** an active network connection<br>**When:** a network failure occurs during operation<br>**Then:** the system should attempt reconnection<br>**And:** connection is lost for more than 30 seconds<br>**And:** automatic retry is triggered<br>**And:** failed operations should be queued<br>**And:** user should be notified of the issue<br>**And:** when connection is restored, queued operations should resume |
| . | [and-tag-examples](and-tag-examples.md) | Error Handling [@error-cases] > should prevent cascading failures | [L86](src/test/and-tag-examples.test.ts#L86) | **Cascading failure prevention**<br>**Given:** multiple dependent services are running<br>**When:** one service fails<br>**Then:** requests should be redirected to fallback<br>**And:** circuit breakers are configured<br>**And:** failure rate exceeds threshold<br>**And:** circuit breaker opens<br>**And:** dependent services should remain operational<br>**And:** monitoring alerts should be triggered<br>**And:** service health dashboard should update<br>**And:** recovery procedures should initiate automatically |
| . | [and-tag-examples](and-tag-examples.md) | Performance Optimization [@performance] > should optimize performance through intelligent caching | [L105](src/test/and-tag-examples.test.ts#L105) | **Caching strategy validation**<br>**Given:** cache is empty<br>**When:** multiple requests for same data occur<br>**Then:** subsequent requests should hit cache<br>**And:** cache size limit is configured<br>**And:** cache miss happens on first request<br>**And:** data is retrieved from source<br>**And:** cached for future requests<br>**And:** response time should improve significantly<br>**And:** cache memory usage should be within limits<br>**And:** cache hit ratio should meet performance targets |
| . | [example](example.md) | MarkdownDocsGenerator > should initialize with default directories | [L14](src/test/example.test.ts#L14) | **Test constructor initialization**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** no options are provided<br>**Then:** it should use default directories |
| . | [example](example.md) | MarkdownDocsGenerator > should initialize with custom directories | [L25](src/test/example.test.ts#L25) | **Test custom directory configuration**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** custom directories are provided<br>**Then:** it should use the custom directories |
| . | [example](example.md) | MarkdownDocsGenerator > should handle errors when source directory does not exist | [L39](src/test/example.test.ts#L39) | **Test error handling**<br>**Given:** an invalid source directory<br>**When:** the generator tries to find test files<br>**Then:** it should handle the error gracefully |
| . | [example](example.md) | Documentation Generation [@advanced] > should parse complex test structures | [L65](src/test/example.test.ts#L65) | **Advanced feature test**<br>**Given:** a test file with complex structure<br>**When:** the documentation is generated<br>**Then:** it should correctly parse all test cases<br>**And:** a MarkdownDocsGenerator configured to parse it |
| . | [github-link](github-link.md) | GitHub Link Generation > should generate GitHub URLs when configured | [L13](src/test/github-link.test.ts#L13) | **Test GitHub URL generation**<br>**Given:** a MarkdownDocsGenerator configured with GitHub parameters<br>**When:** documentation is generated<br>**Then:** links should point to GitHub repository |
| . | [github-link](github-link.md) | GitHub Link Generation > should fallback to relative paths when no GitHub URL provided | [L24](src/test/github-link.test.ts#L24) | **Test fallback behavior**<br>**Given:** a MarkdownDocsGenerator without GitHub configuration<br>**When:** documentation is generated<br>**Then:** links should use relative file paths |
| . | [github-link](github-link.md) | GitHub Link Generation > should handle complex multi-step scenarios | [L38](src/test/github-link.test.ts#L38) | **Test complex scenario with multiple conditions**<br>**Given:** a repository with multiple test files<br>**When:** documentation is generated with GitHub URL<br>**Then:** all links should point to correct GitHub locations<br>**And:** the repository has nested directory structure<br>**And:** the branch name is specified<br>**And:** paths should be calculated relative to repository root |
| . | [github-link](github-link.md) | Repository Root Configuration [@configuration] > should calculate paths relative to repository root | [L51](src/test/github-link.test.ts#L51) | **Test repository root path handling**<br>**Given:** different repository root configurations<br>**When:** generating documentation<br>**Then:** paths should be calculated correctly relative to the repository root |
| . | [github-link](github-link.md) | Repository Root Configuration [@configuration] > should handle multiple conditions with @and clauses | [L66](src/test/github-link.test.ts#L66) | **Test compound conditions with @and tags**<br>**Given:** a project with custom repository root<br>**When:** generating documentation<br>**Then:** documentation should be generated for all directories<br>**And:** multiple source directories<br>**And:** GitHub URL is provided<br>**And:** all links should use the correct base path<br>**And:** generated files should maintain proper structure |
| . | [verbose-test](verbose-test.md) | Verbose Mode Testing [@testing] > should work with known tags | [L13](src/test/verbose-test.test.ts#L13) | **Test with standard supported tags**<br>**Given:** a valid test setup<br>**When:** the test runs<br>**Then:** it should pass successfully |
| . | [verbose-test](verbose-test.md) | Verbose Mode Testing [@testing] > should log unknown tags in verbose mode | [L29](src/test/verbose-test.test.ts#L29) | **Test with some unknown tags that should be logged in verbose mode**<br>**Given:** a test with unknown tags<br>**When:** the test runs in verbose mode<br>**Then:** unknown tags should be logged |
| . | [verbose-test](verbose-test.md) | Verbose Mode Testing [@testing] > should handle mixed tag scenarios | [L46](src/test/verbose-test.test.ts#L46) | **Test with mixed known and unknown tags**<br>**Given:** a complex test scenario<br>**When:** processing occurs<br>**Then:** expected outcome is achieved<br>**And:** multiple conditions exist<br>**And:** all conditions are met |
| . | [verbose-test](verbose-test.md) | Error Scenarios [@errors] > should handle errors with unknown documentation tags | [L63](src/test/verbose-test.test.ts#L63) | **Test error handling with documentation tags**<br>**Given:** an error-prone operation<br>**When:** an error occurs<br>**Then:** error should be handled gracefully<br>**And:** proper cleanup should occur |
| X | [A](X/A.md) | Sample test in X directory > should preserve folder structure | [L11](src/test/X/A.test.ts#L11) | **Given:** a test file in subdirectory X<br>**When:** running the documentation generator<br>**Then:** it should preserve the folder structure in output |
| Y | [A](Y/A.md) | Sample test in Y directory > should create separate documentation file | [L11](src/test/Y/A.test.ts#L11) | **Given:** a test file in subdirectory Y with same name as file in X<br>**When:** running the documentation generator<br>**Then:** it should create separate markdown files preserving directory structure |

## Tests by Tag

### advanced (1 tests)

| File | Test Name | Link |
|------|-----------|------|
| [example](example.md) | Documentation Generation [@advanced] > should parse complex test structures | [L65](src/test/example.test.ts#L65) |

### configuration (2 tests)

| File | Test Name | Link |
|------|-----------|------|
| [github-link](github-link.md) | Repository Root Configuration [@configuration] > should calculate paths relative to repository root | [L51](src/test/github-link.test.ts#L51) |
| [github-link](github-link.md) | Repository Root Configuration [@configuration] > should handle multiple conditions with @and clauses | [L66](src/test/github-link.test.ts#L66) |

### error-case (4 tests)

| File | Test Name | Link |
|------|-----------|------|
| [and-tag-examples](and-tag-examples.md) | Error Handling [@error-cases] > should handle network failures gracefully | [L69](src/test/and-tag-examples.test.ts#L69) |
| [and-tag-examples](and-tag-examples.md) | Error Handling [@error-cases] > should prevent cascading failures | [L86](src/test/and-tag-examples.test.ts#L86) |
| [example](example.md) | MarkdownDocsGenerator > should handle errors when source directory does not exist | [L39](src/test/example.test.ts#L39) |
| [verbose-test](verbose-test.md) | Error Scenarios [@errors] > should handle errors with unknown documentation tags | [L63](src/test/verbose-test.test.ts#L63) |

### error-cases (2 tests)

| File | Test Name | Link |
|------|-----------|------|
| [and-tag-examples](and-tag-examples.md) | Error Handling [@error-cases] > should handle network failures gracefully | [L69](src/test/and-tag-examples.test.ts#L69) |
| [and-tag-examples](and-tag-examples.md) | Error Handling [@error-cases] > should prevent cascading failures | [L86](src/test/and-tag-examples.test.ts#L86) |

### errors (1 tests)

| File | Test Name | Link |
|------|-----------|------|
| [verbose-test](verbose-test.md) | Error Scenarios [@errors] > should handle errors with unknown documentation tags | [L63](src/test/verbose-test.test.ts#L63) |

### integration (1 tests)

| File | Test Name | Link |
|------|-----------|------|
| [and-tag-examples](and-tag-examples.md) | Data Processing Pipeline [@integration][@slow] > should process data through complete pipeline | [L52](src/test/and-tag-examples.test.ts#L52) |

### performance (1 tests)

| File | Test Name | Link |
|------|-----------|------|
| [and-tag-examples](and-tag-examples.md) | Performance Optimization [@performance] > should optimize performance through intelligent caching | [L105](src/test/and-tag-examples.test.ts#L105) |

### security (2 tests)

| File | Test Name | Link |
|------|-----------|------|
| [and-tag-examples](and-tag-examples.md) | User Authentication [@security] > should authenticate user with valid credentials | [L15](src/test/and-tag-examples.test.ts#L15) |
| [and-tag-examples](and-tag-examples.md) | User Authentication [@security] > should handle multi-factor authentication flow | [L32](src/test/and-tag-examples.test.ts#L32) |

### slow (1 tests)

| File | Test Name | Link |
|------|-----------|------|
| [and-tag-examples](and-tag-examples.md) | Data Processing Pipeline [@integration][@slow] > should process data through complete pipeline | [L52](src/test/and-tag-examples.test.ts#L52) |

### testing (3 tests)

| File | Test Name | Link |
|------|-----------|------|
| [verbose-test](verbose-test.md) | Verbose Mode Testing [@testing] > should work with known tags | [L13](src/test/verbose-test.test.ts#L13) |
| [verbose-test](verbose-test.md) | Verbose Mode Testing [@testing] > should log unknown tags in verbose mode | [L29](src/test/verbose-test.test.ts#L29) |
| [verbose-test](verbose-test.md) | Verbose Mode Testing [@testing] > should handle mixed tag scenarios | [L46](src/test/verbose-test.test.ts#L46) |


---
*Generated on 2025-06-09T07:21:09.220Z*
*Generator: markdown-docs.ts*
