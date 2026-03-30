// RN-030, RN-031, RN-034, RN-035, RN-036, RN-040, RN-041
import { ipcMain } from 'electron';
import { AppError } from '../../types/errors/app-error';
import * as categoriesService from '../../services/categories';
import { getVaultPath } from '../../store/config/configStore';

function serializeError(err: unknown) {
  if (err instanceof AppError) return { error: true, code: err.code, message: err.message };
  return { error: true, code: 'UNKNOWN_ERROR', message: err instanceof Error ? err.message : String(err) };
}

export function registerCategoryHandlers(appDataPath: string): void {
  // RN-030: list all categories
  ipcMain.handle('category:list', async () => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      const categories = await categoriesService.listCategories(vaultPath);
      return { categories };
    } catch (err) {
      return serializeError(err);
    }
  });

  // RN-030, RN-035, RN-036: create or update a category
  ipcMain.handle('category:save', async (_event, payload: unknown) => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      return await categoriesService.saveCategory(vaultPath, payload as Parameters<typeof categoriesService.saveCategory>[1]);
    } catch (err) {
      return serializeError(err);
    }
  });

  // RN-040, RN-041: delete category and unlink from notes
  ipcMain.handle('category:delete', async (_event, payload: unknown) => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      const { id } = payload as { id: string };
      return await categoriesService.deleteCategory(vaultPath, id);
    } catch (err) {
      return serializeError(err);
    }
  });
}
