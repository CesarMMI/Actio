// RN-050, RN-051, RN-052, RN-053, RN-054
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

vi.mock('../../services/search');
vi.mock('../../store/config/configStore');

import * as searchService from '../../services/search';
import * as configStore from '../../store/config/configStore';
import { registerSearchHandlers } from './search';

const mockEvent = {};
const APP_DATA_PATH = '/app/data';
const VAULT_PATH = '/vault';

const makeEntry = (id: string, title: string, body_text = '', category_id: string | null = null) => ({
  id,
  title,
  body_text,
  category_id,
  updated_at: '2026-01-01T00:00:00Z',
});

describe('registerSearchHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(handlers).forEach(k => delete handlers[k]);
    vi.mocked(configStore.getVaultPath).mockResolvedValue(VAULT_PATH);
    registerSearchHandlers(APP_DATA_PATH);
  });

  // --- search:query ---
  describe('search:query', () => {
    // RN-050: global search covers titles and bodies
    it('should return { results } for a term matching notes', async () => {
      // Arrange
      const mockResults = [makeEntry('a', 'Electron Basics', 'chromium node.js')];
      vi.mocked(searchService.querySearch).mockResolvedValue({ results: mockResults });

      // Act
      const result = await handlers['search:query'](mockEvent, { term: 'electron' });

      // Assert
      expect(searchService.querySearch).toHaveBeenCalledWith({ term: 'electron' });
      expect(result).toEqual({ results: mockResults });
    });

    // RN-051: optional category_id filter is forwarded to service
    it('should forward category_id filter to querySearch', async () => {
      // Arrange
      const mockResults = [makeEntry('b', 'Note in Category', '', 'cat-uuid')];
      vi.mocked(searchService.querySearch).mockResolvedValue({ results: mockResults });

      // Act
      const result = await handlers['search:query'](mockEvent, { term: 'note', category_id: 'cat-uuid' });

      // Assert
      expect(searchService.querySearch).toHaveBeenCalledWith({ term: 'note', category_id: 'cat-uuid' });
      expect(result).toEqual({ results: mockResults });
    });

    // RN-053: empty string term passes through (no IPC-level validation)
    it('should forward empty term to service without error', async () => {
      // Arrange
      vi.mocked(searchService.querySearch).mockResolvedValue({ results: [] });

      // Act
      const result = await handlers['search:query'](mockEvent, { term: '' });

      // Assert
      expect(searchService.querySearch).toHaveBeenCalledWith({ term: '' });
      expect(result).toEqual({ results: [] });
    });

    // RN-054: results ordered by service — IPC layer preserves order
    it('should return results in the order returned by the service', async () => {
      // Arrange
      const ordered = [
        makeEntry('a', 'Most relevant', 'electron electron electron'),
        makeEntry('b', 'Less relevant', 'electron'),
      ];
      vi.mocked(searchService.querySearch).mockResolvedValue({ results: ordered });

      // Act
      const result = await handlers['search:query'](mockEvent, { term: 'electron' }) as { results: typeof ordered };

      // Assert
      expect(result.results[0].id).toBe('a');
      expect(result.results[1].id).toBe('b');
    });

    // RN-050: no matches returns empty results
    it('should return empty results when no notes match the term', async () => {
      // Arrange
      vi.mocked(searchService.querySearch).mockResolvedValue({ results: [] });

      // Act
      const result = await handlers['search:query'](mockEvent, { term: 'xyzzy-no-match' });

      // Assert
      expect(result).toEqual({ results: [] });
    });

    // RN-055: search is local — vault path is only used to initialize the cache, not per-query
    it('should not pass vaultPath to querySearch (cache-based service)', async () => {
      // Arrange
      vi.mocked(searchService.querySearch).mockResolvedValue({ results: [] });

      // Act
      await handlers['search:query'](mockEvent, { term: 'test' });

      // Assert
      // querySearch takes QuerySearchInput only — no vaultPath argument
      expect(searchService.querySearch).toHaveBeenCalledWith({ term: 'test' });
      expect(searchService.querySearch).not.toHaveBeenCalledWith(VAULT_PATH, expect.anything());
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['search:query'](mockEvent, { term: 'hello' });

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
      expect(searchService.querySearch).not.toHaveBeenCalled();
    });

    it('should return serialized AppError on service failure', async () => {
      // Arrange
      vi.mocked(searchService.querySearch).mockRejectedValue(new AppError('REBUILD_REQUIRED', 'Search index is missing'));

      // Act
      const result = await handlers['search:query'](mockEvent, { term: 'test' });

      // Assert
      expect(result).toEqual({ error: true, code: 'REBUILD_REQUIRED', message: 'Search index is missing' });
    });

    it('should return UNKNOWN_ERROR for unexpected exceptions', async () => {
      // Arrange
      vi.mocked(searchService.querySearch).mockRejectedValue(new Error('memory error'));

      // Act
      const result = await handlers['search:query'](mockEvent, { term: 'test' });

      // Assert
      expect(result).toEqual({ error: true, code: 'UNKNOWN_ERROR', message: expect.any(String) });
    });
  });
});

// TODO: E2E — save note, query by title substring, verify result appears in correct rank order
