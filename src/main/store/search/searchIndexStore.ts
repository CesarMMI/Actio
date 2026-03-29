// Rules: RN-050, RN-052, RN-054, RN-086 | ADR-003 (in-memory cache), ADR-004
import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import type { SearchEntry, SearchIndex } from '../../types';
import { AppError } from '../../types';

const FILENAME = 'search-index.json';

// ADR-003: module-level in-memory cache eliminates disk reads during search
let _cache: SearchEntry[] = [];

/** For testing only — resets the module-level cache */
export function clearCache(): void {
  _cache = [];
}

// ADR-003: return cached entries without disk read
export function getCache(): SearchEntry[] {
  return _cache;
}

async function writeIndex(vaultPath: string): Promise<void> {
  const tmpPath = path.join(vaultPath, `${FILENAME}.tmp`);
  const finalPath = path.join(vaultPath, FILENAME);
  const index: SearchIndex = {
    version: 1,
    updated_at: new Date().toISOString(),
    entries: _cache,
  };
  try {
    await writeFile(tmpPath, JSON.stringify(index, null, 2), 'utf-8');
  } catch {
    throw new AppError('FILE_WRITE_ERROR', 'Failed to write search index');
  }
  await rename(tmpPath, finalPath);
}

// RN-086, ADR-003: load index from disk and populate cache; missing file = empty index
export async function loadIndex(vaultPath: string): Promise<SearchIndex> {
  try {
    const content = await readFile(path.join(vaultPath, FILENAME), 'utf-8');
    const parsed = JSON.parse(content as unknown as string) as SearchIndex;
    _cache = parsed.entries;
    return parsed;
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') {
      _cache = [];
      return { version: 1, updated_at: '', entries: [] };
    }
    throw err;
  }
}

// RN-052: upsert entry into cache and persist to disk
export async function upsertEntry(vaultPath: string, entry: SearchEntry): Promise<void> {
  const idx = _cache.findIndex((e) => e.id === entry.id);
  if (idx !== -1) {
    _cache[idx] = entry;
  } else {
    _cache.push(entry);
  }
  await writeIndex(vaultPath);
}

// RN-052: remove entry from cache and persist (always writes for consistency)
export async function removeEntry(vaultPath: string, id: string): Promise<void> {
  _cache = _cache.filter((e) => e.id !== id);
  await writeIndex(vaultPath);
}

// RN-086: rebuild index from scratch, replacing cache entirely
export async function rebuildIndex(vaultPath: string, entries: SearchEntry[]): Promise<SearchIndex> {
  _cache = entries;
  await writeIndex(vaultPath);
  return { version: 1, updated_at: new Date().toISOString(), entries: _cache };
}
