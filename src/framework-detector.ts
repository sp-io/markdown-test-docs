import path from 'path';
import { TestFramework } from './types';

export class FrameworkDetector {
  /**
   * Detect test framework based on file extension and content
   */
  static detectFramework(filePath: string, content?: string): TestFramework {
    const ext = path.extname(filePath);
    const basename = path.basename(filePath);
    
    // Python files
    if (ext === '.py' && (basename.startsWith('test_') || basename.endsWith('_test.py'))) {
      return 'pytest';
    }
    
    // TypeScript/JavaScript files
    if ((ext === '.ts' || ext === '.js') && (basename.includes('.test.') || basename.includes('.spec.'))) {
      if (content) {
        // Check for Vitest imports/usage
        if (content.includes('from \'vitest\'') || content.includes('import { bench }') || content.includes('bench(')) {
          return 'vitest';
        }
        // Default to Jest for TS/JS test files
        return 'jest';
      }
      return 'jest'; // Default for TS/JS
    }
    
    return 'auto';
  }
  
  /**
   * Check if file is a test file based on naming conventions
   */
  static isTestFile(filePath: string): boolean {
    const basename = path.basename(filePath);
    const ext = path.extname(filePath);
    
    // Python test files
    if (ext === '.py') {
      return basename.startsWith('test_') || basename.endsWith('_test.py');
    }
    
    // TypeScript/JavaScript test files
    if (ext === '.ts' || ext === '.js') {
      return basename.includes('.test.') || basename.includes('.spec.');
    }
    
    return false;
  }
  
  /**
   * Get file extensions for a specific framework
   */
  static getFrameworkExtensions(framework: TestFramework): string[] {
    switch (framework) {
    case 'pytest':
      return ['.py'];
    case 'jest':
    case 'vitest':
      return ['.ts', '.js'];
    case 'auto':
      return ['.py', '.ts', '.js'];
    default:
      return ['.ts', '.js'];
    }
  }
}
