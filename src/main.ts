/**
 * GitHub Action entry point for the Markdown Test Documentation Generator
 * This file handles the GitHub Action integration and uses the main generator
 */

import * as core from '@actions/core';
import MarkdownDocsGenerator from './markdown-docs.js';

/**
 * Main action function
 */
async function run(): Promise<void> {
  try {
    // Get inputs from the action
    const source = core.getInput('source');
    const output = core.getInput('output');
    const githubUrl = core.getInput('github-url');
    const githubBranch = core.getInput('github-branch');
    const repositoryRoot = core.getInput('repository-root');
    const verbose = core.getInput('verbose') === 'true';

    console.log('🚀 Starting Markdown Test Documentation Generator...');
    console.log(`Source: ${source}`);
    console.log(`Output: ${output}`);
    console.log(`GitHub URL: ${githubUrl}`);
    console.log(`GitHub Branch: ${githubBranch}`);
    console.log(`Repository Root: ${repositoryRoot}`);
    console.log(`Verbose: ${verbose}`);

    // Create generator instance
    const generator = new MarkdownDocsGenerator({
      sourceDir: source || undefined,
      outputDir: output || undefined,
      githubUrl: githubUrl || undefined,
      githubBranch: githubBranch || undefined,
      repositoryRoot: repositoryRoot || undefined,
      verbose
    });

    // Generate documentation
    await generator.generate();

    console.log('✅ Documentation generation completed successfully!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error during documentation generation:', errorMessage);
    core.setFailed(errorMessage);
  }
}

// Run the action
run();
