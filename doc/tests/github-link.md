# github-link Test Documentation

**File:** `test/github-link.test.ts`

**Total Tests:** 5

**Tags:** `configuration`

## Test Categories

- **GitHub Link Generation:** 3 tests
- **Repository Root Configuration [@configuration]:** 2 tests

## Test Cases

| Test Name | Link | Description |
|-----------|------|-------------|
| GitHub Link Generation > should generate GitHub URLs when configured | [L13](src/test/github-link.test.ts#L13) | **Test GitHub URL generation**<br>**Given:** a MarkdownDocsGenerator configured with GitHub parameters<br>**When:** documentation is generated<br>**Then:** links should point to GitHub repository |
| GitHub Link Generation > should fallback to relative paths when no GitHub URL provided | [L24](src/test/github-link.test.ts#L24) | **Test fallback behavior**<br>**Given:** a MarkdownDocsGenerator without GitHub configuration<br>**When:** documentation is generated<br>**Then:** links should use relative file paths |
| GitHub Link Generation > should handle complex multi-step scenarios | [L38](src/test/github-link.test.ts#L38) | **Test complex scenario with multiple conditions**<br>**Given:** a repository with multiple test files<br>**When:** documentation is generated with GitHub URL<br>**Then:** all links should point to correct GitHub locations<br>**And:** the repository has nested directory structure<br>**And:** the branch name is specified<br>**And:** paths should be calculated relative to repository root |
| Repository Root Configuration [@configuration] > should calculate paths relative to repository root | [L51](src/test/github-link.test.ts#L51) | **Test repository root path handling**<br>**Given:** different repository root configurations<br>**When:** generating documentation<br>**Then:** paths should be calculated correctly relative to the repository root |
| Repository Root Configuration [@configuration] > should handle multiple conditions with @and clauses | [L66](src/test/github-link.test.ts#L66) | **Test compound conditions with @and tags**<br>**Given:** a project with custom repository root<br>**When:** generating documentation<br>**Then:** documentation should be generated for all directories<br>**And:** multiple source directories<br>**And:** GitHub URL is provided<br>**And:** all links should use the correct base path<br>**And:** generated files should maintain proper structure |

---
*Generated on 2025-06-06T10:47:49.910Z*
