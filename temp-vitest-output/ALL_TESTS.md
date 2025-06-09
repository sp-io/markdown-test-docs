# All Tests Documentation

This file contains a comprehensive list of all test cases across the entire project.

**Total Test Files:** 8
**Total Test Cases:** 32

## Test Distribution

- **.:** 30 tests
- **X:** 1 tests
- **Y:** 1 tests

## All Test Cases

| Category | File | Link | Test Name | Description |
|----------|------|------|-----------|-------------|
| . | [01_uiVerifications](01_uiVerifications.md) | [L14](src/test/01_uiVerifications.spec.ts#L14) | UI Verifications > should load the main page | **Verify that the main page loads correctly**<br>**Given:** the application is running<br>**When:** the user navigates to the main page<br>**Then:** the page should load successfully |
| . | [01_uiVerifications](01_uiVerifications.md) | [L25](src/test/01_uiVerifications.spec.ts#L25) | UI Verifications > should show validation errors for invalid login | **Test login form validation**<br>**Given:** the login form is displayed<br>**When:** the user enters invalid credentials<br>**Then:** appropriate error messages should be shown |
| . | [01_uiVerifications](01_uiVerifications.md) | [L36](src/test/01_uiVerifications.spec.ts#L36) | UI Verifications > should navigate correctly through menu items | **Verify navigation menu functionality**<br>**Given:** the user is logged in<br>**When:** clicking on navigation items<br>**Then:** the correct pages should be displayed |
| . | [01_uiVerifications](01_uiVerifications.md) | [L49](src/test/01_uiVerifications.spec.ts#L49) | Form Validations > should validate required fields | **Test required field validation**<br>**Given:** a form with required fields<br>**When:** submitting without filling required fields<br>**Then:** validation errors should appear |
| . | [01_uiVerifications](01_uiVerifications.md) | [L60](src/test/01_uiVerifications.spec.ts#L60) | Form Validations > should validate email format | **Test email format validation**<br>**Given:** an email input field<br>**When:** entering invalid email format<br>**Then:** email validation error should be shown |
| . | [and-tag-examples](and-tag-examples.md) | [L15](src/test/and-tag-examples.test.ts#L15) | User Authentication [@security] > should authenticate user with valid credentials | **Simple login test with additional verification**<br>**Given:** a valid user account exists<br>**When:** the user submits correct credentials<br>**Then:** the user should be logged in successfully<br>**And:** session should be created<br>**And:** user should be redirected to dashboard |
| . | [and-tag-examples](and-tag-examples.md) | [L32](src/test/and-tag-examples.test.ts#L32) | User Authentication [@security] > should handle multi-factor authentication flow | **Complex multi-factor authentication scenario**<br>**Given:** a user with 2FA enabled<br>**When:** the user enters valid username and password<br>**Then:** authentication should succeed<br>**And:** the user has access to their authenticator device<br>**And:** the user account is not locked<br>**And:** provides correct 2FA token<br>**And:** confirms their identity<br>**And:** secure session should be established<br>**And:** user permissions should be loaded<br>**And:** audit log should record the login |
| . | [and-tag-examples](and-tag-examples.md) | [L52](src/test/and-tag-examples.test.ts#L52) | Data Processing Pipeline [@integration][@slow] > should process data through complete pipeline | **End-to-end data transformation test**<br>**Given:** raw data is available in the input queue<br>**When:** the processing pipeline starts<br>**Then:** processed data should be available in output<br>**And:** validation rules are configured<br>**And:** output destination is accessible<br>**And:** data validation passes<br>**And:** transformation rules are applied<br>**And:** results are formatted<br>**And:** original data should be archived<br>**And:** processing metrics should be recorded<br>**And:** notifications should be sent to stakeholders |
| . | [and-tag-examples](and-tag-examples.md) | [L69](src/test/and-tag-examples.test.ts#L69) | Error Handling [@error-cases] > should handle network failures gracefully | **Network failure recovery scenario**<br>**Given:** an active network connection<br>**When:** a network failure occurs during operation<br>**Then:** the system should attempt reconnection<br>**And:** connection is lost for more than 30 seconds<br>**And:** automatic retry is triggered<br>**And:** failed operations should be queued<br>**And:** user should be notified of the issue<br>**And:** when connection is restored, queued operations should resume |
| . | [and-tag-examples](and-tag-examples.md) | [L86](src/test/and-tag-examples.test.ts#L86) | Error Handling [@error-cases] > should prevent cascading failures | **Cascading failure prevention**<br>**Given:** multiple dependent services are running<br>**When:** one service fails<br>**Then:** requests should be redirected to fallback<br>**And:** circuit breakers are configured<br>**And:** failure rate exceeds threshold<br>**And:** circuit breaker opens<br>**And:** dependent services should remain operational<br>**And:** monitoring alerts should be triggered<br>**And:** service health dashboard should update<br>**And:** recovery procedures should initiate automatically |
| . | [and-tag-examples](and-tag-examples.md) | [L105](src/test/and-tag-examples.test.ts#L105) | Performance Optimization [@performance] > should optimize performance through intelligent caching | **Caching strategy validation**<br>**Given:** cache is empty<br>**When:** multiple requests for same data occur<br>**Then:** subsequent requests should hit cache<br>**And:** cache size limit is configured<br>**And:** cache miss happens on first request<br>**And:** data is retrieved from source<br>**And:** cached for future requests<br>**And:** response time should improve significantly<br>**And:** cache memory usage should be within limits<br>**And:** cache hit ratio should meet performance targets |
| . | [example](example.md) | [L14](src/test/example.test.ts#L14) | MarkdownDocsGenerator > should initialize with default directories | **Test constructor initialization**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** no options are provided<br>**Then:** it should use default directories |
| . | [example](example.md) | [L25](src/test/example.test.ts#L25) | MarkdownDocsGenerator > should initialize with custom directories | **Test custom directory configuration**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** custom directories are provided<br>**Then:** it should use the custom directories |
| . | [example](example.md) | [L39](src/test/example.test.ts#L39) | MarkdownDocsGenerator > should handle errors when source directory does not exist | **Test error handling**<br>**Given:** an invalid source directory<br>**When:** the generator tries to find test files<br>**Then:** it should handle the error gracefully |
| . | [example](example.md) | [L65](src/test/example.test.ts#L65) | Documentation Generation [@advanced] > should parse complex test structures | **Advanced feature test**<br>**Given:** a test file with complex structure<br>**When:** the documentation is generated<br>**Then:** it should correctly parse all test cases<br>**And:** a MarkdownDocsGenerator configured to parse it |
| . | [github-link](github-link.md) | [L13](src/test/github-link.test.ts#L13) | GitHub Link Generation > should generate GitHub URLs when configured | **Test GitHub URL generation**<br>**Given:** a MarkdownDocsGenerator configured with GitHub parameters<br>**When:** documentation is generated<br>**Then:** links should point to GitHub repository |
| . | [github-link](github-link.md) | [L24](src/test/github-link.test.ts#L24) | GitHub Link Generation > should fallback to relative paths when no GitHub URL provided | **Test fallback behavior**<br>**Given:** a MarkdownDocsGenerator without GitHub configuration<br>**When:** documentation is generated<br>**Then:** links should use relative file paths |
| . | [github-link](github-link.md) | [L38](src/test/github-link.test.ts#L38) | GitHub Link Generation > should handle complex multi-step scenarios | **Test complex scenario with multiple conditions**<br>**Given:** a repository with multiple test files<br>**When:** documentation is generated with GitHub URL<br>**Then:** all links should point to correct GitHub locations<br>**And:** the repository has nested directory structure<br>**And:** the branch name is specified<br>**And:** paths should be calculated relative to repository root |
| . | [github-link](github-link.md) | [L51](src/test/github-link.test.ts#L51) | Repository Root Configuration [@configuration] > should calculate paths relative to repository root | **Test repository root path handling**<br>**Given:** different repository root configurations<br>**When:** generating documentation<br>**Then:** paths should be calculated correctly relative to the repository root |
| . | [github-link](github-link.md) | [L66](src/test/github-link.test.ts#L66) | Repository Root Configuration [@configuration] > should handle multiple conditions with @and clauses | **Test compound conditions with @and tags**<br>**Given:** a project with custom repository root<br>**When:** generating documentation<br>**Then:** documentation should be generated for all directories<br>**And:** multiple source directories<br>**And:** GitHub URL is provided<br>**And:** all links should use the correct base path<br>**And:** generated files should maintain proper structure |
| . | [verbose-test](verbose-test.md) | [L13](src/test/verbose-test.test.ts#L13) | Verbose Mode Testing [@testing] > should work with known tags | **Test with standard supported tags**<br>**Given:** a valid test setup<br>**When:** the test runs<br>**Then:** it should pass successfully |
| . | [verbose-test](verbose-test.md) | [L29](src/test/verbose-test.test.ts#L29) | Verbose Mode Testing [@testing] > should log unknown tags in verbose mode | **Test with some unknown tags that should be logged in verbose mode**<br>**Given:** a test with unknown tags<br>**When:** the test runs in verbose mode<br>**Then:** unknown tags should be logged |
| . | [verbose-test](verbose-test.md) | [L46](src/test/verbose-test.test.ts#L46) | Verbose Mode Testing [@testing] > should handle mixed tag scenarios | **Test with mixed known and unknown tags**<br>**Given:** a complex test scenario<br>**When:** processing occurs<br>**Then:** expected outcome is achieved<br>**And:** multiple conditions exist<br>**And:** all conditions are met |
| . | [verbose-test](verbose-test.md) | [L63](src/test/verbose-test.test.ts#L63) | Error Scenarios [@errors] > should handle errors with unknown documentation tags | **Test error handling with documentation tags**<br>**Given:** an error-prone operation<br>**When:** an error occurs<br>**Then:** error should be handled gracefully<br>**And:** proper cleanup should occur |
| . | [vitest-example](vitest-example.md) | [L13](src/test/vitest-example.test.ts#L13) | Vitest Compatibility Tests > should handle basic it() tests | **Given:** a basic test case<br>**When:** the test is executed<br>**Then:** it should pass |
| . | [vitest-example](vitest-example.md) | [L22](src/test/vitest-example.test.ts#L22) | Vitest Compatibility Tests > should handle test() function | **Given:** a test function<br>**When:** using test() instead of it()<br>**Then:** it should also work |
| . | [vitest-example](vitest-example.md) | [L31](src/test/vitest-example.test.ts#L31) | Vitest Compatibility Tests > should handle skipped tests | **Given:** a skipped test<br>**When:** marked with .skip<br>**Then:** it should be documented but not executed |
| . | [vitest-example](vitest-example.md) | [L40](src/test/vitest-example.test.ts#L40) | Vitest Compatibility Tests > should handle only tests | **Given:** an only test<br>**When:** marked with .only<br>**Then:** only this test should run |
| . | [vitest-example](vitest-example.md) | [L49](src/test/vitest-example.test.ts#L49) | Vitest Compatibility Tests > should handle concurrent tests | **Given:** a concurrent test<br>**When:** marked with .concurrent<br>**Then:** it should run in parallel |
| . | [vitest-example](vitest-example.md) | [L74](src/test/vitest-example.test.ts#L74) | Vitest Benchmarks > should handle benchmark tests | **Given:** a function to benchmark<br>**When:** measuring performance<br>**Then:** execution time should be recorded |
| X | [A](X/A.md) | [L11](src/test/X/A.test.ts#L11) | Sample test in X directory > should preserve folder structure | **Given:** a test file in subdirectory X<br>**When:** running the documentation generator<br>**Then:** it should preserve the folder structure in output |
| Y | [A](Y/A.md) | [L11](src/test/Y/A.test.ts#L11) | Sample test in Y directory > should create separate documentation file | **Given:** a test file in subdirectory Y with same name as file in X<br>**When:** running the documentation generator<br>**Then:** it should create separate markdown files preserving directory structure |

## Tests by Tag

### advanced (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example](example.md) | [L65](src/test/example.test.ts#L65) | Documentation Generation [@advanced] > should parse complex test structures |

### configuration (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [github-link](github-link.md) | [L51](src/test/github-link.test.ts#L51) | Repository Root Configuration [@configuration] > should calculate paths relative to repository root |
| [github-link](github-link.md) | [L66](src/test/github-link.test.ts#L66) | Repository Root Configuration [@configuration] > should handle multiple conditions with @and clauses |

### error-case (7 tests)

| File | Link | Test Name |
|------|------|-----------|
| [01_uiVerifications](01_uiVerifications.md) | [L25](src/test/01_uiVerifications.spec.ts#L25) | UI Verifications > should show validation errors for invalid login |
| [01_uiVerifications](01_uiVerifications.md) | [L49](src/test/01_uiVerifications.spec.ts#L49) | Form Validations > should validate required fields |
| [01_uiVerifications](01_uiVerifications.md) | [L60](src/test/01_uiVerifications.spec.ts#L60) | Form Validations > should validate email format |
| [and-tag-examples](and-tag-examples.md) | [L69](src/test/and-tag-examples.test.ts#L69) | Error Handling [@error-cases] > should handle network failures gracefully |
| [and-tag-examples](and-tag-examples.md) | [L86](src/test/and-tag-examples.test.ts#L86) | Error Handling [@error-cases] > should prevent cascading failures |
| [example](example.md) | [L39](src/test/example.test.ts#L39) | MarkdownDocsGenerator > should handle errors when source directory does not exist |
| [verbose-test](verbose-test.md) | [L63](src/test/verbose-test.test.ts#L63) | Error Scenarios [@errors] > should handle errors with unknown documentation tags |

### error-cases (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](and-tag-examples.md) | [L69](src/test/and-tag-examples.test.ts#L69) | Error Handling [@error-cases] > should handle network failures gracefully |
| [and-tag-examples](and-tag-examples.md) | [L86](src/test/and-tag-examples.test.ts#L86) | Error Handling [@error-cases] > should prevent cascading failures |

### errors (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [verbose-test](verbose-test.md) | [L63](src/test/verbose-test.test.ts#L63) | Error Scenarios [@errors] > should handle errors with unknown documentation tags |

### integration (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](and-tag-examples.md) | [L52](src/test/and-tag-examples.test.ts#L52) | Data Processing Pipeline [@integration][@slow] > should process data through complete pipeline |

### performance (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](and-tag-examples.md) | [L105](src/test/and-tag-examples.test.ts#L105) | Performance Optimization [@performance] > should optimize performance through intelligent caching |

### security (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](and-tag-examples.md) | [L15](src/test/and-tag-examples.test.ts#L15) | User Authentication [@security] > should authenticate user with valid credentials |
| [and-tag-examples](and-tag-examples.md) | [L32](src/test/and-tag-examples.test.ts#L32) | User Authentication [@security] > should handle multi-factor authentication flow |

### slow (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](and-tag-examples.md) | [L52](src/test/and-tag-examples.test.ts#L52) | Data Processing Pipeline [@integration][@slow] > should process data through complete pipeline |

### testing (3 tests)

| File | Link | Test Name |
|------|------|-----------|
| [verbose-test](verbose-test.md) | [L13](src/test/verbose-test.test.ts#L13) | Verbose Mode Testing [@testing] > should work with known tags |
| [verbose-test](verbose-test.md) | [L29](src/test/verbose-test.test.ts#L29) | Verbose Mode Testing [@testing] > should log unknown tags in verbose mode |
| [verbose-test](verbose-test.md) | [L46](src/test/verbose-test.test.ts#L46) | Verbose Mode Testing [@testing] > should handle mixed tag scenarios |


---
*Generated on 2025-06-09T13:03:00.317Z*
*Generator: markdown-docs.ts*
