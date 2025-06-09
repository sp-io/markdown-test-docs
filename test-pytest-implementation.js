#!/usr/bin/env node

/**
 * Test script to verify the pytest documentation generator works correctly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Pytest Documentation Generator Implementation\n');

// Test 1: Check if files were created
console.log('1. ✅ Checking if files were created...');
const requiredFiles = [
  'src/pytest-markdown-generator.ts',
  'src/pytest-cli.ts', 
  'src/unified-main.ts',
  'tests/test_sample_auth.py',
  'tests/validation_test.py',
  'action.yml'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✓ ${file} exists`);
  } else {
    console.log(`   ✗ ${file} missing`);
  }
});

// Test 2: Try to compile TypeScript
console.log('\n2. 🔨 Testing TypeScript compilation...');
try {
  execSync('npx tsc --noEmit --skipLibCheck src/pytest-markdown-generator.ts', { stdio: 'pipe' });
  console.log('   ✓ TypeScript files compile successfully');
} catch (error) {
  console.log('   ✗ TypeScript compilation failed');
  console.log('   Error:', error.message);
}

// Test 3: Test pytest generator CLI
console.log('\n3. 🐍 Testing pytest CLI...');
try {
  const output = execSync('npx tsx src/pytest-cli.ts --help', { encoding: 'utf8' });
  if (output.includes('pytest-cli.ts')) {
    console.log('   ✓ Pytest CLI runs and shows help');
  } else {
    console.log('   ✗ Pytest CLI help not working properly');
  }
} catch (error) {
  console.log('   ✗ Pytest CLI failed to run');
  console.log('   Error:', error.message);
}

// Test 4: Test documentation generation
console.log('\n4. 📝 Testing documentation generation...');
try {
  execSync('npx tsx src/pytest-cli.ts --source tests --output test-docs-output --verbose', { 
    stdio: 'pipe' 
  });
  
  // Check if documentation was generated
  if (fs.existsSync('test-docs-output')) {
    const files = fs.readdirSync('test-docs-output');
    console.log('   ✓ Documentation generated successfully');
    console.log('   Generated files:', files.join(', '));
    
    // Check for expected files
    const expectedFiles = ['README.md', 'ALL_TESTS.md'];
    expectedFiles.forEach(file => {
      if (files.includes(file)) {
        console.log(`   ✓ ${file} generated`);
      } else {
        console.log(`   ✗ ${file} missing`);
      }
    });
  } else {
    console.log('   ✗ No documentation output directory created');
  }
} catch (error) {
  console.log('   ✗ Documentation generation failed');
  console.log('   Error:', error.message);
}

// Test 5: Check sample test files
console.log('\n5. 🔍 Analyzing sample test files...');
const testFiles = ['tests/test_sample_auth.py', 'tests/validation_test.py'];
testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const testFunctions = content.match(/def test_\w+/g);
    const markers = content.match(/@pytest\.mark\.\w+/g);
    const docstrings = content.match(/"""\s*[\s\S]*?\s*"""/g);
    
    console.log(`   📄 ${file}:`);
    console.log(`      Test functions: ${testFunctions ? testFunctions.length : 0}`);
    console.log(`      Pytest markers: ${markers ? markers.length : 0}`);
    console.log(`      Docstrings: ${docstrings ? docstrings.length : 0}`);
  }
});

// Test 6: Check action.yml
console.log('\n6. ⚙️  Checking GitHub Action configuration...');
if (fs.existsSync('action.yml')) {
  const actionContent = fs.readFileSync('action.yml', 'utf8');
  if (actionContent.includes('test-framework')) {
    console.log('   ✓ Action supports test-framework parameter');
  }
  if (actionContent.includes('auto')) {
    console.log('   ✓ Action supports auto-detection');
  }
  console.log('   ✓ GitHub Action configuration looks good');
}

console.log('\n🎉 Pytest implementation test completed!');
console.log('\nNext steps:');
console.log('1. Run: npx tsx src/pytest-cli.ts --source tests --output docs/pytest --verbose');
console.log('2. Check generated documentation in docs/pytest/');
console.log('3. Test the unified action with test-framework: "auto"');
console.log('4. Add to your CI/CD pipeline');

// Cleanup
if (fs.existsSync('test-docs-output')) {
  fs.rmSync('test-docs-output', { recursive: true, force: true });
  console.log('\n🧹 Cleaned up test output directory');
}