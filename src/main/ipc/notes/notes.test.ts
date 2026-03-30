// RN-001, RN-002, RN-003, RN-004, RN-010, RN-011, RN-012, RN-020, RN-023, RN-024
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../../types/errors/app-error';

// --- Handler capture setup ---
const handlers: Record<string, (_event: unknown, payload?: unknown) => unknown> = {};
vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn((channel: string, fn: (_event: unknown, payload?: unknown) => unknown) => {
      handlers[channel] = fn;
    }),
  },
}));

vi.mock('../../services/notes');
vi.mock('../../store/config/configStore');

import * as notesService from '../../services/notes';
import * as configStore from '../../store/config/configStore';
import { registerNoteHandlers } from './notes';

const mockEvent = {};
const APP_DATA_PATH = '/app/data';
const VAULT_PATH = '/vault';

describe('registerNoteHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(handlers).forEach(k => delete handlers[k]);
    vi.mocked(configStore.getVaultPath).mockResolvedValue(VAULT_PATH);
    registerNoteHandlers(APP_DATA_PATH);
  });

  // --- note:list ---
  describe('note:list', () => {
    // RN-001: list all notes (no body)
    it('should return { notes } from listNotes', async () => {
      // Arrange
      const mockNotes = [{ id: 'abc', title: 'Test', category_id: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }];
      vi.mocked(notesService.listNotes).mockResolvedValue(mockNotes);

      // Act
      const result = await handlers['note:list'](mockEvent, {});

      // Assert
      expect(notesService.listNotes).toHaveBeenCalledWith(VAULT_PATH);
      expect(result).toEqual({ notes: mockNotes });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['note:list'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
      expect(notesService.listNotes).not.toHaveBeenCalled();
    });
  });

  // --- note:get ---
  describe('note:get', () => {
    // RN-005: read a single note
    it('should return { note } for a given id', async () => {
      // Arrange
      const mockNote = { id: 'abc', title: 'Test', body: '# Hello', category_id: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' };
      vi.mocked(notesService.getNote).mockResolvedValue(mockNote);

      // Act
      const result = await handlers['note:get'](mockEvent, { id: 'abc' });

      // Assert
      expect(notesService.getNote).toHaveBeenCalledWith(VAULT_PATH, 'abc');
      expect(result).toEqual({ note: mockNote });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['note:get'](mockEvent, { id: 'abc' });

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
    });
  });

  // --- note:save ---
  describe('note:save', () => {
    const savePayload = { title: 'New Note', body: 'Hello [[World]]', category_id: null };

    // RN-001, RN-002, RN-020: create new note
    it('should return { note, references } when creating a new note (no id)', async () => {
      // Arrange
      const mockResult = {
        note: { id: 'new-uuid', ...savePayload, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
        references: [{ source_id: 'new-uuid', target_id: null, target_title: 'World', is_broken: true, updated_at: '2026-01-01T00:00:00Z' }],
      };
      vi.mocked(notesService.saveNote).mockResolvedValue(mockResult);

      // Act
      const result = await handlers['note:save'](mockEvent, savePayload);

      // Assert
      expect(notesService.saveNote).toHaveBeenCalledWith(VAULT_PATH, savePayload);
      expect(result).toEqual(mockResult);
    });

    it('should pass existing id when updating a note', async () => {
      // Arrange
      const updatePayload = { id: 'existing-uuid', ...savePayload };
      const mockResult = {
        note: { ...updatePayload, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-02T00:00:00Z' },
        references: [],
      };
      vi.mocked(notesService.saveNote).mockResolvedValue(mockResult);

      // Act
      await handlers['note:save'](mockEvent, updatePayload);

      // Assert
      expect(notesService.saveNote).toHaveBeenCalledWith(VAULT_PATH, updatePayload);
    });

    // RN-004: title exactly 50 chars is valid boundary
    it('should succeed when title is exactly 50 characters', async () => {
      // Arrange
      const title50 = 'a'.repeat(50);
      const mockResult = {
        note: { id: 'uuid', title: title50, body: '', category_id: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
        references: [],
      };
      vi.mocked(notesService.saveNote).mockResolvedValue(mockResult);

      // Act
      const result = await handlers['note:save'](mockEvent, { title: title50, body: '', category_id: null });

      // Assert
      expect(result).toEqual(mockResult);
    });

    // RN-004: title exceeds 50 chars
    it('should return NOTE_TITLE_TOO_LONG error for title with 51 characters', async () => {
      // Arrange
      vi.mocked(notesService.saveNote).mockRejectedValue(new AppError('NOTE_TITLE_TOO_LONG', 'Title must be 50 characters or fewer'));

      // Act
      const result = await handlers['note:save'](mockEvent, { title: 'a'.repeat(51), body: '', category_id: null });

      // Assert
      expect(result).toEqual({ error: true, code: 'NOTE_TITLE_TOO_LONG', message: 'Title must be 50 characters or fewer' });
    });

    // RN-003: title contains invalid character [
    it('should return NOTE_TITLE_INVALID_CHARS for title containing [', async () => {
      // Arrange
      vi.mocked(notesService.saveNote).mockRejectedValue(new AppError('NOTE_TITLE_INVALID_CHARS', 'Title must not contain [ or ]'));

      // Act
      const result = await handlers['note:save'](mockEvent, { title: 'Bad [title]', body: '', category_id: null });

      // Assert
      expect(result).toEqual({ error: true, code: 'NOTE_TITLE_INVALID_CHARS', message: 'Title must not contain [ or ]' });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['note:save'](mockEvent, savePayload);

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
    });

    it('should return UNKNOWN_ERROR for unexpected exceptions', async () => {
      // Arrange
      vi.mocked(notesService.saveNote).mockRejectedValue(new Error('disk full'));

      // Act
      const result = await handlers['note:save'](mockEvent, savePayload);

      // Assert
      expect(result).toEqual({ error: true, code: 'UNKNOWN_ERROR', message: expect.any(String) });
    });
  });

  // --- note:delete ---
  describe('note:delete', () => {
    // RN-010: pre-check returns orphaned references
    it('should return { orphaned } from deleteNote pre-check', async () => {
      // Arrange
      const orphaned = [{ source_id: 'other', target_id: 'abc', target_title: 'Test', is_broken: false, updated_at: '2026-01-01T00:00:00Z' }];
      vi.mocked(notesService.deleteNote).mockResolvedValue({ orphaned });

      // Act
      const result = await handlers['note:delete'](mockEvent, { id: 'abc' });

      // Assert
      expect(notesService.deleteNote).toHaveBeenCalledWith(VAULT_PATH, 'abc');
      expect(result).toEqual({ orphaned });
    });

    // RN-010: no orphaned refs
    it('should return empty orphaned array when no references exist', async () => {
      // Arrange
      vi.mocked(notesService.deleteNote).mockResolvedValue({ orphaned: [] });

      // Act
      const result = await handlers['note:delete'](mockEvent, { id: 'abc' });

      // Assert
      expect(result).toEqual({ orphaned: [] });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['note:delete'](mockEvent, { id: 'abc' });

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
    });
  });

  // --- note:delete:confirm ---
  describe('note:delete:confirm', () => {
    // RN-011: actual deletion
    it('should return { success: true } after confirmed deletion', async () => {
      // Arrange
      vi.mocked(notesService.confirmDeleteNote).mockResolvedValue({ success: true });

      // Act
      const result = await handlers['note:delete:confirm'](mockEvent, { id: 'abc' });

      // Assert
      expect(notesService.confirmDeleteNote).toHaveBeenCalledWith(VAULT_PATH, 'abc');
      expect(result).toEqual({ success: true });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['note:delete:confirm'](mockEvent, { id: 'abc' });

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
    });
  });

  // --- note:rename ---
  describe('note:rename', () => {
    // RN-024: rename updates all references atomically
    it('should return { note, updated_references } from renameNote', async () => {
      // Arrange
      const renamedNote = { id: 'abc', title: 'New Title', body: '# Hello', category_id: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-02T00:00:00Z' };
      vi.mocked(notesService.renameNote).mockResolvedValue({ note: renamedNote, updated_references: 3 });

      // Act
      const result = await handlers['note:rename'](mockEvent, { id: 'abc', title: 'New Title' });

      // Assert
      expect(notesService.renameNote).toHaveBeenCalledWith(VAULT_PATH, { id: 'abc', title: 'New Title' });
      expect(result).toEqual({ note: renamedNote, updated_references: 3 });
    });

    // RN-004: title exactly 50 chars boundary
    it('should succeed when new title is exactly 50 characters', async () => {
      // Arrange
      const title50 = 'b'.repeat(50);
      const renamedNote = { id: 'abc', title: title50, body: '', category_id: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-02T00:00:00Z' };
      vi.mocked(notesService.renameNote).mockResolvedValue({ note: renamedNote, updated_references: 0 });

      // Act
      const result = await handlers['note:rename'](mockEvent, { id: 'abc', title: title50 });

      // Assert
      expect(result).toEqual({ note: renamedNote, updated_references: 0 });
    });

    // RN-004: title too long
    it('should return NOTE_TITLE_TOO_LONG when new title exceeds 50 chars', async () => {
      // Arrange
      vi.mocked(notesService.renameNote).mockRejectedValue(new AppError('NOTE_TITLE_TOO_LONG', 'Title must be 50 characters or fewer'));

      // Act
      const result = await handlers['note:rename'](mockEvent, { id: 'abc', title: 'a'.repeat(51) });

      // Assert
      expect(result).toEqual({ error: true, code: 'NOTE_TITLE_TOO_LONG', message: 'Title must be 50 characters or fewer' });
    });

    // RN-012: renaming to orphaned target_title reconnects references
    it('should return updated_references > 0 when rename reconnects orphan links', async () => {
      // Arrange
      const renamedNote = { id: 'abc', title: 'Orphan Target', body: '', category_id: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-02T00:00:00Z' };
      vi.mocked(notesService.renameNote).mockResolvedValue({ note: renamedNote, updated_references: 2 });

      // Act
      const result = await handlers['note:rename'](mockEvent, { id: 'abc', title: 'Orphan Target' }) as { updated_references: number };

      // Assert
      expect(result.updated_references).toBe(2);
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['note:rename'](mockEvent, { id: 'abc', title: 'New Title' });

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
    });

    it('should return UNKNOWN_ERROR for unexpected exceptions', async () => {
      // Arrange
      vi.mocked(notesService.renameNote).mockRejectedValue(new Error('fs error'));

      // Act
      const result = await handlers['note:rename'](mockEvent, { id: 'abc', title: 'New Title' });

      // Assert
      expect(result).toEqual({ error: true, code: 'UNKNOWN_ERROR', message: expect.any(String) });
    });
  });
});

// TODO: E2E — full save→delete→orphan flow via real Electron IPC
// TODO: E2E — rename reconnects orphan link in references.json on disk
