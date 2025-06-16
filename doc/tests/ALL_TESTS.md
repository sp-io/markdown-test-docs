# All Tests Documentation

This file contains a comprehensive list of all test cases across the entire project.

**Total Test Files:** 12
**Total Test Cases:** 50

## Test Type Summary

| Type | Count | Percentage |
|------|--------|------------|
| ✅ Regular | 33 | 66.0% |
| ⏭️ Skipped | 2 | 4.0% |
| 📝 Todo | 1 | 2.0% |
| 🔄 Each | 2 | 4.0% |
| 🎯 Only | 2 | 4.0% |
| ⚡ Concurrent | 2 | 4.0% |
| 📊 Benchmark | 2 | 4.0% |
| 🏷️ Marked | 3 | 6.0% |
| 🔢 Parametrize | 3 | 6.0% |

## ⚠️ Global Warnings

🚨 **Tests marked with .only found (2)** - These should not be committed to version control

## Test Distribution

- **Test:** 46 tests
- **Test/X:** 1 tests
- **Test/Y:** 1 tests
- **Test/committee:** 2 tests

## All Test Cases

| Category | File | Link | Test Name | Description |
|----------|------|------|-----------|-------------|
| Test | [01_uiVerifications](test/01_uiVerifications.md) | [L14](https://github.com/username/tsdoc-test-docs/blob/main/src/test/01_uiVerifications.spec.ts#L14) | UI Verifications > should load the main page | **Verify that the main page loads correctly**<br>**Given:** the application is running<br>**When:** the user navigates to the main page<br>**Then:** the page should load successfully |
| Test | [01_uiVerifications](test/01_uiVerifications.md) | [L25](https://github.com/username/tsdoc-test-docs/blob/main/src/test/01_uiVerifications.spec.ts#L25) | UI Verifications > should show validation errors for invalid login | **Test login form validation**<br>**Given:** the login form is displayed<br>**When:** the user enters invalid credentials<br>**Then:** appropriate error messages should be shown |
| Test | [01_uiVerifications](test/01_uiVerifications.md) | [L36](https://github.com/username/tsdoc-test-docs/blob/main/src/test/01_uiVerifications.spec.ts#L36) | UI Verifications > should navigate correctly through menu items | **Verify navigation menu functionality**<br>**Given:** the user is logged in<br>**When:** clicking on navigation items<br>**Then:** the correct pages should be displayed |
| Test | [01_uiVerifications](test/01_uiVerifications.md) | [L49](https://github.com/username/tsdoc-test-docs/blob/main/src/test/01_uiVerifications.spec.ts#L49) | Form Validations > should validate required fields | **Test required field validation**<br>**Given:** a form with required fields<br>**When:** submitting without filling required fields<br>**Then:** validation errors should appear |
| Test | [01_uiVerifications](test/01_uiVerifications.md) | [L60](https://github.com/username/tsdoc-test-docs/blob/main/src/test/01_uiVerifications.spec.ts#L60) | Form Validations > should validate email format | **Test email format validation**<br>**Given:** an email input field<br>**When:** entering invalid email format<br>**Then:** email validation error should be shown |
| Test | [and-tag-examples](test/and-tag-examples.md) | [L15](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L15) | User Authentication [@security] > should authenticate user with valid credentials | **Simple login test with additional verification**<br>**Given:** a valid user account exists<br>**When:** the user submits correct credentials<br>**Then:** the user should be logged in successfully<br>**And:** session should be created<br>**And:** user should be redirected to dashboard |
| Test | [and-tag-examples](test/and-tag-examples.md) | [L32](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L32) | User Authentication [@security] > should handle multi-factor authentication flow | **Complex multi-factor authentication scenario**<br>**Given:** a user with 2FA enabled<br>**When:** the user enters valid username and password<br>**Then:** authentication should succeed<br>**And:** the user has access to their authenticator device<br>**And:** the user account is not locked<br>**And:** provides correct 2FA token<br>**And:** confirms their identity<br>**And:** secure session should be established<br>**And:** user permissions should be loaded<br>**And:** audit log should record the login |
| Test | [and-tag-examples](test/and-tag-examples.md) | [L52](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L52) | Data Processing Pipeline [@integration][@slow] > should process data through complete pipeline | **End-to-end data transformation test**<br>**Given:** raw data is available in the input queue<br>**When:** the processing pipeline starts<br>**Then:** processed data should be available in output<br>**And:** validation rules are configured<br>**And:** output destination is accessible<br>**And:** data validation passes<br>**And:** transformation rules are applied<br>**And:** results are formatted<br>**And:** original data should be archived<br>**And:** processing metrics should be recorded<br>**And:** notifications should be sent to stakeholders |
| Test | [and-tag-examples](test/and-tag-examples.md) | [L69](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L69) | Error Handling [@error-cases] > should handle network failures gracefully | **Network failure recovery scenario**<br>**Given:** an active network connection<br>**When:** a network failure occurs during operation<br>**Then:** the system should attempt reconnection<br>**And:** connection is lost for more than 30 seconds<br>**And:** automatic retry is triggered<br>**And:** failed operations should be queued<br>**And:** user should be notified of the issue<br>**And:** when connection is restored, queued operations should resume |
| Test | [and-tag-examples](test/and-tag-examples.md) | [L86](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L86) | Error Handling [@error-cases] > should prevent cascading failures | **Cascading failure prevention**<br>**Given:** multiple dependent services are running<br>**When:** one service fails<br>**Then:** requests should be redirected to fallback<br>**And:** circuit breakers are configured<br>**And:** failure rate exceeds threshold<br>**And:** circuit breaker opens<br>**And:** dependent services should remain operational<br>**And:** monitoring alerts should be triggered<br>**And:** service health dashboard should update<br>**And:** recovery procedures should initiate automatically |
| Test | [and-tag-examples](test/and-tag-examples.md) | [L105](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L105) | Performance Optimization [@performance] > should optimize performance through intelligent caching | **Caching strategy validation**<br>**Given:** cache is empty<br>**When:** multiple requests for same data occur<br>**Then:** subsequent requests should hit cache<br>**And:** cache size limit is configured<br>**And:** cache miss happens on first request<br>**And:** data is retrieved from source<br>**And:** cached for future requests<br>**And:** response time should improve significantly<br>**And:** cache memory usage should be within limits<br>**And:** cache hit ratio should meet performance targets |
| Test | [docstring_fixes](test/test_docstring_fixes.md) | [L10](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L10) | negative balance burn | Test that trying to burn negative balance should fail<br><br>**Steps:**<br>- attempt to burn negative balance<br>- check that an exception is raised |
| Test | [docstring_fixes](test/test_docstring_fixes.md) | [L21](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L21) | long receiver address | Test that setting the receiver address to a value that is more than 32 bytes does not<br>succeed and doesn't break the chain<br><br>**Steps:**<br>- attempt to burn with a pc_addr more than 32 bytes long<br>- check that an exception is raised<br>- check that rpc remains functional |
| Test | [docstring_fixes](test/test_docstring_fixes.md) | [L35](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L35) | simple parametrize | Test parametrized function<br><br>**Given:** an input value<br>**When:** doubling it<br>**Then:** should get expected result |
| Test | [enhanced-demo](test/enhanced-demo.md) | [L11](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L11) | Enhanced Test Type Demo > should be a regular test | **Given:** a basic test case<br>**When:** it runs normally<br>**Then:** it should pass |
| Test | [enhanced-demo](test/enhanced-demo.md) | [L20](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L20) | Enhanced Test Type Demo > should be a skipped test | **Given:** a test that needs to be temporarily disabled<br>**When:** marked with .skip<br>**Then:** it should be documented but not executed |
| Test | [enhanced-demo](test/enhanced-demo.md) | [L29](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L29) | Enhanced Test Type Demo > should be a todo test | **Given:** a test that is not yet implemented<br>**When:** marked with .todo<br>**Then:** it should be documented as planned work |
| Test | [enhanced-demo](test/enhanced-demo.md) | [L40](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L40) | Enhanced Test Type Demo > should handle each test with input $input expecting $expected | **Given:** multiple test scenarios<br>**When:** using parameterized testing<br>**Then:** all combinations should be tested efficiently |
| Test | [enhanced-demo](test/enhanced-demo.md) | [L49](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L49) | Enhanced Test Type Demo > should be a concurrent test | **Given:** a test that can run independently<br>**When:** marked with .concurrent<br>**Then:** it should run in parallel with other concurrent tests |
| Test | [enhanced-demo](test/enhanced-demo.md) | [L60](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L60) | Enhanced Test Type Demo > should be an only test (DO NOT COMMIT) | **This test should NOT be committed - for demo purposes only**<br>**Given:** a test marked with .only<br>**When:** it runs<br>**Then:** only this test will execute |
| Test | [enhanced-demo](test/enhanced-demo.md) | [L72](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L72) | Performance Tests > should benchmark array operations | **Given:** a function to benchmark<br>**When:** measuring performance<br>**Then:** execution time should be recorded |
| Test | [example](test/example.md) | [L14](https://github.com/username/tsdoc-test-docs/blob/main/src/test/example.test.ts#L14) | MarkdownDocsGenerator > should initialize with default directories | **Test constructor initialization**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** no options are provided<br>**Then:** it should use default directories |
| Test | [example](test/example.md) | [L25](https://github.com/username/tsdoc-test-docs/blob/main/src/test/example.test.ts#L25) | MarkdownDocsGenerator > should initialize with custom directories | **Test custom directory configuration**<br>**Given:** a new MarkdownDocsGenerator instance<br>**When:** custom directories are provided<br>**Then:** it should use the custom directories |
| Test | [example](test/example.md) | [L39](https://github.com/username/tsdoc-test-docs/blob/main/src/test/example.test.ts#L39) | MarkdownDocsGenerator > should handle errors when source directory does not exist | **Test error handling**<br>**Given:** an invalid source directory<br>**When:** the generator tries to find test files<br>**Then:** it should handle the error gracefully |
| Test | [example](test/example.md) | [L65](https://github.com/username/tsdoc-test-docs/blob/main/src/test/example.test.ts#L65) | Documentation Generation [@advanced] > should parse complex test structures | **Advanced feature test**<br>**Given:** a test file with complex structure<br>**When:** the documentation is generated<br>**Then:** it should correctly parse all test cases<br>**And:** a MarkdownDocsGenerator configured to parse it |
| Test | [example_pytest](test/test_example_pytest.md) | [L15](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L15) | TestSmoke::block producing | Test node producing a block<br><br>**Steps:**<br>- get latest partner chain block<br>- wait for a predefined time<br>- get latest partner chain block one more time<br>- verify that block numbers increased |
| Test | [example_pytest](test/test_example_pytest.md) | [L31](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L31) | TestSmoke::transaction | Test node making a transaction<br><br>**Steps:**<br>- create a transaction<br>- sign transaction<br>- submit transaction<br>- check a balance of receiver was updated |
| Test | [example_pytest](test/test_example_pytest.md) | [L59](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L59) | TestSmoke::lock transaction | Test that the user can lock tokens on a partner chain<br><br>**Steps:**<br>- create new transaction<br>- lock transaction by calling lock() from ActiveFlow module<br>- sign and submit transaction by calling extrinsic methods from substrate API |
| Test | [example_pytest](test/test_example_pytest.md) | [L86](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L86) | multiplication | Test multiplication function with multiple inputs<br><br>**Given:** an input value<br>**When:** multiplying by 2<br>**Then:** result should match expected value |
| Test | [example_pytest](test/test_example_pytest.md) | [L96](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L96) | simple assertion | Simple test without any special markers |
| Test | [github-link](test/github-link.md) | [L13](https://github.com/username/tsdoc-test-docs/blob/main/src/test/github-link.test.ts#L13) | GitHub Link Generation > should generate GitHub URLs when configured | **Test GitHub URL generation**<br>**Given:** a MarkdownDocsGenerator configured with GitHub parameters<br>**When:** documentation is generated<br>**Then:** links should point to GitHub repository |
| Test | [github-link](test/github-link.md) | [L24](https://github.com/username/tsdoc-test-docs/blob/main/src/test/github-link.test.ts#L24) | GitHub Link Generation > should fallback to relative paths when no GitHub URL provided | **Test fallback behavior**<br>**Given:** a MarkdownDocsGenerator without GitHub configuration<br>**When:** documentation is generated<br>**Then:** links should use relative file paths |
| Test | [github-link](test/github-link.md) | [L38](https://github.com/username/tsdoc-test-docs/blob/main/src/test/github-link.test.ts#L38) | GitHub Link Generation > should handle complex multi-step scenarios | **Test complex scenario with multiple conditions**<br>**Given:** a repository with multiple test files<br>**When:** documentation is generated with GitHub URL<br>**Then:** all links should point to correct GitHub locations<br>**And:** the repository has nested directory structure<br>**And:** the branch name is specified<br>**And:** paths should be calculated relative to repository root |
| Test | [github-link](test/github-link.md) | [L51](https://github.com/username/tsdoc-test-docs/blob/main/src/test/github-link.test.ts#L51) | Repository Root Configuration [@configuration] > should calculate paths relative to repository root | **Test repository root path handling**<br>**Given:** different repository root configurations<br>**When:** generating documentation<br>**Then:** paths should be calculated correctly relative to the repository root |
| Test | [github-link](test/github-link.md) | [L66](https://github.com/username/tsdoc-test-docs/blob/main/src/test/github-link.test.ts#L66) | Repository Root Configuration [@configuration] > should handle multiple conditions with @and clauses | **Test compound conditions with @and tags**<br>**Given:** a project with custom repository root<br>**When:** generating documentation<br>**Then:** documentation should be generated for all directories<br>**And:** multiple source directories<br>**And:** GitHub URL is provided<br>**And:** all links should use the correct base path<br>**And:** generated files should maintain proper structure |
| Test | [verbose-test](test/verbose-test.md) | [L13](https://github.com/username/tsdoc-test-docs/blob/main/src/test/verbose-test.test.ts#L13) | Verbose Mode Testing [@testing] > should work with known tags | **Test with standard supported tags**<br>**Given:** a valid test setup<br>**When:** the test runs<br>**Then:** it should pass successfully |
| Test | [verbose-test](test/verbose-test.md) | [L29](https://github.com/username/tsdoc-test-docs/blob/main/src/test/verbose-test.test.ts#L29) | Verbose Mode Testing [@testing] > should log unknown tags in verbose mode | **Test with some unknown tags that should be logged in verbose mode**<br>**Given:** a test with unknown tags<br>**When:** the test runs in verbose mode<br>**Then:** unknown tags should be logged |
| Test | [verbose-test](test/verbose-test.md) | [L46](https://github.com/username/tsdoc-test-docs/blob/main/src/test/verbose-test.test.ts#L46) | Verbose Mode Testing [@testing] > should handle mixed tag scenarios | **Test with mixed known and unknown tags**<br>**Given:** a complex test scenario<br>**When:** processing occurs<br>**Then:** expected outcome is achieved<br>**And:** multiple conditions exist<br>**And:** all conditions are met |
| Test | [verbose-test](test/verbose-test.md) | [L63](https://github.com/username/tsdoc-test-docs/blob/main/src/test/verbose-test.test.ts#L63) | Error Scenarios [@errors] > should handle errors with unknown documentation tags | **Test error handling with documentation tags**<br>**Given:** an error-prone operation<br>**When:** an error occurs<br>**Then:** error should be handled gracefully<br>**And:** proper cleanup should occur |
| Test | [vitest-example](test/vitest-example.md) | [L13](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L13) | Vitest Compatibility Tests > should handle basic it() tests | **Given:** a basic test case<br>**When:** the test is executed<br>**Then:** it should pass |
| Test | [vitest-example](test/vitest-example.md) | [L22](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L22) | Vitest Compatibility Tests > should handle test() function | **Given:** a test function<br>**When:** using test() instead of it()<br>**Then:** it should also work |
| Test | [vitest-example](test/vitest-example.md) | [L31](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L31) | Vitest Compatibility Tests > should handle skipped tests | **Given:** a skipped test<br>**When:** marked with .skip<br>**Then:** it should be documented but not executed |
| Test | [vitest-example](test/vitest-example.md) | [L40](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L40) | Vitest Compatibility Tests > should handle only tests | **Given:** an only test<br>**When:** marked with .only<br>**Then:** only this test should run |
| Test | [vitest-example](test/vitest-example.md) | [L49](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L49) | Vitest Compatibility Tests > should handle concurrent tests | **Given:** a concurrent test<br>**When:** marked with .concurrent<br>**Then:** it should run in parallel |
| Test | [vitest-example](test/vitest-example.md) | [L63](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L63) | Vitest Compatibility Tests > should handle each tests with input $input | **Given:** parameterized test data<br>**When:** using each with multiple values<br>**Then:** all combinations should be tested |
| Test | [vitest-example](test/vitest-example.md) | [L74](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L74) | Vitest Benchmarks > should handle benchmark tests | **Given:** a function to benchmark<br>**When:** measuring performance<br>**Then:** execution time should be recorded |
| Test/committee | [subfolder](test/committee/test_subfolder.md) | [L6](https://github.com/username/tsdoc-test-docs/blob/main/src/test/committee/test_subfolder.py#L6) | committee functionality | Test committee functionality<br>This test verifies that committee operations work correctly.<br><br>**Steps:**<br>- create a committee member<br>- validate member permissions<br>- execute committee actions |
| Test/committee | [subfolder](test/committee/test_subfolder.md) | [L22](https://github.com/username/tsdoc-test-docs/blob/main/src/test/committee/test_subfolder.py#L22) | subfolder parametrized | Test parametrized functionality in subfolder<br><br>**Given:** an input value in a subfolder test<br>**When:** doubling the value<br>**Then:** result should match expected |
| Test/X | [A](test/X/A.md) | [L11](https://github.com/username/tsdoc-test-docs/blob/main/src/test/X/A.test.ts#L11) | Sample test in X directory > should preserve folder structure | **Given:** a test file in subdirectory X<br>**When:** running the documentation generator<br>**Then:** it should preserve the folder structure in output |
| Test/Y | [A](test/Y/A.md) | [L11](https://github.com/username/tsdoc-test-docs/blob/main/src/test/Y/A.test.ts#L11) | Sample test in Y directory > should create separate documentation file | **Given:** a test file in subdirectory Y with same name as file in X<br>**When:** running the documentation generator<br>**Then:** it should create separate markdown files preserving directory structure |

## Tests by Tag

### active_flow (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test/test_example_pytest.md) | [L59](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L59) | TestSmoke::lock transaction |

### advanced (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example](test/example.md) | [L65](https://github.com/username/tsdoc-test-docs/blob/main/src/test/example.test.ts#L65) | Documentation Generation [@advanced] > should parse complex test structures |

### ariadne (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test/test_example_pytest.md) | [L15](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L15) | TestSmoke::block producing |
| [example_pytest](test/test_example_pytest.md) | [L31](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L31) | TestSmoke::transaction |

### configuration (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [github-link](test/github-link.md) | [L51](https://github.com/username/tsdoc-test-docs/blob/main/src/test/github-link.test.ts#L51) | Repository Root Configuration [@configuration] > should calculate paths relative to repository root |
| [github-link](test/github-link.md) | [L66](https://github.com/username/tsdoc-test-docs/blob/main/src/test/github-link.test.ts#L66) | Repository Root Configuration [@configuration] > should handle multiple conditions with @and clauses |

### error-case (7 tests)

| File | Link | Test Name |
|------|------|-----------|
| [01_uiVerifications](test/01_uiVerifications.md) | [L25](https://github.com/username/tsdoc-test-docs/blob/main/src/test/01_uiVerifications.spec.ts#L25) | UI Verifications > should show validation errors for invalid login |
| [01_uiVerifications](test/01_uiVerifications.md) | [L49](https://github.com/username/tsdoc-test-docs/blob/main/src/test/01_uiVerifications.spec.ts#L49) | Form Validations > should validate required fields |
| [01_uiVerifications](test/01_uiVerifications.md) | [L60](https://github.com/username/tsdoc-test-docs/blob/main/src/test/01_uiVerifications.spec.ts#L60) | Form Validations > should validate email format |
| [and-tag-examples](test/and-tag-examples.md) | [L69](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L69) | Error Handling [@error-cases] > should handle network failures gracefully |
| [and-tag-examples](test/and-tag-examples.md) | [L86](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L86) | Error Handling [@error-cases] > should prevent cascading failures |
| [example](test/example.md) | [L39](https://github.com/username/tsdoc-test-docs/blob/main/src/test/example.test.ts#L39) | MarkdownDocsGenerator > should handle errors when source directory does not exist |
| [verbose-test](test/verbose-test.md) | [L63](https://github.com/username/tsdoc-test-docs/blob/main/src/test/verbose-test.test.ts#L63) | Error Scenarios [@errors] > should handle errors with unknown documentation tags |

### error-cases (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](test/and-tag-examples.md) | [L69](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L69) | Error Handling [@error-cases] > should handle network failures gracefully |
| [and-tag-examples](test/and-tag-examples.md) | [L86](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L86) | Error Handling [@error-cases] > should prevent cascading failures |

### errors (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [verbose-test](test/verbose-test.md) | [L63](https://github.com/username/tsdoc-test-docs/blob/main/src/test/verbose-test.test.ts#L63) | Error Scenarios [@errors] > should handle errors with unknown documentation tags |

### integration (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](test/and-tag-examples.md) | [L52](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L52) | Data Processing Pipeline [@integration][@slow] > should process data through complete pipeline |

### negative-test (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [docstring_fixes](test/test_docstring_fixes.md) | [L10](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L10) | negative balance burn |
| [enhanced-demo](test/enhanced-demo.md) | [L60](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L60) | Enhanced Test Type Demo > should be an only test (DO NOT COMMIT) |

### parameterized (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [enhanced-demo](test/enhanced-demo.md) | [L40](https://github.com/username/tsdoc-test-docs/blob/main/src/test/enhanced-demo.test.ts#L40) | Enhanced Test Type Demo > should handle each test with input $input expecting $expected |
| [vitest-example](test/vitest-example.md) | [L63](https://github.com/username/tsdoc-test-docs/blob/main/src/test/vitest-example.test.ts#L63) | Vitest Compatibility Tests > should handle each tests with input $input |

### parametrize (3 tests)

| File | Link | Test Name |
|------|------|-----------|
| [docstring_fixes](test/test_docstring_fixes.md) | [L35](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_docstring_fixes.py#L35) | simple parametrize |
| [example_pytest](test/test_example_pytest.md) | [L86](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L86) | multiplication |
| [subfolder](test/committee/test_subfolder.md) | [L22](https://github.com/username/tsdoc-test-docs/blob/main/src/test/committee/test_subfolder.py#L22) | subfolder parametrized |

### performance (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](test/and-tag-examples.md) | [L105](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L105) | Performance Optimization [@performance] > should optimize performance through intelligent caching |

### security (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](test/and-tag-examples.md) | [L15](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L15) | User Authentication [@security] > should authenticate user with valid credentials |
| [and-tag-examples](test/and-tag-examples.md) | [L32](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L32) | User Authentication [@security] > should handle multi-factor authentication flow |

### skip_blockchain (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test/test_example_pytest.md) | [L59](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L59) | TestSmoke::lock transaction |

### slow (1 tests)

| File | Link | Test Name |
|------|------|-----------|
| [and-tag-examples](test/and-tag-examples.md) | [L52](https://github.com/username/tsdoc-test-docs/blob/main/src/test/and-tag-examples.test.ts#L52) | Data Processing Pipeline [@integration][@slow] > should process data through complete pipeline |

### substrate (2 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test/test_example_pytest.md) | [L15](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L15) | TestSmoke::block producing |
| [example_pytest](test/test_example_pytest.md) | [L31](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L31) | TestSmoke::transaction |

### test_key (3 tests)

| File | Link | Test Name |
|------|------|-----------|
| [example_pytest](test/test_example_pytest.md) | [L15](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L15) | TestSmoke::block producing |
| [example_pytest](test/test_example_pytest.md) | [L31](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L31) | TestSmoke::transaction |
| [example_pytest](test/test_example_pytest.md) | [L59](https://github.com/username/tsdoc-test-docs/blob/main/src/test/test_example_pytest.py#L59) | TestSmoke::lock transaction |

### testing (3 tests)

| File | Link | Test Name |
|------|------|-----------|
| [verbose-test](test/verbose-test.md) | [L13](https://github.com/username/tsdoc-test-docs/blob/main/src/test/verbose-test.test.ts#L13) | Verbose Mode Testing [@testing] > should work with known tags |
| [verbose-test](test/verbose-test.md) | [L29](https://github.com/username/tsdoc-test-docs/blob/main/src/test/verbose-test.test.ts#L29) | Verbose Mode Testing [@testing] > should log unknown tags in verbose mode |
| [verbose-test](test/verbose-test.md) | [L46](https://github.com/username/tsdoc-test-docs/blob/main/src/test/verbose-test.test.ts#L46) | Verbose Mode Testing [@testing] > should handle mixed tag scenarios |


---
*Generator: markdown-docs.ts*
