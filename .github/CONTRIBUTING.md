# Contributing to Markdown Docs Generator

First off, thank you for considering contributing to this project! Every contribution helps, and we appreciate the time you take to contribute.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.
- Provide specific examples to demonstrate the steps.
- Include information about your GitHub repository setup if the issue is related to GitHub linking functionality.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.
- Describe the current behavior and explain which behavior you expected to see instead and why.

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the TypeScript/JavaScript styleguide
- Include unit tests when adding new features
- Test both local file linking and GitHub linking functionality
- Update documentation if you're adding new command-line options or configuration
- End all files with a newline

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests: `npm test`
5. Test documentation generation:
   - Local links: `npm start`
   - GitHub links: `npm run start:github`

## Testing GitHub Integration

When testing GitHub linking functionality:

1. Test with various repository URL formats
2. Test with different branch names
3. Test with different repository root configurations
4. Verify that fallback to local links works when no GitHub URL is provided
5. Check that generated links are correctly formatted and accessible

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Use conventional commits format when possible:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `test:` for adding or updating tests
  - `ci:` for CI/CD changes

### TypeScript/JavaScript Styleguide

- All code is linted with ESLint
- Use TypeScript for new features when possible
- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Use camelCase for variables, functions, and instances
- Use PascalCase for classes and constructors
- Use const for all of your references; avoid using var
- Use arrow functions for callbacks when possible
- Document new configuration options in JSDoc comments
- Maintain backward compatibility when adding new features

### Documentation Styleguide

- Update README.md when adding new features
- Include examples for new command-line options
- Document both programmatic and CLI usage
- Include GitHub Actions examples when relevant
- Update workflow files when changing action inputs
