#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

// Debug script to analyze why a specific test file isn't generating documentation

function debugTestFile(filePath: string): void {
  console.log(`🔍 Debugging test file: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  console.log(`📄 File has ${lines.length} lines`);
  console.log(`📄 First 10 lines preview:`);
  lines.slice(0, 10).forEach((line, i) => {
    console.log(`   ${i + 1}: ${line}`);
  });
  
  // Check for describe blocks
  const describePattern = /describe\s*\(\s*['"`]([^'"`]+)['"`]/;
  const testPattern = /(?:it|test)(?:\.each\([^)]*\))?\s*\(\s*['"`]([^'"`]+)['"`]/;
  
  let describeCount = 0;
  let testCount = 0;
  let foundDescribes: Array<{line: number, name: string}> = [];
  let foundTests: Array<{line: number, name: string}> = [];
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    
    // Check for describe blocks
    const describeMatch = trimmed.match(describePattern);
    if (describeMatch) {
      describeCount++;
      foundDescribes.push({line: lineNumber, name: describeMatch[1]});
      console.log(`✅ Found describe at line ${lineNumber}: "${describeMatch[1]}"`);
    }
    
    // Check for test blocks
    const testMatch = trimmed.match(testPattern);
    if (testMatch) {
      testCount++;
      foundTests.push({line: lineNumber, name: testMatch[1]});
      console.log(`✅ Found test at line ${lineNumber}: "${testMatch[1]}"`);
    }
    
    // Log any line that looks like it might be a test but doesn't match
    if (trimmed.includes('describe(') && !describeMatch) {
      console.log(`⚠️  Line ${lineNumber} contains 'describe(' but doesn't match pattern: ${trimmed}`);
    }
    if ((trimmed.includes('it(') || trimmed.includes('test(')) && !testMatch) {
      console.log(`⚠️  Line ${lineNumber} contains 'it(' or 'test(' but doesn't match pattern: ${trimmed}`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Describe blocks found: ${describeCount}`);
  console.log(`   Test blocks found: ${testCount}`);
  
  if (describeCount === 0) {
    console.log(`❌ No describe blocks found. File needs at least one describe block.`);
  }
  
  if (testCount === 0) {
    console.log(`❌ No test blocks found. File needs it() or test() blocks inside describe blocks.`);
  }
  
  if (describeCount > 0 && testCount > 0) {
    console.log(`✅ File structure looks correct - should generate documentation.`);
    
    // Simulate the extraction logic
    console.log(`\n🔄 Simulating extraction logic...`);
    const tests = extractTestsDebug(content);
    console.log(`   Extracted ${tests.length} tests`);
    
    if (tests.length === 0) {
      console.log(`❌ Extraction logic failed - tests are not properly nested or have syntax issues.`);
    }
  }
}

// Simplified version of the extraction logic with debug output
function extractTestsDebug(content: string): Array<{name: string, line: number}> {
  const tests: Array<{name: string, line: number}> = [];
  const lines = content.split('\n');
  
  let currentDescribe: {name: string, lineNumber: number, level: number} | null = null;
  let braceLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNumber = i + 1;

    // Track brace levels
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceLevel += openBraces - closeBraces;

    // Extract describe blocks
    const describeMatch = line.match(/describe\s*\(\s*['"`]([^'"`]+)['"`]/);
    if (describeMatch) {
      currentDescribe = {
        name: describeMatch[1],
        lineNumber,
        level: braceLevel
      };
      console.log(`   📝 Set current describe: "${currentDescribe.name}" at level ${braceLevel}`);
      continue;
    }

    // Extract test cases
    const testMatch = line.match(/(?:it|test)(?:\.each\([^)]*\))?\s*\(\s*['"`]([^'"`]+)['"`]/);
    if (testMatch && currentDescribe) {
      const testName = testMatch[1];
      const fullTestName = `${currentDescribe.name} > ${testName}`;
      
      tests.push({
        name: fullTestName,
        line: lineNumber
      });
      
      console.log(`   ✅ Extracted test: "${fullTestName}" at line ${lineNumber}`);
    } else if (testMatch && !currentDescribe) {
      console.log(`   ⚠️  Found test "${testMatch[1]}" at line ${lineNumber} but no current describe block`);
    }

    // Reset scope when leaving blocks
    if (currentDescribe && braceLevel < currentDescribe.level) {
      console.log(`   📝 Left describe block "${currentDescribe.name}" (brace level: ${braceLevel})`);
      currentDescribe = null;
    }
  }

  return tests;
}

// Usage
const filePath = process.argv[2];
if (!filePath) {
  console.log('Usage: tsx debug-test-extraction.ts <path-to-test-file>');
  console.log('Example: tsx debug-test-extraction.ts ./src/test/02_requestTokens.spec.ts');
  process.exit(1);
}

debugTestFile(path.resolve(filePath));
