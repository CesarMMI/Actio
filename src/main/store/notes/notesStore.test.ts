// Rules covered: RN-001, RN-002, RN-004, RN-005, RN-006, RN-007 | ADR-004
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readNote, writeNote, deleteNote, listNotes } from './notesStore';
import type { Note } from '../../types';

vi.mock('node:fs/promises');

import { readFile, writeFile, rename, unlink, readdir } from 'node:fs/promises';
import path from 'node:path';

const mockReadFile = vi.mocked(readFile);
const mockWriteFile = vi.mocked(writeFile);
const mockRename = vi.mocked(rename);
const mockUnlink = vi.mocked(unlink);
const mockReaddir = vi.mocked(readdir);

const VAULT = '/vault';
const NOTE_ID = 'a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0';

const SAMPLE_MD = `---
id: ${NOTE_ID}
title: Como funciona o Electron
category_id: b1c2d3e4-5f6a-7b8c-9d0e-f1a2b3c4d5e6
created_at: 2026-03-28T10:00:00Z
updated_at: 2026-03-28T14:30:00Z
---
O Electron combina Chromium e Node.js.`;

const SAMPLE_NOTE: Note = {
  id: NOTE_ID,
  title: 'Como funciona o Electron',
  body: 'O Electron combina Chromium e Node.js.',
  category_id: 'b1c2d3e4-5f6a-7b8c-9d0e-f1a2b3c4d5e6',
  created_at: '2026-03-28T10:00:00Z',
  updated_at: '2026-03-28T14:30:00Z',
};

beforeEach(() => {
  vi.resetAllMocks();
});

// ---------------------------------------------------------------------------
describe('readNote', () => {
  // Rules: RN-005, RN-006, RN-007

  it('should parse frontmatter and body from a .md file', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(SAMPLE_MD as never);

    // Act
    const note = await readNote(VAULT, NOTE_ID);

    // Assert
    expect(mockReadFile).toHaveBeenCalledWith(
      path.join(VAULT, `${NOTE_ID}.md`),
      'utf-8',
    );
    expect(note.id).toBe(NOTE_ID);
    expect(note.title).toBe('Como funciona o Electron');
    expect(note.body).toBe('O Electron combina Chromium e Node.js.');
    expect(note.category_id).toBe('b1c2d3e4-5f6a-7b8c-9d0e-f1a2b3c4d5e6');
  });

  it('should return null category_id when frontmatter has no category_id', async () => {
    // Arrange
    const mdNoCategory = `---
id: ${NOTE_ID}
title: Nota Simples
created_at: 2026-03-28T10:00:00Z
updated_at: 2026-03-28T10:00:00Z
---
`;
    mockReadFile.mockResolvedValue(mdNoCategory as never);

    // Act
    const note = await readNote(VAULT, NOTE_ID);

    // Assert — RN-031: category is optional
    expect(note.category_id).toBeNull();
  });

  it('should return empty body when note has no body content', async () => {
    // Arrange — RN-002: body may be empty
    const mdEmptyBody = `---
id: ${NOTE_ID}
title: Título Apenas
created_at: 2026-03-28T10:00:00Z
updated_at: 2026-03-28T10:00:00Z
---
`;
    mockReadFile.mockResolvedValue(mdEmptyBody as never);

    // Act
    const note = await readNote(VAULT, NOTE_ID);

    // Assert
    expect(note.body.trim()).toBe('');
  });

  it('should throw AppError with VAULT_NOT_FOUND when file does not exist', async () => {
    // Arrange
    const fsError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    mockReadFile.mockRejectedValue(fsError);

    // Act & Assert
    await expect(readNote(VAULT, NOTE_ID)).rejects.toMatchObject({
      code: 'VAULT_NOT_FOUND',
    });
  });
});

// ---------------------------------------------------------------------------
describe('writeNote', () => {
  // Rules: RN-005, RN-006 | ADR-004 (write-then-rename)

  it('should write frontmatter + body to a .tmp file then rename atomically', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    const tmpPath = path.join(VAULT, `${NOTE_ID}.md.tmp`);
    const finalPath = path.join(VAULT, `${NOTE_ID}.md`);

    // Act
    await writeNote(VAULT, SAMPLE_NOTE);

    // Assert — ADR-004: write-then-rename
    expect(mockWriteFile).toHaveBeenCalledWith(tmpPath, expect.stringContaining(NOTE_ID), 'utf-8');
    expect(mockRename).toHaveBeenCalledWith(tmpPath, finalPath);
  });

  it('should include all frontmatter fields in the written file', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await writeNote(VAULT, SAMPLE_NOTE);

    // Assert — RN-007: id, title, category_id, created_at, updated_at in frontmatter
    const writtenContent = mockWriteFile.mock.calls[0][1] as string;
    expect(writtenContent).toContain(`id: ${NOTE_ID}`);
    expect(writtenContent).toContain('title: Como funciona o Electron');
    expect(writtenContent).toContain('category_id:');
    expect(writtenContent).toContain('created_at:');
    expect(writtenContent).toContain('updated_at:');
  });

  it('should write a note with title exactly 50 characters (boundary)', async () => {
    // Arrange — RN-004: title max 50 chars
    const fiftyCharTitle = 'A'.repeat(50);
    const noteAtBoundary: Note = { ...SAMPLE_NOTE, title: fiftyCharTitle };
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await writeNote(VAULT, noteAtBoundary);

    // Assert — should NOT throw, boundary is valid
    const writtenContent = mockWriteFile.mock.calls[0][1] as string;
    expect(writtenContent).toContain(fiftyCharTitle);
  });

  it('should write a note with null category_id', async () => {
    // Arrange — RN-031: note may have no category
    const noteNoCategory: Note = { ...SAMPLE_NOTE, category_id: null };
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act & Assert — should not throw
    await expect(writeNote(VAULT, noteNoCategory)).resolves.toBeUndefined();
  });

  it('should propagate FILE_WRITE_ERROR when writeFile fails', async () => {
    // Arrange
    mockWriteFile.mockRejectedValue(new Error('disk full'));

    // Act & Assert
    await expect(writeNote(VAULT, SAMPLE_NOTE)).rejects.toMatchObject({
      code: 'FILE_WRITE_ERROR',
    });
  });
});

// ---------------------------------------------------------------------------
describe('deleteNote', () => {
  // Rules: RN-005, RN-006

  it('should unlink the correct .md file', async () => {
    // Arrange
    mockUnlink.mockResolvedValue(undefined as never);

    // Act
    await deleteNote(VAULT, NOTE_ID);

    // Assert
    expect(mockUnlink).toHaveBeenCalledWith(path.join(VAULT, `${NOTE_ID}.md`));
  });

  it('should throw AppError with VAULT_NOT_FOUND when file does not exist', async () => {
    // Arrange
    const fsError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    mockUnlink.mockRejectedValue(fsError);

    // Act & Assert
    await expect(deleteNote(VAULT, NOTE_ID)).rejects.toMatchObject({
      code: 'VAULT_NOT_FOUND',
    });
  });
});

// ---------------------------------------------------------------------------
describe('listNotes', () => {
  // Rules: RN-001, RN-006

  it('should return NoteIndex array (no body) for all .md files in vault', async () => {
    // Arrange
    const id2 = 'b4c5d6e7-8c9d-0e1f-2a3b-4c5d6e7f8a9b';
    const md2 = `---
id: ${id2}
title: Node.js
created_at: 2026-03-28T11:00:00Z
updated_at: 2026-03-28T11:00:00Z
---
Detalhes sobre Node.js`;

    mockReaddir.mockResolvedValue([`${NOTE_ID}.md`, `${id2}.md`] as never);
    mockReadFile
      .mockResolvedValueOnce(SAMPLE_MD as never)
      .mockResolvedValueOnce(md2 as never);

    // Act
    const notes = await listNotes(VAULT);

    // Assert
    expect(notes).toHaveLength(2);
    expect(notes[0]).not.toHaveProperty('body');
    expect(notes[0].id).toBe(NOTE_ID);
    expect(notes[1].id).toBe(id2);
  });

  it('should return empty array when vault has no .md files', async () => {
    // Arrange
    mockReaddir.mockResolvedValue([] as never);

    // Act
    const notes = await listNotes(VAULT);

    // Assert
    expect(notes).toEqual([]);
  });

  it('should ignore non-.md files in vault directory', async () => {
    // Arrange
    mockReaddir.mockResolvedValue([
      `${NOTE_ID}.md`,
      'categories.json',
      'references.json',
      'search-index.json',
    ] as never);
    mockReadFile.mockResolvedValue(SAMPLE_MD as never);

    // Act
    const notes = await listNotes(VAULT);

    // Assert — only 1 .md file was processed
    expect(notes).toHaveLength(1);
    expect(mockReadFile).toHaveBeenCalledTimes(1);
  });

  it('should allow two notes with the same title (different UUIDs)', async () => {
    // Arrange — RN-001: duplicate titles are allowed
    const id2 = 'b4c5d6e7-8c9d-0e1f-2a3b-4c5d6e7f8a9b';
    const mdDuplicate = `---
id: ${id2}
title: Como funciona o Electron
created_at: 2026-03-28T11:00:00Z
updated_at: 2026-03-28T11:00:00Z
---
`;
    mockReaddir.mockResolvedValue([`${NOTE_ID}.md`, `${id2}.md`] as never);
    mockReadFile
      .mockResolvedValueOnce(SAMPLE_MD as never)
      .mockResolvedValueOnce(mdDuplicate as never);

    // Act
    const notes = await listNotes(VAULT);

    // Assert
    expect(notes).toHaveLength(2);
    expect(notes[0].title).toBe(notes[1].title);
    expect(notes[0].id).not.toBe(notes[1].id);
  });
});

// ---------------------------------------------------------------------------
// TODO: E2E — implement once Electron app is running
// describe('notesStore E2E', () => {
//   it('should write a note to a real vault folder and read it back');
//   it('should survive app restart (file persisted to disk)');
// });
