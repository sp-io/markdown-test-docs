# Markdown Test Documentation Generator

Automatically generate markdown documentation from Jest / Vitest test files, creating a comprehensive test documentation system with GitHub integration.

## Features

- Extracts test descriptions and metadata from Jest/Vitest test files
- Generates individual markdown files for each test file
- Creates a comprehensive index of all tests
- Supports JSDoc-style annotations in test comments
- Categorizes tests and extracts tags
- Formats using Given/When/Then style for behavior-driven tests
- **NEW**: GitHub repository integration with direct links to source code

## Example Output
Test file: [./src/test/example.test.ts](./src/test/example.test.ts)

Documentation file: [./doc/tests/README.md](./doc/tests/README.md)

## Installation

```bash
npm install markdown-docs-generator
```

Or install globally:

```bash
npm install -g markdown-docs-generator
```

## Usage

### Command Line

Basic usage:
```bash
markdown-docs --source ./src/test --output ./docs/tests
```

With GitHub integration:
```bash
markdown-docs --source ./src/test --output ./docs/tests \
  --github-url https://github.com/username/repo \
  --github-branch main \
  --repository-root ./
```

### Options

- `--source <path>`: Specify the source directory containing test files (default: `./src/test`)
- `--output <path>`: Specify the output directory for documentation (default: `./doc/tests`)
- `--github-url <url>`: GitHub repository URL (e.g., 'https://github.com/username/repo')
- `--github-branch <branch>`: GitHub branch name (default: 'main')
- `--repository-root <path>`: Repository root directory (default: current working directory)
- `--verbose, -v`: Enable verbose logging (shows unknown tags and additional info)

### GitHub Integration

When GitHub parameters are provided, the generated documentation will include direct links to the source code on GitHub instead of local file paths. This ensures that links work even when the documentation is moved or published elsewhere.

**Example without GitHub integration:**
- Link: `src/test/example.test.ts#L14`

**Example with GitHub integration:**
- Link: `https://github.com/username/repo/blob/main/src/test/example.test.ts#L14`

### Programmatic Usage

```typescript
import { MarkdownDocsGenerator } from 'markdown-docs-generator';

const generator = new MarkdownDocsGenerator({
  sourceDir: './src/test',
  outputDir: './docs/tests',
  githubUrl: 'https://github.com/username/repo',
  githubBranch: 'main',
  repositoryRoot: './',
  verbose: true  // Enable verbose logging
});

generator.generate().then(() => {
  console.log('Documentation generated successfully!');
});
```

### Verbose Mode

Enable verbose mode to get detailed logging information, including warnings about unknown JSDoc tags:

```bash
# Enable verbose logging
markdown-docs --source ./src/test --output ./docs/tests --verbose

# Short form
markdown-docs --source ./src/test --output ./docs/tests -v
```

When verbose mode is enabled, you'll see warnings like:
```
⚠️  Unknown tag found: @author (line: "@author John Doe")
⚠️  Unknown tag found: @deprecated (line: "@deprecated this is just a test")
⚠️  Unknown tag found: @todo (line: "@todo implement better logging")
```

This helps identify:
- Unsupported JSDoc tags that might need processing
- Potential typos in tag names
- Tags that could be added to future versions

## Test Documentation Format

### Supported Comment Format

The generator extracts documentation from JSDoc-style comments before each test case:

```typescript
/**
 * Description of the test
 * @given a precondition
 * @when an action occurs
 * @then expected outcome
 * @and additional condition or step
 * @and another condition or step
 */
it('should do something', () => {
  // Test implementation
});
```

### Enhanced Documentation Tags

- **`@given`** - Initial preconditions or setup
- **`@when`** - Actions or triggers that occur  
- **`@then`** - Expected outcomes or results
- **`@and`** - Additional conditions, steps, or outcomes (can be used multiple times)

#### Complex Scenario Example

```typescript
/**
 * Test complex multi-step user workflow
 * @given a user is logged into the system
 * @and the user has admin privileges
 * @when the user navigates to the settings page
 * @and clicks on the "Advanced" tab
 * @and modifies security settings
 * @then the changes should be saved successfully
 * @and the user should see a confirmation message
 * @and security logs should be updated
 */
it('should handle complex admin workflow', () => {
  // Test implementation
});
```

This generates documentation like:
- **Given:** a user is logged into the system
- **And:** the user has admin privileges  
- **When:** the user navigates to the settings page
- **And:** clicks on the "Advanced" tab
- **And:** modifies security settings
- **Then:** the changes should be saved successfully
- **And:** the user should see a confirmation message
- **And:** security logs should be updated

### Tags

You can add tags to your test describes using square brackets:

```typescript
describe('Feature [@slow][@integration]', () => {
  // Tests for this feature
});
```

## Output

The generator creates:

1. Individual markdown files for each test file
2. An `ALL_TESTS.md` file with a comprehensive list of all tests
3. A `README.md` index file with navigation and statistics

All files include clickable links to the exact line numbers in the source code, either as local paths or GitHub URLs.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Lint the code
npm run lint

# Generate docs with local links
npm start

# Generate docs with GitHub links
npm run start:github
```

## License

MIT