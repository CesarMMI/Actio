// RN-001, RN-002, RN-003, RN-004, RN-010, RN-011, RN-012, RN-020, RN-023, RN-024
import { ipcMain } from 'electron';
import { AppError } from '../../types/errors/app-error';
import * as notesService from '../../services/notes';
import { getVaultPath } from '../../store/config/configStore';

function serializeError(err: unknown) {
  if (err instanceof AppError) return { error: true, code: err.code, message: err.message };
  return { error: true, code: 'UNKNOWN_ERROR', message: err instanceof Error ? err.message : String(err) };
}

export function registerNoteHandlers(appDataPath: string): void {
  // RN-001: list all notes (no body)
  ipcMain.handle('note:list', async () => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      const notes = await notesService.listNotes(vaultPath);
      return { notes };
    } catch (err) {
      return serializeError(err);
    }
  });

  // RN-005: read a single note by id
  ipcMain.handle('note:get', async (_event, payload: unknown) => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      const { id } = payload as { id: string };
      const note = await notesService.getNote(vaultPath, id);
      return { note };
    } catch (err) {
      return serializeError(err);
    }
  });

  // RN-001, RN-002, RN-003, RN-004, RN-020: create or update a note
  ipcMain.handle('note:save', async (_event, payload: unknown) => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      return await notesService.saveNote(vaultPath, payload as Parameters<typeof notesService.saveNote>[1]);
    } catch (err) {
      return serializeError(err);
    }
  });

  // RN-010: pre-check deletion — returns orphaned references
  ipcMain.handle('note:delete', async (_event, payload: unknown) => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      const { id } = payload as { id: string };
      return await notesService.deleteNote(vaultPath, id);
    } catch (err) {
      return serializeError(err);
    }
  });

  // RN-011: confirmed deletion — removes note and updates references
  ipcMain.handle('note:delete:confirm', async (_event, payload: unknown) => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      const { id } = payload as { id: string };
      return await notesService.confirmDeleteNote(vaultPath, id);
    } catch (err) {
      return serializeError(err);
    }
  });

  // RN-004, RN-012, RN-024: rename note and reconnect orphan links
  ipcMain.handle('note:rename', async (_event, payload: unknown) => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      const input = payload as Parameters<typeof notesService.renameNote>[1];
      return await notesService.renameNote(vaultPath, input);
    } catch (err) {
      return serializeError(err);
    }
  });
}
