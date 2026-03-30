// RN-080, RN-081, RN-083, RN-086, RN-087
import * as parser from '../parser/markdown-parser';
import * as categoriesStore from '../store/categories/categoriesStore';
import * as notesStore from '../store/notes/notesStore';
import * as referencesStore from '../store/references/referencesStore';
import * as searchIndexStore from '../store/search/searchIndexStore';
import type { Reference } from '../types/references/reference';
import type { SearchEntry } from '../types/search/search-entry';
import type { IntegrityResult } from '../types/vault/integrity-result';
import type { RebuildResult } from '../types/vault/rebuild-result';

// RN-086: rebuild references and search index from .md files (source of truth)
export async function rebuildVault(vaultPath: string): Promise<RebuildResult> {
  const noteList = await notesStore.listNotes(vaultPath);
  const allNotes = await Promise.all(noteList.map(n => notesStore.readNote(vaultPath, n.id)));

  // Build title→id map for reference resolution (RN-023: case-sensitive)
  const titleToId = new Map(allNotes.map(n => [n.title, n.id]));

  const allRefs: Reference[] = [];
  const allSearchEntries: SearchEntry[] = [];
  const now = new Date().toISOString();

  for (const note of allNotes) {
    // RN-020: extract wikilinks and build references
    const wikilinks = parser.extractWikiLinks(note.body);
    for (const link of wikilinks) {
      const target_id = titleToId.get(link) ?? null;
      allRefs.push({ source_id: note.id, target_id, target_title: link, is_broken: target_id === null, updated_at: now });
    }

    // Build search entry
    const body_text = parser.stripMarkdownForSearch(note.body);
    allSearchEntries.push({ id: note.id, title: note.title, body_text, category_id: note.category_id, updated_at: note.updated_at });
  }

  await referencesStore.writeReferences(vaultPath, allRefs);
  await searchIndexStore.rebuildIndex(vaultPath, allSearchEntries);

  return { rebuilt: true };
}

// RN-086: check vault integrity and auto-rebuild if needed
export async function checkIntegrity(vaultPath: string): Promise<IntegrityResult> {
  await categoriesStore.readCategories(vaultPath);
  await referencesStore.readReferences(vaultPath);
  await searchIndexStore.loadIndex(vaultPath);

  const cache = searchIndexStore.getCache();
  const noteList = await notesStore.listNotes(vaultPath);

  // Auto-rebuild when notes exist but search cache is empty (stale/missing index)
  if (noteList.length > 0 && cache.length === 0) {
    await rebuildVault(vaultPath);
    return { ok: true, rebuilt: true };
  }

  return { ok: true, rebuilt: false };
}
