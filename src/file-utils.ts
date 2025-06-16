import fs from 'fs';
import path from 'path';

export class FileUtils {
  constructor(private verbose: boolean = false) {}

  /**
   * Ensure a directory exists, creating it if necessary
   */
  ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      if (this.verbose) {
        console.log(`📁 Created directory: ${dirPath}`);
      }
    }
  }

  /**
   * Recursively find all test files in a directory
   */
  findTestFiles(sourceDir: string): string[] {
    const testFiles: string[] = [];
    
    console.log(`🔍 Looking for test files in: ${sourceDir}`);
    
    // Check if directory exists
    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Source directory does not exist: ${sourceDir}`);
    }

    const findTestFilesRecursive = (dir: string): void => {
      if (this.verbose) {
        console.log(`   Scanning directory: ${dir}`);
      }
      
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          findTestFilesRecursive(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.spec.ts'))) {
          testFiles.push(fullPath);
          if (this.verbose) {
            console.log(`   Found test file: ${fullPath}`);
          }
        }
      }
    };

    findTestFilesRecursive(sourceDir);
    console.log(`🔍 Found ${testFiles.length} test files`);
    
    return testFiles;
  }

  /**
   * Read file content as string
   */
  readFileContent(filePath: string): string {
    return fs.readFileSync(filePath, 'utf8');
  }

  /**
   * Write content to file
   */
  writeFile(filePath: string, content: string): void {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    this.ensureDirectory(dir);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`📝 Generated: ${filePath}`);
  }

  /**
   * Get file name without extension from file path
   */
  getFileNameWithoutExtension(filePath: string): string {
    let fileName = path.basename(filePath);
    if (fileName.endsWith('.test.ts')) {
      fileName = fileName.replace('.test.ts', '');
    } else if (fileName.endsWith('.spec.ts')) {
      fileName = fileName.replace('.spec.ts', '');
    }
    return fileName;
  }

  /**
   * Helper function to check if a string is non-empty
   */
  isNonEmptyString(str: string | undefined): str is string {
    return typeof str === 'string' && str.trim().length > 0;
  }
}
