// Rules covered: RN-081, RN-083, RN-087 | ADR-004
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readConfig, writeConfig, getVaultPath } from './configStore';
import type { Config } from '../../types';

vi.mock('node:fs/promises');

import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

const mockReadFile = vi.mocked(readFile);
const mockWriteFile = vi.mocked(writeFile);
const mockRename = vi.mocked(rename);

// RN-087: config.json lives outside the vault, in OS app-data directory
const APP_DATA = '/home/user/.config/NoteGraph';
const CONFIG_PATH = path.join(APP_DATA, 'config.json');
const TMP_PATH = path.join(APP_DATA, 'config.json.tmp');

const SAMPLE_CONFIG: Config = {
  vault_path: '/home/user/Documents/notegraph-vault',
  app_version: '0.1.0',
  last_opened_at: '2026-03-28T14:30:00Z',
};

beforeEach(() => {
  vi.resetAllMocks();
});

// ---------------------------------------------------------------------------
describe('readConfig', () => {
  // Rules: RN-083, RN-087

  it('should parse and return config from config.json', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_CONFIG) as never);

    // Act
    const config = await readConfig(APP_DATA);

    // Assert
    expect(mockReadFile).toHaveBeenCalledWith(CONFIG_PATH, 'utf-8');
    expect(config).toEqual(SAMPLE_CONFIG);
    expect(config!.vault_path).toBe('/home/user/Documents/notegraph-vault');
  });

  it('should return null when config.json does not exist (first run)', async () => {
    // Arrange — RN-087: first run has no config yet
    const fsError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    mockReadFile.mockRejectedValue(fsError);

    // Act
    const config = await readConfig(APP_DATA);

    // Assert — returns null, does NOT throw (first-run flow)
    expect(config).toBeNull();
  });

  it('should throw when config.json exists but contains malformed JSON', async () => {
    // Arrange
    mockReadFile.mockResolvedValue('{ invalid json' as never);

    // Act & Assert — corrupted config is an error, not a first-run
    await expect(readConfig(APP_DATA)).rejects.toThrow();
  });

  it('should return config with optional last_opened_at undefined', async () => {
    // Arrange — last_opened_at is optional
    const configNoDate: Config = { vault_path: '/some/path', app_version: '0.1.0' };
    mockReadFile.mockResolvedValue(JSON.stringify(configNoDate) as never);

    // Act
    const config = await readConfig(APP_DATA);

    // Assert
    expect(config!.last_opened_at).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
describe('writeConfig', () => {
  // Rules: RN-083, RN-087 | ADR-004

  it('should write config to a .tmp file then rename atomically', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await writeConfig(APP_DATA, SAMPLE_CONFIG);

    // Assert — ADR-004: write-then-rename
    expect(mockWriteFile).toHaveBeenCalledWith(
      TMP_PATH,
      expect.stringContaining('vault_path'),
      'utf-8',
    );
    expect(mockRename).toHaveBeenCalledWith(TMP_PATH, CONFIG_PATH);
  });

  it('should serialize vault_path correctly', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await writeConfig(APP_DATA, SAMPLE_CONFIG);

    // Assert — RN-083: vault_path must be present in output
    const written = mockWriteFile.mock.calls[0][1] as string;
    const parsed: Config = JSON.parse(written);
    expect(parsed.vault_path).toBe(SAMPLE_CONFIG.vault_path);
  });

  it('should persist app_version field', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await writeConfig(APP_DATA, SAMPLE_CONFIG);

    // Assert
    const written = mockWriteFile.mock.calls[0][1] as string;
    const parsed: Config = JSON.parse(written);
    expect(parsed.app_version).toBe('0.1.0');
  });

  it('should propagate FILE_WRITE_ERROR when writeFile fails', async () => {
    // Arrange
    mockWriteFile.mockRejectedValue(new Error('permission denied'));

    // Act & Assert
    await expect(writeConfig(APP_DATA, SAMPLE_CONFIG)).rejects.toMatchObject({
      code: 'FILE_WRITE_ERROR',
    });
  });

  it('should write config with vault path containing spaces', async () => {
    // Arrange — Windows paths like C:\Users\My Name\...
    const configWithSpaces: Config = {
      vault_path: '/Users/My Name/Documents/my vault',
      app_version: '0.1.0',
    };
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await writeConfig(APP_DATA, configWithSpaces);

    // Assert
    const written = mockWriteFile.mock.calls[0][1] as string;
    const parsed: Config = JSON.parse(written);
    expect(parsed.vault_path).toBe('/Users/My Name/Documents/my vault');
  });
});

// ---------------------------------------------------------------------------
describe('getVaultPath', () => {
  // Rules: RN-083, RN-087

  it('should return vault_path from config.json', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_CONFIG) as never);

    // Act
    const vaultPath = await getVaultPath(APP_DATA);

    // Assert
    expect(vaultPath).toBe(SAMPLE_CONFIG.vault_path);
  });

  it('should return null when config.json does not exist', async () => {
    // Arrange — first run: no config yet
    const fsError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    mockReadFile.mockRejectedValue(fsError);

    // Act
    const vaultPath = await getVaultPath(APP_DATA);

    // Assert
    expect(vaultPath).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// TODO: E2E — implement once Electron app is running
// describe('configStore E2E', () => {
//   it('should persist vault_path across app restarts');
//   it('should use Electron app.getPath("userData") as appDataPath');
//   it('should open vault selection dialog when readConfig returns null');
// });
