import * as core from '@actions/core';
import * as github from '@actions/github';
import fs from 'fs';
import path from 'path';
import MarkdownDocsGenerator from './markdown-docs.js'; // TypeScript/Jest generator
import PytestMarkdownGenerator from './pytest-markdown-generator.js'; // Python/pytest generator

interface ActionInputs {
  source: string;
  output: string;
  githubUrl: string;
  githubBranch: string;
  repositoryRoot: string;
  verbose: boolean;
  testFramework: 'jest' | 'pytest' | 'auto';
}

type TestFramework = 'jest' | 'pytest';

interface FrameworkDetectionResult {
  framework: TestFramework;
  confidence: number;
  reasons: string[];
}

function getActionInputs(): ActionInputs {
  const source = core.getInput('source').trim();
  const output = core.getInput('output').trim();
  const githubUrl = core.getInput('github-url').trim();
  const githubBranch = core.getInput('github-branch').trim() || 'main';
  const repositoryRoot = core.getInput('repository-root').trim();
  const verbose = core.getInput('verbose').toLowerCase() === 'true';
  const testFramework = (core.getInput('test-framework').trim() || 'auto') as 'jest' | 'pytest' | 'auto';

  return {
    source,
    output,
    githubUrl,
    githubBranch,
    repositoryRoot,
    verbose,
    testFramework
  };
}

function detectTestFramework(sourceDir?: string): FrameworkDetectionResult {
  const searchDirs = [
    sourceDir,
    'tests',
    'test',
    'src/test',
    'src/tests',
    '__tests__',
    'spec'
  ].filter(Boolean).map(dir => path.resolve(dir || '.'));

  let jestScore = 0;
  let pytestScore = 0;
  const reasons: string[] = [];

  // Check for framework-specific files
  const rootFiles = fs.existsSync('.') ? fs.readdirSync('.') : [];
  
  // Jest indicators
  if (rootFiles.includes('jest.config.js') || rootFiles.includes('jest.config.ts')) {
    jestScore += 3;
    reasons.push('Found Jest config file');
  }
  if (rootFiles.includes('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (packageJson.devDependencies?.jest || packageJson.dependencies?.jest) {
        jestScore += 2;
        reasons.push('Jest dependency in package.json');
      }
      if (packageJson.scripts?.test?.includes('jest')) {
        jestScore += 1;
        reasons.push('Jest in test script');
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  // Pytest indicators
  if (rootFiles.includes('pytest.ini') || rootFiles.includes('pyproject.toml') || rootFiles.includes('setup.cfg')) {
    pytestScore += 3;
    reasons.push('Found pytest config file');
  }
  if (rootFiles.includes('requirements.txt') || rootFiles.includes('requirements-dev.txt')) {
    try {
      const reqFiles = ['requirements.txt', 'requirements-dev.txt'];
      for (const reqFile of reqFiles) {
        if (fs.existsSync(reqFile)) {
          const content = fs.readFileSync(reqFile, 'utf8');
          if (content.includes('pytest')) {
            pytestScore += 2;
            reasons.push(`pytest in ${reqFile}`);
          }
        }
      }
    } catch (e) {
      // Ignore file read errors
    }
  }

  // Check test file patterns in directories
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;

    try {
      const files = fs.readdirSync(dir, { recursive: true }) as string[];
      
      // TypeScript/Jest patterns
      const jestFiles = files.filter(file => 
        (file.endsWith('.test.ts') || file.endsWith('.spec.ts')) && 
        typeof file === 'string'
      );
      
      // Python/pytest patterns  
      const pytestFiles = files.filter(file => 
        typeof file === 'string' && file.endsWith('.py') && 
        (file.startsWith('test_') || file.endsWith('_test.py'))
      );

      if (jestFiles.length > 0) {
        jestScore += jestFiles.length * 0.5;
        reasons.push(`Found ${jestFiles.length} TypeScript test files`);
      }

      if (pytestFiles.length > 0) {
        pytestScore += pytestFiles.length * 0.5;
        reasons.push(`Found ${pytestFiles.length} Python test files`);
      }
    } catch (e) {
      // Ignore directory read errors
    }
  }

  // Determine winner
  const framework: TestFramework = jestScore > pytestScore ? 'jest' : 'pytest';
  const confidence = Math.max(jestScore, pytestScore) / (jestScore + pytestScore + 1) * 100;

  return { framework, confidence, reasons };
}

async function runJestGenerator(inputs: ActionInputs): Promise<{ totalFiles: number; totalTests: number }> {
  const generator = new MarkdownDocsGenerator({
    sourceDir: inputs.source || undefined,
    outputDir: inputs.output || undefined,
    githubUrl: inputs.githubUrl || undefined,
    githubBranch: inputs.githubBranch,
    repositoryRoot: inputs.repositoryRoot || undefined,
    verbose: inputs.verbose
  });

  await generator.generate();
  
  // Extract stats (you'll need to modify the original generator to return these)
  return { totalFiles: 0, totalTests: 0 }; // Placeholder - implement stats collection
}

async function runPytestGenerator(inputs: ActionInputs): Promise<{ totalFiles: number; totalTests: number }> {
  const generator = new PytestMarkdownGenerator({
    sourceDir: inputs.source || undefined,
    outputDir: inputs.output || undefined,
    githubUrl: inputs.githubUrl || undefined,
    githubBranch: inputs.githubBranch,
    repositoryRoot: inputs.repositoryRoot || undefined,
    verbose: inputs.verbose
  });

  await generator.generate();
  
  // Extract stats (you'll need to modify the pytest generator to return these)
  return { totalFiles: 0, totalTests: 0 }; // Placeholder - implement stats collection
}

async function main(): Promise<void> {
  try {
    console.log('📚 Unified Test Documentation Generator');
    
    const inputs = getActionInputs();
    
    console.log('📋 Raw inputs received:');
    Object.entries(inputs).forEach(([key, value]) => {
      console.log(`   ${key}: "${value}"`);
    });

    let framework: TestFramework;
    
    if (inputs.testFramework === 'auto') {
      const detection = detectTestFramework(inputs.source);
      framework = detection.framework;
      
      console.log(`🔍 Auto-detected framework: ${framework} (confidence: ${detection.confidence.toFixed(1)}%)`);
      if (inputs.verbose) {
        console.log('   Detection reasons:');
        detection.reasons.forEach(reason => console.log(`   - ${reason}`));
      }
    } else {
      framework = inputs.testFramework;
      console.log(`⚙️  Using specified framework: ${framework}`);
    }

    // Set default source directories based on framework
    if (!inputs.source) {
      inputs.source = framework === 'jest' ? './src/test' : './tests';
      console.log(`📂 Using default source directory: ${inputs.source}`);
    }

    // Set default output directories based on framework
    if (!inputs.output) {
      inputs.output = framework === 'jest' ? './doc/tests' : './docs/tests';
      console.log(`📁 Using default output directory: ${inputs.output}`);
    }

    // Add GitHub context if not provided
    if (!inputs.githubUrl && github.context.payload.repository) {
      inputs.githubUrl = github.context.payload.repository.html_url;
      console.log(`🔗 Using repository URL: ${inputs.githubUrl}`);
    }

    console.log(`\n🚀 Running ${framework} documentation generator...`);

    let stats: { totalFiles: number; totalTests: number };
    
    if (framework === 'jest') {
      stats = await runJestGenerator(inputs);
    } else {
      stats = await runPytestGenerator(inputs);
    }

    // Set outputs
    core.setOutput('success', 'true');
    core.setOutput('output-dir', inputs.output);
    core.setOutput('framework-detected', framework);
    core.setOutput('total-files', stats.totalFiles.toString());
    core.setOutput('total-tests', stats.totalTests.toString());

    console.log('✅ Action completed successfully');
    console.log(`📊 Generated documentation for ${stats.totalFiles} files with ${stats.totalTests} tests`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Action failed:', errorMessage);
    
    // Set failure outputs
    core.setOutput('success', 'false');
    core.setOutput('framework-detected', 'unknown');
    core.setOutput('total-files', '0');
    core.setOutput('total-tests', '0');
    
    core.setFailed(errorMessage);
  }
}

// Run the action
main();