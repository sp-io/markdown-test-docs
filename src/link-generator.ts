import path from 'path';

export class LinkGenerator {
  constructor(
    private githubUrl: string | null,
    private githubBranch: string,
    private repositoryRoot: string
  ) {}

  /**
   * Generate a link to the specific test in the file
   */
  generateTestLink(filePath: string, lineNumber: number, describeName: string, testName: string): string {
    // Calculate path relative to repository root
    const repoRelativePath = path.relative(this.repositoryRoot, filePath);
    
    if (this.githubUrl) {
      // Normalize GitHub URL (remove trailing slash)
      const normalizedGithubUrl = this.githubUrl.replace(/\/$/, '');
      // Create GitHub blob URL
      const githubPath = repoRelativePath.replace(/\\/g, '/'); // Convert Windows paths to forward slashes
      return `${normalizedGithubUrl}/blob/${this.githubBranch}/${githubPath}#L${lineNumber}`;
    } else {
      // Fallback to relative path from repository root
      return `${repoRelativePath.replace(/\\/g, '/')}#L${lineNumber}`;
    }
  }

  /**
   * Convert test file path to markdown path while preserving directory structure
   */
  getMarkdownPath(relativePath: string): string {
    let markdownRelativePath = relativePath;
    if (markdownRelativePath.endsWith('.test.ts')) {
      markdownRelativePath = markdownRelativePath.replace(/\.test\.ts$/, '.md');
    } else if (markdownRelativePath.endsWith('.spec.ts')) {
      markdownRelativePath = markdownRelativePath.replace(/\.spec\.ts$/, '.md');
    } else if (markdownRelativePath.endsWith('.py')) {
      // Handle all Python test files: convert .py extension to .md
      // This fixes the issue with files in subfolders not getting .md extension
      markdownRelativePath = markdownRelativePath.replace(/\.py$/, '.md');
    }
    return markdownRelativePath;
  }

  /**
   * Get category name from file path
   */
  getCategoryFromPath(relativePath: string): string {
    const dir = path.dirname(relativePath);
    return dir.charAt(0).toUpperCase() + dir.slice(1);
  }
}
