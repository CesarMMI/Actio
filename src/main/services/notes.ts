// RN-001, RN-003, RN-004, RN-005, RN-010, RN-011, RN-012, RN-020, RN-023, RN-024
import * as parser from '../parser/markdown-parser';
import * as notesStore from '../store/notes/notesStore';
import * as referencesStore from '../store/references/referencesStore';
import * as searchIndexStore from '../store/search/searchIndexStore';
import { AppError } from '../types/errors/app-error';
import type { Note } from '../types/notes/note';
import type { NoteIndex } from '../types/notes/note-index';
import type { SaveNoteInput } from '../types/notes/save-note-input';
import type { SaveNoteResult } from '../types/notes/save-note-result';
import type { Reference } from '../types/references/reference';

// RN-003, RN-004: validate note title
function validateTitle(title: string): void {
  if (title.length > 50) throw new AppError('NOTE_TITLE_TOO_LONG', 'Title must be 50 characters or fewer');
  if (title.includes('[') || title.includes(']')) throw new AppError('NOTE_TITLE_INVALID_CHARS', 'Title must not contain [ or ]');
}

// RN-001, RN-002, RN-003, RN-004, RN-020, RN-023: create or update a note
export async function saveNote(vaultPath: string, input: SaveNoteInput): Promise<SaveNoteResult> {
  validateTitle(input.title);

  const id = input.id ?? crypto.randomUUID();
  const now = new Date().toISOString();
  const note: Note = { id, title: input.title, body: input.body, category_id: input.category_id, created_at: now, updated_at: now };

  // RN-020: extract wikilinks and resolve to note ids (RN-023: case-sensitive)
  const wikilinks = parser.extractWikiLinks(input.body);
  const allNotes = await notesStore.listNotes(vaultPath);
  const titleToId = new Map(allNotes.map(n => [n.title, n.id]));

  const newRefs: Reference[] = wikilinks.map(link => {
    const target_id = titleToId.get(link) ?? null;
    return { source_id: id, target_id, target_title: link, is_broken: target_id === null, updated_at: now };
  });

  // Replace stale outgoing refs for this note
  const allRefs = await referencesStore.readReferences(vaultPath);
  const otherRefs = allRefs.filter(r => r.source_id !== id);
  await referencesStore.writeReferences(vaultPath, [...otherRefs, ...newRefs]);

  await notesStore.writeNote(vaultPath, note);

  const body_text = parser.stripMarkdownForSearch(input.body);
  await searchIndexStore.upsertEntry(vaultPath, { id, title: input.title, body_text, category_id: input.category_id, updated_at: now });

  return { note, references: newRefs };
}

// RN-005: read a single note
export async function getNote(vaultPath: string, id: string): Promise<Note> {
  return notesStore.readNote(vaultPath, id);
}

// RN-001: list all notes without body
export async function listNotes(vaultPath: string): Promise<NoteIndex[]> {
  return notesStore.listNotes(vaultPath);
}

// RN-010: pre-check — return notes that would be orphaned if this note is deleted
export async function deleteNote(vaultPath: string, id: string): Promise<{ orphaned: Reference[] }> {
  const refs = await referencesStore.readReferences(vaultPath);
  return { orphaned: refs.filter(r => r.target_id === id) };
}

// RN-011: actual deletion — remove file, clean outgoing refs, mark incoming refs as broken
export async function confirmDeleteNote(vaultPath: string, id: string): Promise<{ success: boolean }> {
  const refs = await referencesStore.readReferences(vaultPath);
  const updated = refs
    .filter(r => r.source_id !== id)
    .map(r => r.target_id === id ? { ...r, target_id: null, is_broken: true } : r);

  await referencesStore.writeReferences(vaultPath, updated);
  await notesStore.deleteNote(vaultPath, id);
  await searchIndexStore.removeEntry(vaultPath, id);

  return { success: true };
}

// RN-003, RN-004, RN-012, RN-024: rename note and update all references
export async function renameNote(vaultPath: string, input: { id: string; title: string }): Promise<{ note: Note; updated_references: number }> {
  validateTitle(input.title);

  const now = new Date().toISOString();
  const existing = await notesStore.readNote(vaultPath, input.id);
  const updatedNote: Note = { ...existing, title: input.title, updated_at: now };

  await notesStore.writeNote(vaultPath, updatedNote);
  await searchIndexStore.upsertEntry(vaultPath, {
    id: input.id,
    title: input.title,
    body_text: parser.stripMarkdownForSearch(existing.body),
    category_id: existing.category_id,
    updated_at: now,
  });

  const allRefs = await referencesStore.readReferences(vaultPath);

  // RN-024: count refs pointing to this note (before modification)
  const updated_references = allRefs.filter(r => r.target_id === input.id).length;

  const updatedRefs = allRefs.map(r => {
    // RN-024: update target_title for existing incoming refs
    if (r.target_id === input.id) return { ...r, target_title: input.title };
    // RN-012: reconnect broken refs whose target_title matches the new title
    if (r.is_broken && r.target_title === input.title) return { ...r, target_id: input.id, is_broken: false };
    return r;
  });

  await referencesStore.writeReferences(vaultPath, updatedRefs);

  return { note: updatedNote, updated_references };
}
