// Rules covered: RN-050, RN-052, RN-054, RN-086 | ADR-003 (in-memory cache)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadIndex,
  getCache,
  upsertEntry,
  removeEntry,
  rebuildIndex,
  clearCache,
} from './searchIndexStore';
import type { SearchEntry, SearchIndex } from '../../types';

vi.mock('node:fs/promises');

import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

const mockReadFile = vi.mocked(readFile);
const mockWriteFile = vi.mocked(writeFile);
const mockRename = vi.mocked(rename);

const VAULT = '/vault';
const INDEX_PATH = path.join(VAULT, 'search-index.json');
const TMP_PATH = path.join(VAULT, 'search-index.json.tmp');

const ENTRY_A: SearchEntry = {
  id: 'a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0',
  title: 'Como funciona o Electron',
  body_text: 'O Electron combina Chromium e Node.js.',
  category_id: 'b1c2d3e4-5f6a-7b8c-9d0e-f1a2b3c4d5e6',
  updated_at: '2026-03-28T14:30:00Z',
};

const ENTRY_B: SearchEntry = {
  id: 'b4c5d6e7-8c9d-0e1f-2a3b-4c5d6e7f8a9b',
  title: 'Node.js Overview',
  body_text: 'Node.js é um runtime JavaScript.',
  category_id: null,
  updated_at: '2026-03-28T12:00:00Z',
};

const SAMPLE_INDEX: SearchIndex = {
  version: 1,
  updated_at: '2026-03-28T14:30:00Z',
  entries: [ENTRY_A, ENTRY_B],
};

beforeEach(() => {
  vi.resetAllMocks();
  // Reset module-level cache between tests
  clearCache();
});

// ---------------------------------------------------------------------------
describe('loadIndex', () => {
  // Rules: RN-086, ADR-003

  it('should read search-index.json and return the parsed index', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_INDEX) as never);

    // Act
    const index = await loadIndex(VAULT);

    // Assert
    expect(mockReadFile).toHaveBeenCalledWith(INDEX_PATH, 'utf-8');
    expect(index.version).toBe(1);
    expect(index.entries).toHaveLength(2);
  });

  it('should populate the in-memory cache after loading', async () => {
    // Arrange — ADR-003: cache must be loaded on init
    mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_INDEX) as never);

    // Act
    await loadIndex(VAULT);
    const cached = getCache();

    // Assert — cache populated without additional disk read
    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(cached).toHaveLength(2);
  });

  it('should return empty index when search-index.json does not exist', async () => {
    // Arrange — RN-086: missing auxiliary triggers rebuild
    const fsError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    mockReadFile.mockRejectedValue(fsError);

    // Act
    const index = await loadIndex(VAULT);

    // Assert
    expect(index.entries).toEqual([]);
    expect(index.version).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe('getCache', () => {
  // ADR-003: in-memory cache eliminates disk reads during search

  it('should return cached entries without reading from disk', async () => {
    // Arrange — pre-populate cache
    mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_INDEX) as never);
    await loadIndex(VAULT);
    vi.resetAllMocks(); // reset after initial load

    // Act
    const entries = getCache();

    // Assert — no disk read on subsequent access
    expect(mockReadFile).not.toHaveBeenCalled();
    expect(entries).toHaveLength(2);
  });

  it('should return empty array before loadIndex is called', async () => {
    // Arrange — clearCache() was called in beforeEach

    // Act
    const entries = getCache();

    // Assert
    expect(entries).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
describe('upsertEntry', () => {
  // Rules: RN-052 (index updated on save) | ADR-004

  it('should insert a new entry into the cache and persist to disk', async () => {
    // Arrange — start with empty index
    mockReadFile.mockResolvedValue(
      JSON.stringify({ version: 1, updated_at: '', entries: [] }) as never,
    );
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);
    await loadIndex(VAULT);

    // Act
    await upsertEntry(VAULT, ENTRY_A);

    // Assert
    expect(getCache()).toContainEqual(ENTRY_A);
    expect(mockWriteFile).toHaveBeenCalledWith(TMP_PATH, expect.any(String), 'utf-8');
    expect(mockRename).toHaveBeenCalledWith(TMP_PATH, INDEX_PATH);
  });

  it('should update an existing entry when id already exists in cache', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_INDEX) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);
    await loadIndex(VAULT);

    const updatedEntry: SearchEntry = {
      ...ENTRY_A,
      title: 'Electron — Atualizado',
      updated_at: '2026-03-28T16:00:00Z',
    };

    // Act
    await upsertEntry(VAULT, updatedEntry);

    // Assert — only one entry for that id
    const cache = getCache();
    const found = cache.filter((e) => e.id === ENTRY_A.id);
    expect(found).toHaveLength(1);
    expect(found[0].title).toBe('Electron — Atualizado');
  });

  it('should accept an entry with null category_id', async () => {
    // Arrange — RN-031: category is optional
    mockReadFile.mockResolvedValue(
      JSON.stringify({ version: 1, updated_at: '', entries: [] }) as never,
    );
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);
    await loadIndex(VAULT);

    // Act & Assert
    await expect(upsertEntry(VAULT, ENTRY_B)).resolves.toBeUndefined();
    expect(getCache()[0].category_id).toBeNull();
  });
});

// ---------------------------------------------------------------------------
describe('removeEntry', () => {
  // Rules: RN-052 (index updated on delete)

  it('should remove the entry with matching id from cache and persist', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_INDEX) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);
    await loadIndex(VAULT);

    // Act
    await removeEntry(VAULT, ENTRY_A.id);

    // Assert
    const cache = getCache();
    expect(cache).toHaveLength(1);
    expect(cache[0].id).toBe(ENTRY_B.id);
    expect(mockWriteFile).toHaveBeenCalledTimes(1);
  });

  it('should be a no-op when id does not exist in cache', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_INDEX) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);
    await loadIndex(VAULT);

    // Act
    await removeEntry(VAULT, 'non-existent-id');

    // Assert — still 2 entries, but still writes (to keep persistence consistent)
    expect(getCache()).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
describe('rebuildIndex', () => {
  // Rules: RN-086 (auxiliaries reconstructable from .md files)

  it('should replace the entire cache with provided entries and write to disk', async () => {
    // Arrange — pre-populate with old data
    mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_INDEX) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);
    await loadIndex(VAULT);

    const freshEntries: SearchEntry[] = [ENTRY_B]; // only one entry after rebuild

    // Act
    const rebuilt = await rebuildIndex(VAULT, freshEntries);

    // Assert
    expect(rebuilt.entries).toHaveLength(1);
    expect(rebuilt.entries[0].id).toBe(ENTRY_B.id);
    expect(getCache()).toHaveLength(1);
    expect(mockWriteFile).toHaveBeenCalledTimes(1);
  });

  it('should produce a valid index with version field', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    const rebuilt = await rebuildIndex(VAULT, [ENTRY_A]);

    // Assert
    expect(rebuilt.version).toBe(1);
    expect(rebuilt.updated_at).toBeTruthy();
  });

  it('should produce an empty entries list when given empty input', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    const rebuilt = await rebuildIndex(VAULT, []);

    // Assert
    expect(rebuilt.entries).toEqual([]);
    expect(getCache()).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// TODO: E2E — implement once Electron app is running
// describe('searchIndexStore E2E', () => {
//   it('should keep cache consistent with disk after multiple upsert/remove cycles');
//   it('should survive app restart and reload cache from disk on next loadIndex()');
// });
