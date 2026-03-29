// src/main/parser/markdown-parser.ts

/**
 * Extracts all [[Title]] wiki-link tokens from a note body.
 * RN-020: wiki links use [[Title]] syntax.
 * RN-023: references are case-sensitive — titles are returned as-is.
 * Duplicates are preserved; deduplication is the caller's responsibility.
 */
export function extractWikiLinks(body: string): string[] {
  const matches: string[] = [];
  const re = /\[\[(.+?)\]\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

/**
 * Extracts the first #tag category mention from a note body.
 * RN-032: categories can be referenced inline using #name syntax.
 * Markdown headings (# followed by a space) are not confused with tags.
 * Returns the tag name without the leading #, or null if none found.
 */
export function extractCategoryMention(body: string): string | null {
  // Negative lookbehind ensures # is not preceded by a word character.
  // Requires a letter immediately after # to exclude "# Heading" (space) patterns.
  const m = body.match(/(?<!\w)#([a-zA-Z][a-zA-Z0-9_-]*)/);
  return m ? m[1] : null;
}

/**
 * Strips Markdown syntax from a note body, producing plain text suitable
 * for full-text search indexing (data model §5.3: body_text field).
 * Content words are preserved; only syntax tokens are removed.
 */
export function stripMarkdownForSearch(body: string): string {
  return body
    // 1. Remove code fences (```...```) — keep inner content
    .replace(/```[^\n]*\n([\s\S]*?)```/g, '$1')
    // 2. Remove remaining ``` markers (unclosed or single-line fences)
    .replace(/```/g, '')
    // 3. Remove inline code backticks — keep the code text
    .replace(/`([^`]+)`/g, '$1')
    // 4. Remove wiki link syntax [[Title]] — keep the title
    .replace(/\[\[(.+?)\]\]/g, '$1')
    // 5. Remove category mention # — keep the tag word
    .replace(/(?<!\w)#([a-zA-Z][a-zA-Z0-9_-]*)/g, '$1')
    // 6. Remove heading markers (# at line start)
    .replace(/^#+\s/gm, '')
    // 7. Remove bold markers (**text**)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    // 8. Remove italic markers (_text_ and *text*)
    .replace(/_(.+?)_/g, '$1')
    .replace(/\*(.+?)\*/g, '$1');
}
