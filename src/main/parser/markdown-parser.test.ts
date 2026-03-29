// src/main/parser/markdown-parser.test.ts
import { describe, it, expect } from 'vitest';
import {
  extractWikiLinks,
  extractCategoryMention,
  stripMarkdownForSearch,
} from './markdown-parser';

// ─── extractWikiLinks ────────────────────────────────────────────────────────
// Rules: RN-020 (syntax [[Title]]), RN-023 (case-sensitive)

describe('extractWikiLinks', () => {
  it('should return empty array for body with no wiki links', () => {
    // Arrange
    const body = 'This is plain text with no references.';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual([]);
  });

  it('should extract a single wiki link title', () => {
    // Arrange
    const body = 'See [[Node.js]] for more details.';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual(['Node.js']);
  });

  it('should extract multiple wiki link titles from one body', () => {
    // Arrange
    const body = 'Combines [[Chromium]] and [[Node.js]] via [[IPC]].';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual(['Chromium', 'Node.js', 'IPC']);
  });

  it('should return empty array for empty body', () => {
    // Arrange
    const body = '';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle multi-word titles inside wiki links', () => {
    // Arrange
    const body = 'Read [[Como funciona o Electron]] first.';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual(['Como funciona o Electron']);
  });

  // RN-023: references are case-sensitive — [[note]] and [[Note]] are distinct tokens
  it('should preserve exact casing of the title (case-sensitive — RN-023)', () => {
    // Arrange
    const body = '[[minha nota]] and [[Minha Nota]] are different references.';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual(['minha nota', 'Minha Nota']);
  });

  it('should not treat incomplete brackets as wiki links', () => {
    // Arrange
    const body = '[single bracket] and [[unclosed';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual([]);
  });

  it('should ignore empty wiki link tokens [[]]', () => {
    // Arrange
    const body = 'Before [[]] after.';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle wiki link at the very start of the body', () => {
    // Arrange
    const body = '[[IPC]] is a key concept.';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual(['IPC']);
  });

  it('should handle wiki link at the very end of the body', () => {
    // Arrange
    const body = 'Key concept: [[IPC]]';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual(['IPC']);
  });

  it('should handle body with only whitespace', () => {
    // Arrange
    const body = '   \n\t  ';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual([]);
  });

  it('should extract duplicate link titles as separate entries', () => {
    // Arrange — same note referenced twice; deduplication is the service's responsibility
    const body = '[[Node.js]] is used here and again [[Node.js]] later.';

    // Act
    const result = extractWikiLinks(body);

    // Assert
    expect(result).toEqual(['Node.js', 'Node.js']);
  });
});

// ─── extractCategoryMention ──────────────────────────────────────────────────
// Rules: RN-032 (#name syntax in body text)

describe('extractCategoryMention', () => {
  it('should return null when body has no category mention', () => {
    // Arrange
    const body = 'Just plain text without any hash.';

    // Act
    const result = extractCategoryMention(body);

    // Assert
    expect(result).toBeNull();
  });

  it('should extract a simple category name from #tag syntax', () => {
    // Arrange
    const body = 'This note belongs to #electron category.';

    // Act
    const result = extractCategoryMention(body);

    // Assert
    expect(result).toBe('electron');
  });

  it('should extract category with hyphens in the name', () => {
    // Arrange
    const body = 'See #my-category for context.';

    // Act
    const result = extractCategoryMention(body);

    // Assert
    expect(result).toBe('my-category');
  });

  it('should return the first category mention when multiple exist', () => {
    // Arrange — parser returns first; service enforces one-category-per-note (RN-034)
    const body = '#estudos note with also #trabalho mentioned.';

    // Act
    const result = extractCategoryMention(body);

    // Assert
    expect(result).toBe('estudos');
  });

  it('should return null for empty body', () => {
    // Arrange
    const body = '';

    // Act
    const result = extractCategoryMention(body);

    // Assert
    expect(result).toBeNull();
  });

  it('should not confuse markdown headings (# followed by space) with category mentions', () => {
    // Arrange
    const body = '# Heading\n## Sub-heading\nSome text.';

    // Act
    const result = extractCategoryMention(body);

    // Assert
    expect(result).toBeNull();
  });

  it('should extract category when # appears inline mid-sentence', () => {
    // Arrange
    const body = 'This is a #dev note about Electron.';

    // Act
    const result = extractCategoryMention(body);

    // Assert
    expect(result).toBe('dev');
  });

  it('should handle body with only whitespace', () => {
    // Arrange
    const body = '   \n\t  ';

    // Act
    const result = extractCategoryMention(body);

    // Assert
    expect(result).toBeNull();
  });

  it('should extract category name with underscores', () => {
    // Arrange
    const body = 'Related to #open_source tooling.';

    // Act
    const result = extractCategoryMention(body);

    // Assert
    expect(result).toBe('open_source');
  });
});

// ─── stripMarkdownForSearch ──────────────────────────────────────────────────
// Rules: Data model §5.3 (body_text = markdown stripped, [[...]] and #... removed)

describe('stripMarkdownForSearch', () => {
  it('should return empty string for empty body', () => {
    // Arrange
    const body = '';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).toBe('');
  });

  it('should return plain text unchanged when body has no Markdown', () => {
    // Arrange
    const body = 'Just plain text with no formatting.';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).toBe('Just plain text with no formatting.');
  });

  it('should remove bold markers (**text**)', () => {
    // Arrange
    const body = 'This is **important** text.';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).not.toContain('**');
    expect(result).toContain('important');
  });

  it('should remove italic markers (_text_ and *text*)', () => {
    // Arrange
    const body = 'This is _italic_ and *also italic* text.';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).not.toContain('_italic_');
    expect(result).not.toContain('*also italic*');
    expect(result).toContain('italic');
  });

  it('should remove heading markers (# Heading)', () => {
    // Arrange
    const body = '# Main Heading\n## Sub Heading\nBody text.';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).not.toMatch(/^#+\s/m);
    expect(result).toContain('Main Heading');
    expect(result).toContain('Sub Heading');
  });

  it('should remove wiki link syntax [[Title]] and keep the title text', () => {
    // Arrange
    const body = 'See [[Node.js]] and [[IPC]] for details.';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).not.toContain('[[');
    expect(result).not.toContain(']]');
    expect(result).toContain('Node.js');
    expect(result).toContain('IPC');
  });

  it('should remove inline code backticks (`code`)', () => {
    // Arrange
    const body = 'Use `ipcRenderer.invoke` to call the main process.';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).not.toContain('`');
    expect(result).toContain('ipcRenderer.invoke');
  });

  it('should remove code block fences (```)', () => {
    // Arrange
    const body = 'Example:\n```typescript\nconst x = 1;\n```\nEnd.';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).not.toContain('```');
  });

  it('should remove category mention syntax #tag without removing the tag word', () => {
    // Arrange
    const body = 'This is a #dev note.';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).not.toMatch(/#\w/);
    expect(result).toContain('dev');
  });

  it('should not leave [[...]] tokens that cause false-positive search matches', () => {
    // Arrange
    const body = '[[React]] is used in [[NoteGraph]].';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result).not.toContain('[[');
    expect(result).not.toContain(']]');
  });

  it('should handle body with only whitespace', () => {
    // Arrange
    const body = '   \n\t  ';

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert
    expect(result.trim()).toBe('');
  });

  it('should handle complex note body with all syntax types', () => {
    // Arrange
    const body = [
      '# Electron Architecture',
      '',
      'O **Electron** combina _Chromium_ e `Node.js`.',
      'Veja também [[IPC]] e [[Main Process]].',
      '',
      'Esta nota é sobre #electron.',
    ].join('\n');

    // Act
    const result = stripMarkdownForSearch(body);

    // Assert — no markdown tokens remain
    expect(result).not.toContain('**');
    expect(result).not.toContain('[[');
    expect(result).not.toContain(']]');
    expect(result).not.toContain('`');
    expect(result).not.toMatch(/#\w/);
    // content words survive
    expect(result).toContain('Electron');
    expect(result).toContain('Chromium');
    expect(result).toContain('IPC');
  });
});

// ─── E2E placeholder ─────────────────────────────────────────────────────────

describe.todo('E2E: parser integration with note save flow', () => {
  // TODO: implement once services/notes.ts and IPC handlers exist.
  // Verify that saving a note with [[links]] and #category correctly:
  //   1. Calls extractWikiLinks to build references.json entries
  //   2. Calls stripMarkdownForSearch to build search-index.json body_text
  //   3. Calls extractCategoryMention to resolve #syntax to category UUID
});
