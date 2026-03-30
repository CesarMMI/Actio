// RN-050, RN-051, RN-052, RN-053, RN-054
import { ipcMain } from 'electron';
import { AppError } from '../../types/errors/app-error';
import * as searchService from '../../services/search';
import { getVaultPath } from '../../store/config/configStore';

function serializeError(err: unknown) {
  if (err instanceof AppError) return { error: true, code: err.code, message: err.message };
  return { error: true, code: 'UNKNOWN_ERROR', message: err instanceof Error ? err.message : String(err) };
}

export function registerSearchHandlers(appDataPath: string): void {
  // RN-050, RN-051, RN-053, RN-054: query search index (cache-based — vaultPath not forwarded)
  ipcMain.handle('search:query', async (_event, payload: unknown) => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      return await searchService.querySearch(payload as Parameters<typeof searchService.querySearch>[0]);
    } catch (err) {
      return serializeError(err);
    }
  });
}
