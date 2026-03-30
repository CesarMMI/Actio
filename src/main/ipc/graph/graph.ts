// RN-060, RN-061, RN-062, RN-063, RN-064, RN-073
import { ipcMain } from 'electron';
import { AppError } from '../../types/errors/app-error';
import * as graphService from '../../services/graph';
import { getVaultPath } from '../../store/config/configStore';

function serializeError(err: unknown) {
  if (err instanceof AppError) return { error: true, code: err.code, message: err.message };
  return { error: true, code: 'UNKNOWN_ERROR', message: err instanceof Error ? err.message : String(err) };
}

export function registerGraphHandlers(appDataPath: string): void {
  // RN-060, RN-061, RN-062, RN-063, RN-073: build graph data (nodes + edges)
  ipcMain.handle('graph:data', async () => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      return await graphService.getGraphData(vaultPath);
    } catch (err) {
      return serializeError(err);
    }
  });
}
