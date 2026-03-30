// RN-080, RN-081, RN-083, RN-086, RN-087
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

vi.mock('../../services/vault');
vi.mock('../../store/config/configStore');

import * as vaultService from '../../services/vault';
import * as configStore from '../../store/config/configStore';
import { registerVaultHandlers } from './vault';

const mockEvent = {};
const APP_DATA_PATH = '/app/data';
const VAULT_PATH = '/vault';

describe('registerVaultHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(handlers).forEach(k => delete handlers[k]);
    vi.mocked(configStore.getVaultPath).mockResolvedValue(VAULT_PATH);
    registerVaultHandlers(APP_DATA_PATH);
  });

  // --- vault:rebuild ---
  describe('vault:rebuild', () => {
    // RN-086: rebuild derives references and search index from .md source of truth
    it('should return { rebuilt: true } from rebuildVault', async () => {
      // Arrange
      vi.mocked(vaultService.rebuildVault).mockResolvedValue({ rebuilt: true });

      // Act
      const result = await handlers['vault:rebuild'](mockEvent, {});

      // Assert
      expect(vaultService.rebuildVault).toHaveBeenCalledWith(VAULT_PATH);
      expect(result).toEqual({ rebuilt: true });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['vault:rebuild'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
      expect(vaultService.rebuildVault).not.toHaveBeenCalled();
    });

    it('should return serialized AppError on rebuild failure', async () => {
      // Arrange
      vi.mocked(vaultService.rebuildVault).mockRejectedValue(new AppError('FILE_WRITE_ERROR', 'Cannot write to vault'));

      // Act
      const result = await handlers['vault:rebuild'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'FILE_WRITE_ERROR', message: 'Cannot write to vault' });
    });

    it('should return UNKNOWN_ERROR for unexpected exceptions', async () => {
      // Arrange
      vi.mocked(vaultService.rebuildVault).mockRejectedValue(new Error('permission denied'));

      // Act
      const result = await handlers['vault:rebuild'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'UNKNOWN_ERROR', message: expect.any(String) });
    });
  });

  // --- vault:check ---
  describe('vault:check', () => {
    // RN-086: integrity check passes without rebuild when index is current
    it('should return { ok: true, rebuilt: false } when vault is intact', async () => {
      // Arrange
      vi.mocked(vaultService.checkIntegrity).mockResolvedValue({ ok: true, rebuilt: false });

      // Act
      const result = await handlers['vault:check'](mockEvent, {});

      // Assert
      expect(vaultService.checkIntegrity).toHaveBeenCalledWith(VAULT_PATH);
      expect(result).toEqual({ ok: true, rebuilt: false });
    });

    // RN-086: auto-rebuild when notes exist but search cache is empty
    it('should return { ok: true, rebuilt: true } when auto-rebuild was triggered', async () => {
      // Arrange
      vi.mocked(vaultService.checkIntegrity).mockResolvedValue({ ok: true, rebuilt: true });

      // Act
      const result = await handlers['vault:check'](mockEvent, {});

      // Assert
      expect(result).toEqual({ ok: true, rebuilt: true });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['vault:check'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
      expect(vaultService.checkIntegrity).not.toHaveBeenCalled();
    });

    it('should return UNKNOWN_ERROR for unexpected exceptions', async () => {
      // Arrange
      vi.mocked(vaultService.checkIntegrity).mockRejectedValue(new Error('corrupt fs'));

      // Act
      const result = await handlers['vault:check'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'UNKNOWN_ERROR', message: expect.any(String) });
    });
  });

  // --- app:config ---
  describe('app:config', () => {
    // RN-087: config.json stored outside vault in OS app-data folder
    it('should return { config } from readConfig', async () => {
      // Arrange
      const mockConfig = { vault_path: VAULT_PATH, app_version: '0.1.0', last_opened_at: '2026-01-01T00:00:00Z' };
      vi.mocked(configStore.readConfig).mockResolvedValue(mockConfig);

      // Act
      const result = await handlers['app:config'](mockEvent, {});

      // Assert
      expect(configStore.readConfig).toHaveBeenCalledWith(APP_DATA_PATH);
      expect(result).toEqual({ config: mockConfig });
    });

    // RN-081: first run — config.json does not exist yet
    it('should return VAULT_NOT_FOUND when config is null (first run)', async () => {
      // Arrange
      vi.mocked(configStore.readConfig).mockResolvedValue(null);

      // Act
      const result = await handlers['app:config'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
    });

    it('should return UNKNOWN_ERROR for unexpected exceptions', async () => {
      // Arrange
      vi.mocked(configStore.readConfig).mockRejectedValue(new Error('read error'));

      // Act
      const result = await handlers['app:config'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'UNKNOWN_ERROR', message: expect.any(String) });
    });

    // RN-087: app:config reads from appDataPath, not vaultPath
    it('should read config using appDataPath regardless of vault state', async () => {
      // Arrange — even when getVaultPath returns null, app:config reads config directly
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);
      const mockConfig = { vault_path: '/some/path', app_version: '0.1.0' };
      vi.mocked(configStore.readConfig).mockResolvedValue(mockConfig);

      // Act
      const result = await handlers['app:config'](mockEvent, {});

      // Assert
      // app:config does NOT require vault to be configured — it just reads the config file
      expect(configStore.readConfig).toHaveBeenCalledWith(APP_DATA_PATH);
      expect(result).toEqual({ config: mockConfig });
    });
  });
});

// TODO: E2E — fresh app start with no config.json returns VAULT_NOT_FOUND, user picks vault, subsequent app:config returns correct vault_path
// TODO: E2E — vault:check on corrupted search-index.json triggers rebuild and returns rebuilt: true
