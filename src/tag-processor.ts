import { TestDescription } from './types';

export class TagProcessor {
  private readonly knownTags: Set<string>;

  constructor(verbose: boolean = false) {
    this.knownTags = new Set(['given', 'when', 'then', 'and', 'group', 'category']);
  }

  /**
   * Extract tags from test name and description
   */
  extractTags(describeName: string, description: string): string[] {
    const tags: string[] = [];
    
    // Extract tags from describe name (e.g., [@slow][@proving])
    const describeTagMatches = describeName.match(/\[@([^\]]+)\]/g);
    if (describeTagMatches) {
      tags.push(...describeTagMatches.map(tag => tag.slice(2, -1)));
    }

    // Extract additional context tags
    if (description.toLowerCase().includes('failure') || description.toLowerCase().includes('error')) {
      tags.push('error-case');
    }
    if (description.toLowerCase().includes('should not') || description.toLowerCase().includes('should fail')) {
      tags.push('negative-test');
    }

    return tags;
  }

  /**
   * Extract inline tags from test names (e.g., @smoke, @healthcheck)
   */
  extractInlineTags(testName: string): string[] {
    const tagMatches = testName.match(/@(\w+)/g);
    return tagMatches ? tagMatches.map(tag => tag.slice(1)) : [];
  }

  /**
   * Parse test description from TSDoc comments
   */
  parseTestDescription(commentLines: string[], verbose: boolean = false): string {
    if (commentLines.length === 0) {
      return '';
    }

    const sections: TestDescription = {
      description: [],
      given: '',
      when: '',
      then: '',
      and: []
    };
    
    let currentSection: keyof TestDescription = 'description';
    let currentText = '';

    for (const line of commentLines) {
      if (line.startsWith('@given')) {
        // Save previous section
        if (currentText.trim()) {
          this.saveSectionText(sections, currentSection, currentText.trim());
        }
        currentSection = 'given';
        currentText = line.replace('@given', '').trim();
      } else if (line.startsWith('@when')) {
        // Save previous section
        if (currentText.trim()) {
          this.saveSectionText(sections, currentSection, currentText.trim());
        }
        currentSection = 'when';
        currentText = line.replace('@when', '').trim();
      } else if (line.startsWith('@then')) {
        // Save previous section
        if (currentText.trim()) {
          this.saveSectionText(sections, currentSection, currentText.trim());
        }
        currentSection = 'then';
        currentText = line.replace('@then', '').trim();
      } else if (line.startsWith('@and')) {
        // Save previous section
        if (currentText.trim()) {
          this.saveSectionText(sections, currentSection, currentText.trim());
        }
        currentSection = 'and';
        currentText = line.replace('@and', '').trim();
      } else if (line.startsWith('@')) {
        // Check for unknown tags and log if verbose mode is enabled
        const tagMatch = line.match(/^@(\w+)/);
        if (tagMatch) {
          const tag = tagMatch[1];
          if (!this.knownTags.has(tag) && verbose) {
            console.log(`⚠️  Unknown tag found: @${tag} (line: "${line.trim()}")`);
          }
        }
        // Skip unknown JSDoc tags
        continue;
      } else {
        // Continue building current section
        if (currentText) {
          currentText += ' ' + line;
        } else {
          currentText = line;
        }
      }
    }

    // Save the last section
    if (currentText.trim()) {
      this.saveSectionText(sections, currentSection, currentText.trim());
    }

    // Build formatted description
    const formattedParts: string[] = [];
    
    // Add main description if available
    if (sections.description.length > 0) {
      formattedParts.push(`**${sections.description.join(' ')}**`);
    }
    
    // Add Given/When/Then sections
    if (sections.given) {
      formattedParts.push(`**Given:** ${sections.given}`);
    }
    if (sections.when) {
      formattedParts.push(`**When:** ${sections.when}`);
    }
    if (sections.then) {
      formattedParts.push(`**Then:** ${sections.then}`);
    }
    
    // Add And sections
    if (sections.and.length > 0) {
      sections.and.forEach(andClause => {
        formattedParts.push(`**And:** ${andClause}`);
      });
    }

    return formattedParts.join('<br>');
  }

  /**
   * Helper method to save section text to the appropriate section
   */
  private saveSectionText(sections: TestDescription, currentSection: keyof TestDescription, text: string): void {
    if (currentSection === 'description') {
      sections.description.push(text);
    } else if (currentSection === 'and') {
      sections.and.push(text);
    } else {
      sections[currentSection] = text;
    }
  }
}
