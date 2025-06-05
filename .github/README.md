# GitHub Integration

This directory contains GitHub-specific configurations and workflows for the Markdown Test Documentation Generator.

## 🚀 Workflows

### Core Workflows

- **`docs.yml`** - Generates documentation with GitHub links when code is pushed to main
- **`generate-markdown.yml`** - Triggers documentation generation when test files change
- **`docs-pages.yml`** - Generates documentation and deploys to GitHub Pages
- **`build.yml`** - Builds and tests the project
- **`lint.yml`** - Runs ESLint on the codebase
- **`release.yml`** - Handles automated releases

### GitHub Pages Deployment

The `docs-pages.yml` workflow automatically:
1. Generates test documentation with GitHub links
2. Creates a beautiful HTML interface
3. Deploys to GitHub Pages for easy sharing

Enable GitHub Pages in your repository settings to use this feature.

## 🔧 GitHub Action

### Using the Action in Your Repository

Add this to your `.github/workflows/docs.yml`:

```yaml
name: Generate Test Documentation

on:
  push:
    paths:
      - "src/**/*.test.ts"
      - "test/**/*.test.ts"

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: your-username/tsdoc-test-docs@main
        with:
          source: "./src"
          output: "./docs/tests"
          github-url: ${{ github.server_url }}/${{ github.repository }}
          github-branch: ${{ github.ref_name }}
          repository-root: "./"
```

### Action Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `source` | Directory containing test files | Yes | `./src` |
| `output` | Output directory for documentation | No | `./doc-tests` |
| `github-url` | GitHub repository URL | No | _(empty)_ |
| `github-branch` | GitHub branch name | No | `main` |
| `repository-root` | Repository root directory | No | `./` |

### Action Outputs

| Output | Description |
|--------|-------------|
| `success` | Whether the action completed successfully |
| `output-dir` | Directory where documentation was generated |
| `github-enabled` | Whether GitHub linking was enabled |

## 📝 Templates

### Issue Templates

- **Bug Report** (`ISSUE_TEMPLATE/bug_report.md`) - For reporting bugs
- **Feature Request** (`ISSUE_TEMPLATE/feature_request.md`) - For suggesting enhancements

### Pull Request Template

- **Pull Request** (`pull_request_template.md`) - Includes GitHub linking testing checklist

## ⚙️ Configuration Files

- **`CODEOWNERS`** - Defines code ownership
- **`dependabot.yml`** - Automated dependency updates
- **`CONTRIBUTING.md`** - Contribution guidelines

## 🔗 GitHub Linking Features

The workflows are designed to automatically use GitHub linking when:

- Running in GitHub Actions (uses `${{ github.server_url }}/${{ github.repository }}`)
- Repository information is available in the environment
- Links point directly to source code with line numbers

### Dynamic Repository Detection

Workflows automatically detect:
- Repository URL: `${{ github.server_url }}/${{ github.repository }}`
- Current branch: `${{ github.ref_name }}`
- Repository root: `./`

This ensures generated documentation always links to the correct repository and branch.

## 📚 Example Usage

See `example-usage.yml.template` for a complete workflow example you can copy to your repository.

### Key Benefits

1. **Automatic Updates**: Documentation updates whenever test files change
2. **GitHub Links**: Direct links to source code with line numbers
3. **GitHub Pages**: Optional deployment for public documentation
4. **Zero Configuration**: Works out of the box with sensible defaults

## 🛠️ Development

When contributing to this project:

1. Test workflows in your fork before submitting PRs
2. Update action inputs/outputs documentation when changing the action
3. Ensure backwards compatibility with existing workflows
4. Test both GitHub linking and fallback behavior

## 🔍 Troubleshooting

### Common Issues

**Documentation not updating**: Check that workflow has write permissions to repository

**Broken GitHub links**: Verify `github-url` and `repository-root` parameters

**Action not found**: Ensure you're using the correct repository reference

**Pages not deploying**: Enable GitHub Pages in repository settings

### Debugging

Enable workflow debugging by setting repository secret:
```
ACTIONS_STEP_DEBUG = true
```

This provides detailed logs for troubleshooting workflow issues.
