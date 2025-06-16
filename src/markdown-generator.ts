import path from 'path';
import { FileDocumentation, TestType, TestCase, TestCaseWithFile } from './types';
import { LinkGenerator } from './link-generator';

export class MarkdownGenerator {
  constructor(private linkGenerator: LinkGenerator) {}

  /**
   * Generate enhanced markdown content for a single file
   */
  generateMarkdownContent(fileData: FileDocumentation): string {
    const { fileName, filePath, tests, summary } = fileData;
    
    let content = `# ${fileName} Test Documentation\n\n`;
    content += `**File:** \`${filePath}\`\n\n`;
    content += `**Total Tests:** ${summary.total}\n\n`;
    
    // Add test type summary
    content += '## Test Type Summary\n\n';
    content += '| Type | Count | Percentage |\n';
    content += '|------|--------|------------|\n';
    
    const testTypeOrder: TestType[] = ['regular', 'skipped', 'todo', 'each', 'only', 'concurrent', 'benchmark', 'marked', 'parametrize'];
    
    for (const testType of testTypeOrder) {
      const count = summary.testTypes[testType];
      if (count > 0) {
        const percentage = ((count / summary.total) * 100).toFixed(1);
        const emoji = this.getTestTypeEmoji(testType);
        const typeLabel = testType.charAt(0).toUpperCase() + testType.slice(1);
        content += `| ${emoji} ${typeLabel} | ${count} | ${percentage}% |\n`;
      }
    }
    content += '\n';

    // Add warnings for potentially problematic test types
    const warnings: string[] = [];
    if (summary.testTypes.skipped > summary.total * 0.2) {
      warnings.push(`⚠️ **High number of skipped tests (${summary.testTypes.skipped}/${summary.total})** - Consider reviewing or removing these tests`);
    }
    if (summary.testTypes.only > 0) {
      warnings.push(`🚨 **Tests marked with .only found (${summary.testTypes.only})** - These should not be committed to version control`);
    }
    if (summary.testTypes.todo > summary.total * 0.3) {
      warnings.push(`📝 **Many TODO tests (${summary.testTypes.todo}/${summary.total})** - Consider implementing these tests`);
    }

    if (warnings.length > 0) {
      content += '## ⚠️ Warnings\n\n';
      warnings.forEach(warning => {
        content += `${warning}\n\n`;
      });
    }
    
    // Add tags if any
    if (summary.tags.length > 0) {
      content += `**Tags:** ${summary.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`;
    }

    // Add categories summary
    if (Object.keys(summary.categories).length > 1) {
      content += '## Test Categories\n\n';
      for (const [category, count] of Object.entries(summary.categories)) {
        content += `- **${category}:** ${count} tests\n`;
      }
      content += '\n';
    }

    // Add test cases table with type indicators
    content += '## Test Cases\n\n';
    content += '| Type | Link | Test Name | Description |\n';
    content += '|------|------|-----------|-------------|\n';
    
    for (const test of tests) {
      const typeEmoji = this.getTestTypeEmoji(test.testType);
      const testName = this.escapeMarkdown(test.testName);
      const link = `[L${test.lineNumber}](${test.link})`;
      const description = this.escapeMarkdown(test.description || 'No description available');
      
      content += `| ${typeEmoji} | ${link} | ${testName} | ${description} |\n`;
    }

    content += '\n---\n';
    return content;
  }

  /**
   * Generate comprehensive ALL_TESTS.md file with all test cases
   */
  generateAllTestsContent(documentation: Map<string, FileDocumentation>): string {
    // Collect all tests from all files
    const allTests: TestCaseWithFile[] = [];
    for (const [relativePath, fileData] of documentation) {
      for (const test of fileData.tests) {
        allTests.push({
          ...test,
          fileName: fileData.fileName,
          filePath: relativePath,
          category: this.linkGenerator.getCategoryFromPath(relativePath)
        });
      }
    }

    // Sort tests by category, then by file name, then by line number
    allTests.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      if (a.fileName !== b.fileName) {
        return a.fileName.localeCompare(b.fileName);
      }
      return a.lineNumber - b.lineNumber;
    });

    let content = '# All Tests Documentation\n\n';
    content += 'This file contains a comprehensive list of all test cases across the entire project.\n\n';
    content += `**Total Test Files:** ${documentation.size}\n`;
    content += `**Total Test Cases:** ${allTests.length}\n\n`;

    // Calculate global test type summary
    const globalTestTypes = {
      regular: 0,
      skipped: 0,
      todo: 0,
      each: 0,
      only: 0,
      concurrent: 0,
      benchmark: 0,
      marked: 0,
      parametrize: 0
    };

    allTests.forEach(test => {
      if (test.testType in globalTestTypes) {
        globalTestTypes[test.testType as keyof typeof globalTestTypes]++;
      }
    });

    // Add global test type summary
    content += '## Test Type Summary\n\n';
    content += '| Type | Count | Percentage |\n';
    content += '|------|--------|------------|\n';
    
    const testTypeOrder: TestType[] = ['regular', 'skipped', 'todo', 'each', 'only', 'concurrent', 'benchmark', 'marked', 'parametrize'];
    
    for (const testType of testTypeOrder) {
      const count = globalTestTypes[testType as keyof typeof globalTestTypes];
      if (count > 0) {
        const percentage = ((count / allTests.length) * 100).toFixed(1);
        const emoji = this.getTestTypeEmoji(testType);
        const typeLabel = testType.charAt(0).toUpperCase() + testType.slice(1);
        content += `| ${emoji} ${typeLabel} | ${count} | ${percentage}% |\n`;
      }
    }
    content += '\n';

    // Add warnings for potentially problematic test types
    const warnings: string[] = [];
    if (globalTestTypes.skipped > allTests.length * 0.2) {
      warnings.push(`⚠️ **High number of skipped tests (${globalTestTypes.skipped}/${allTests.length})** - Consider reviewing or removing these tests`);
    }
    if (globalTestTypes.only > 0) {
      warnings.push(`🚨 **Tests marked with .only found (${globalTestTypes.only})** - These should not be committed to version control`);
    }
    if (globalTestTypes.todo > allTests.length * 0.3) {
      warnings.push(`📝 **Many TODO tests (${globalTestTypes.todo}/${allTests.length})** - Consider implementing these tests`);
    }

    if (warnings.length > 0) {
      content += '## ⚠️ Global Warnings\n\n';
      warnings.forEach(warning => {
        content += `${warning}\n\n`;
      });
    }

    // Add statistics by category
    const categoryStats: Record<string, number> = {};
    allTests.forEach(test => {
      categoryStats[test.category] = (categoryStats[test.category] || 0) + 1;
    });

    content += '## Test Distribution\n\n';
    for (const [category, count] of Object.entries(categoryStats).sort()) {
      content += `- **${category}:** ${count} tests\n`;
    }
    content += '\n';

    // Add comprehensive test table
    content += '## All Test Cases\n\n';
    content += '| Category | File | Link | Test Name | Description |\n';
    content += '|----------|------|------|-----------|-------------|\n';
    
    for (const test of allTests) {
      const category = this.escapeMarkdown(test.category);
      const markdownRelativePath = this.linkGenerator.getMarkdownPath(test.filePath);
      const fileName = `[${test.fileName}](${markdownRelativePath})`;
      const testName = this.escapeMarkdown(test.testName);
      const link = `[L${test.lineNumber}](${test.link})`;
      const description = this.escapeMarkdown(test.description || 'No description available');
      
      content += `| ${category} | ${fileName} | ${link} | ${testName} | ${description} |\n`;
    }

    // Add tag-based index
    const allTags = new Set<string>();
    allTests.forEach(test => {
      test.tags.forEach(tag => allTags.add(tag));
    });

    if (allTags.size > 0) {
      content += '\n## Tests by Tag\n\n';
      
      for (const tag of Array.from(allTags).sort()) {
        const testsWithTag = allTests.filter(test => test.tags.includes(tag));
        content += `### ${tag} (${testsWithTag.length} tests)\n\n`;
        
        content += '| File | Link | Test Name |\n';
        content += '|------|------|-----------|\n';
        
        for (const test of testsWithTag) {
          const markdownRelativePath = this.linkGenerator.getMarkdownPath(test.filePath);
          const fileName = `[${test.fileName}](${markdownRelativePath})`;
          const testName = this.escapeMarkdown(test.testName);
          const link = `[L${test.lineNumber}](${test.link})`;
          
          content += `| ${fileName} | ${link} | ${testName} |\n`;
        }
        content += '\n';
      }
    }

    content += '\n---\n';
    content += '*Generator: markdown-docs.ts*\n';
    return content;
  }

  /**
   * Generate the index file listing all documented files
   */
  generateIndexContent(documentation: Map<string, FileDocumentation>): string {
    let content = '# Test Documentation Index\n\n';
    content += 'This directory contains automatically generated documentation for all test files.\n\n';
    content += `**Total Files:** ${documentation.size}\n`;
    content += `**Total Tests:** ${Array.from(documentation.values()).reduce((sum, file) => sum + file.summary.total, 0)}\n\n`;

    // Add quick navigation
    content += '## Quick Navigation\n\n';
    content += '- 📊 **[ALL_TESTS.md](ALL_TESTS.md)** - Comprehensive list of all test cases\n';
    content += '- 📁 **Individual Files** - Detailed documentation for each test file\n\n';

    // Generate summary table
    content += '## Files Overview\n\n';
    content += '| File | Test Count | Test Types | Categories | Tags |\n';
    content += '|------|------------|------------|------------|------|\n';

    const sortedFiles = Array.from(documentation.entries()).sort(([a], [b]) => a.localeCompare(b));
    
    for (const [relativePath, fileData] of sortedFiles) {
      const fileName = fileData.fileName;
      const markdownRelativePath = this.linkGenerator.getMarkdownPath(relativePath);
      const testCount = fileData.summary.total;
      const categories = Object.keys(fileData.summary.categories).join(', ');
      const tags = fileData.summary.tags.join(', ');
      
      // Generate test type summary for this file
      const testTypes: string[] = [];
      const testTypeOrder: TestType[] = ['regular', 'skipped', 'todo', 'each', 'only', 'concurrent', 'benchmark', 'marked', 'parametrize'];
      
      for (const testType of testTypeOrder) {
        const count = fileData.summary.testTypes[testType];
        if (count > 0) {
          const emoji = this.getTestTypeEmoji(testType);
          testTypes.push(`${emoji}${count}`);
        }
      }
      
      const testTypesSummary = testTypes.join(' ');
      
      content += `| [${fileName}](${markdownRelativePath}) | ${testCount} | ${testTypesSummary} | ${categories} | ${tags} |\n`;
    }

    // Add detailed breakdown by directory
    content += '\n## Directory Structure\n\n';
    const directories = new Map<string, FileDocumentation[]>();
    
    for (const [relativePath, fileData] of documentation) {
      const dir = path.dirname(relativePath);
      if (!directories.has(dir)) {
        directories.set(dir, []);
      }
      directories.get(dir)!.push(fileData);
    }

    for (const [dir, files] of directories) {
      content += `### ${dir}\n\n`;
      const totalTests = files.reduce((sum, file) => sum + file.summary.total, 0);
      content += `**Files:** ${files.length} | **Tests:** ${totalTests}\n\n`;
      
      for (const file of files.sort((a, b) => a.fileName.localeCompare(b.fileName))) {
        const markdownRelativePath = this.linkGenerator.getMarkdownPath(file.filePath);
        content += `- [${file.fileName}](${markdownRelativePath}) (${file.summary.total} tests)\n`;
      }
      content += '\n';
    }

    content += '\n---\n';
    content += '*Generator: markdown-docs.ts*\n';
    return content;
  }

  /**
   * Get test type emoji for display
   */
  private getTestTypeEmoji(testType: TestType): string {
    switch (testType) {
    case 'regular': return '✅';
    case 'skipped': return '⏭️';
    case 'todo': return '📝';
    case 'each': return '🔄';
    case 'only': return '🎯';
    case 'concurrent': return '⚡';
    case 'benchmark': return '📊';
    case 'marked': return '🏷️';
    case 'parametrize': return '🔢';
    default: return '❓';
    }
  }

  /**
   * Escape markdown special characters
   */
  private escapeMarkdown(text: string): string {
    return text
      .replace(/\|/g, '\\|')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
