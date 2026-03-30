// RN-080, RN-081, RN-083, RN-086, RN-087
import { ipcMain } from 'electron';
import { AppError } from '../../types/errors/app-error';
import * as vaultService from '../../services/vault';
import { getVaultPath, readConfig } from '../../store/config/configStore';

function serializeError(err: unknown) {
  if (err instanceof AppError) return { error: true, code: err.code, message: err.message };
  return { error: true, code: 'UNKNOWN_ERROR', message: err instanceof Error ? err.message : String(err) };
}

export function registerVaultHandlers(appDataPath: string): void {
  // RN-086: rebuild references and search index from .md source of truth
  ipcMain.handle('vault:rebuild', async () => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      return await vaultService.rebuildVault(vaultPath);
    } catch (err) {
      return serializeError(err);
    }
  });

  // RN-086: check vault integrity, auto-rebuild if needed
  ipcMain.handle('vault:check', async () => {
    try {
      const vaultPath = await getVaultPath(appDataPath);
      if (!vaultPath) return { error: true, code: 'VAULT_NOT_FOUND', message: 'Vault is not configured' };
      return await vaultService.checkIntegrity(vaultPath);
    } catch (err) {
      return serializeError(err);
    }
  });

  // RN-087: config.json is stored outside vault in OS app-data folder — no vault guard
  ipcMain.handle('app:config', async () => {
    try {
      const config = await readConfig(appDataPath);
      if (!config) return { error: true, code: 'VAULT_NOT_FOUND', message: 'No config found' };
      return { config };
    } catch (err) {
      return serializeError(err);
    }
  });
}
