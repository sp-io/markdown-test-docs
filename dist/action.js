"use strict";
/**
 * GitHub Action entry point
 * This file handles the GitHub Action integration and input parsing
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const index_1 = require("./index");
async function run() {
    try {
        // Get inputs from the action
        const sourceDir = core.getInput('source') || './src';
        const outputDir = core.getInput('output') || './doc-tests';
        const githubUrl = core.getInput('github-url') || '';
        const githubBranch = core.getInput('github-branch') || 'main';
        const repositoryRoot = core.getInput('repository-root') || './';
        console.log('📝 GitHub Action: Markdown Test Documentation Generator');
        console.log(`📂 Source directory: ${sourceDir}`);
        console.log(`📁 Output directory: ${outputDir}`);
        console.log(`🏠 Repository root: ${repositoryRoot}`);
        if (githubUrl) {
            console.log(`🔗 GitHub URL: ${githubUrl}`);
            console.log(`🌿 GitHub branch: ${githubBranch}`);
        }
        else {
            console.log('📄 Using local file links (no GitHub URL provided)');
        }
        // Create and run the generator
        const generator = new index_1.MarkdownDocsGenerator({
            sourceDir,
            outputDir,
            githubUrl: githubUrl || undefined,
            githubBranch,
            repositoryRoot
        });
        await generator.generate();
        // Set outputs
        core.setOutput('success', 'true');
        core.setOutput('output-dir', outputDir);
        core.setOutput('github-enabled', githubUrl ? 'true' : 'false');
        console.log('✅ Action completed successfully');
    }
    catch (error) {
        console.error('❌ Action failed:', error);
        core.setFailed(error instanceof Error ? error.message : String(error));
    }
}
// Run the action
run();
