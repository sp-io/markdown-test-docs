/**
 * GitHub Action entry point
 * This file handles the GitHub Action integration and input parsing
 */

import * as core from '@actions/core';
import MarkdownDocsGenerator from './markdown-docs.js';

async function run(): Promise<void> {
  try {
    // Get inputs from the action
    const sourceInput = core.getInput('source');
    const outputInput = core.getInput('output');
    const githubUrlInput = core.getInput('github-url');
    const githubBranchInput = core.getInput('github-branch');
    const repositoryRootInput = core.getInput('repository-root');
    const verboseInput = core.getInput('verbose');

    // Helper function to convert empty strings to undefined
    const normalizeInput = (input: string): string | undefined => {
      return input && input.trim().length > 0 ? input.trim() : undefined;
    };

    // Normalize inputs
    const sourceDir = normalizeInput(sourceInput);
    const outputDir = normalizeInput(outputInput);
    const githubUrl = normalizeInput(githubUrlInput);
    const githubBranch = normalizeInput(githubBranchInput);
    const repositoryRoot = normalizeInput(repositoryRootInput);
    const verbose = verboseInput === 'true';

    console.log('📝 GitHub Action: Markdown Test Documentation Generator');
    console.log('📋 Raw inputs received:');
    console.log(`   source: "${sourceInput}"`);
    console.log(`   output: "${outputInput}"`);
    console.log(`   github-url: "${githubUrlInput}"`);
    console.log(`   github-branch: "${githubBranchInput}"`);
    console.log(`   repository-root: "${repositoryRootInput}"`);
    console.log(`   verbose: "${verboseInput}"`);
    console.log('');
    
    console.log('🔧 Processed inputs:');
    console.log(`📂 Source directory: ${sourceDir || 'default (./src/test)'}`);
    console.log(`📁 Output directory: ${outputDir || 'default (./doc/tests)'}`);
    console.log(`🏠 Repository root: ${repositoryRoot || 'default (current directory)'}`);
    
    if (githubUrl) {
      console.log(`🔗 GitHub URL: ${githubUrl}`);
      console.log(`🌿 GitHub branch: ${githubBranch || 'main'}`);
    } else {
      console.log('📄 Using local file links (no GitHub URL provided)');
    }

    if (verbose) {
      console.log('🔍 Verbose mode enabled');
    }
    console.log('');

    // Create and run the generator
    const generator = new MarkdownDocsGenerator({
      sourceDir,
      outputDir,
      githubUrl,
      githubBranch,
      repositoryRoot,
      verbose
    });

    await generator.generate();

    // Set outputs
    core.setOutput('success', 'true');
    core.setOutput('output-dir', outputDir || './doc/tests');
    core.setOutput('github-enabled', githubUrl ? 'true' : 'false');

    console.log('✅ Action completed successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Action failed:', errorMessage);
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    core.setFailed(errorMessage);
  }
}

// Run the action
run();
