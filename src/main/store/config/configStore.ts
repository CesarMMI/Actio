// Rules: RN-081, RN-083, RN-087 | ADR-004
import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import type { Config } from '../../types';
import { AppError } from '../../types';

const FILENAME = 'config.json';

// RN-083, RN-087: read config from app-data dir; returns null on first run (ENOENT), re-throws on malformed JSON
export async function readConfig(appDataPath: string): Promise<Config | null> {
  try {
    const content = await readFile(path.join(appDataPath, FILENAME), 'utf-8');
    return JSON.parse(content as unknown as string) as Config;
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') return null;
    throw err;
  }
}

// RN-083, RN-087 | ADR-004: atomic write-then-rename
export async function writeConfig(appDataPath: string, config: Config): Promise<void> {
  const tmpPath = path.join(appDataPath, `${FILENAME}.tmp`);
  const finalPath = path.join(appDataPath, FILENAME);
  const content = JSON.stringify(config, null, 2);
  try {
    await writeFile(tmpPath, content, 'utf-8');
  } catch {
    throw new AppError('FILE_WRITE_ERROR', 'Failed to write config');
  }
  await rename(tmpPath, finalPath);
}

// RN-083: convenience accessor for vault_path
export async function getVaultPath(appDataPath: string): Promise<string | null> {
  const config = await readConfig(appDataPath);
  return config?.vault_path ?? null;
}
