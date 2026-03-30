// Rules: RN-001, RN-002, RN-004, RN-005, RN-006, RN-007 | ADR-004
import { readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { AppError } from '../../types/errors/app-error';
import type { Note } from '../../types/notes/note';
import type { NoteIndex } from '../../types/notes/note-index';

function parseFrontmatter(content: string): Note {
  // Strip leading ---\n
  const withoutLeader = content.startsWith('---\n') ? content.slice(4) : content;
  const closingIdx = withoutLeader.indexOf('\n---\n');
  const fmLines = withoutLeader.slice(0, closingIdx).split('\n');
  const body = withoutLeader.slice(closingIdx + 5); // skip \n---\n

  const fm: Record<string, string> = {};
  for (const line of fmLines) {
    const colon = line.indexOf(': ');
    if (colon !== -1) {
      fm[line.slice(0, colon)] = line.slice(colon + 2);
    } else if (line.includes(':')) {
      // key with empty value e.g. "category_id:"
      fm[line.slice(0, line.indexOf(':'))] = '';
    }
  }

  return {
    id: fm['id'] ?? '',
    title: fm['title'] ?? '',
    body,
    category_id: fm['category_id'] || null,
    created_at: fm['created_at'] ?? '',
    updated_at: fm['updated_at'] ?? '',
  };
}

function serializeNote(note: Note): string {
  const categoryLine = note.category_id != null
    ? `category_id: ${note.category_id}`
    : 'category_id:';
  return `---\nid: ${note.id}\ntitle: ${note.title}\n${categoryLine}\ncreated_at: ${note.created_at}\nupdated_at: ${note.updated_at}\n---\n${note.body}`;
}

// RN-005, RN-006, RN-007: read a note's .md file and parse it
export async function readNote(vaultPath: string, id: string): Promise<Note> {
  const filePath = path.join(vaultPath, `${id}.md`);
  try {
    const content = await readFile(filePath, 'utf-8');
    return parseFrontmatter(content as unknown as string);
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') throw new AppError('VAULT_NOT_FOUND', `Note not found: ${id}`);
    throw err;
  }
}

// RN-005, RN-006, RN-007 | ADR-004: atomic write-then-rename
export async function writeNote(vaultPath: string, note: Note): Promise<void> {
  const tmpPath = path.join(vaultPath, `${note.id}.md.tmp`);
  const finalPath = path.join(vaultPath, `${note.id}.md`);
  const content = serializeNote(note);
  try {
    await writeFile(tmpPath, content, 'utf-8');
  } catch {
    throw new AppError('FILE_WRITE_ERROR', 'Failed to write note');
  }
  await rename(tmpPath, finalPath);
}

// RN-005, RN-006: delete a note file
export async function deleteNote(vaultPath: string, id: string): Promise<void> {
  try {
    await unlink(path.join(vaultPath, `${id}.md`));
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') throw new AppError('VAULT_NOT_FOUND', `Note not found: ${id}`);
    throw err;
  }
}

// RN-001, RN-006: list all notes (without body) in vault
export async function listNotes(vaultPath: string): Promise<NoteIndex[]> {
  const entries = await readdir(vaultPath) as unknown as string[];
  const mdFiles = entries.filter((f) => f.endsWith('.md'));
  const notes = await Promise.all(
    mdFiles.map(async (file) => {
      const id = file.slice(0, -3); // strip .md
      const note = await readNote(vaultPath, id);
      const { body, ...index } = note;
      void body;
      return index as NoteIndex;
    }),
  );
  return notes;
}
