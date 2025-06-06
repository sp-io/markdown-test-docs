/**
 * GitHub Action entry point
 * This file handles the GitHub Action integration and input parsing
 */

import * as core from '@actions/core';
import MarkdownDocsGenerator from './markdown-docs.js';

async function run(): Promise<void> {
  try {
    // Get inputs from the action
    const sourceDir = core.getInput('source') || './src';
    const outputDir = core.getInput('output') || './doc-tests';
    const githubUrl = core.getInput('github-url') || '';
    const githubBranch = core.getInput('github-branch') || 'main';
    const repositoryRoot = core.getInput('repository-root') || './';
    const verbose = core.getInput('verbose') === 'true';

    console.log('📝 GitHub Action: Markdown Test Documentation Generator');
    console.log(`📂 Source directory: ${sourceDir}`);
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`🏠 Repository root: ${repositoryRoot}`);
    
    if (githubUrl) {
      console.log(`🔗 GitHub URL: ${githubUrl}`);
      console.log(`🌿 GitHub branch: ${githubBranch}`);
    } else {
      console.log('📄 Using local file links (no GitHub URL provided)');
    }

    if (verbose) {
      console.log('🔍 Verbose mode enabled');
    }

    // Create and run the generator
    const generator = new MarkdownDocsGenerator({
      sourceDir,
      outputDir,
      githubUrl: githubUrl || undefined,
      githubBranch,
      repositoryRoot,
      verbose
    });

    await generator.generate();

    // Set outputs
    core.setOutput('success', 'true');
    core.setOutput('output-dir', outputDir);
    core.setOutput('github-enabled', githubUrl ? 'true' : 'false');

    console.log('✅ Action completed successfully');
  } catch (error) {
    console.error('❌ Action failed:', error);
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

// Run the action
run();
