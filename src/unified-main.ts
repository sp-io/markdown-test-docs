import * as core from '@actions/core';
import MarkdownDocsGenerator from './markdown-docs'; // TypeScript/Jest generator

interface ActionInputs {
  source: string;
  output: string;
  githubUrl: string;
  githubBranch: string;
  repositoryRoot: string;
  verbose: boolean;
}

function getActionInputs(): ActionInputs {
  const source = core.getInput('source').trim();
  const output = core.getInput('output').trim();
  const githubUrl = core.getInput('github-url').trim();
  const githubBranch = core.getInput('github-branch').trim() || 'main';
  const repositoryRoot = core.getInput('repository-root').trim();
  const verbose = core.getInput('verbose').toLowerCase() === 'true';

  return {
    source,
    output,
    githubUrl,
    githubBranch,
    repositoryRoot,
    verbose
  };
}

async function runGenerator(inputs: ActionInputs): Promise<{ totalFiles: number; totalTests: number }> {
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

async function main(): Promise<void> {
  try {
    console.log('📚 Test Documentation Generator');
    
    const inputs = getActionInputs();
    
    console.log('📋 Raw inputs received:');
    Object.entries(inputs).forEach(([key, value]) => {
      console.log(`   ${key}: "${value}"`);
    });

    // Set default source directory
    if (!inputs.source) {
      inputs.source = './src/test';
      console.log(`📂 Using default source directory: ${inputs.source}`);
    }

    // Set default output directory
    if (!inputs.output) {
      inputs.output = './doc/tests';
      console.log(`📁 Using default output directory: ${inputs.output}`);
    }

    console.log('\n🚀 Running TypeScript/Jest/Vitest documentation generator...');

    const stats = await runGenerator(inputs);

    // Set outputs
    core.setOutput('success', 'true');
    core.setOutput('output-dir', inputs.output);
    core.setOutput('framework-detected', 'typescript');
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