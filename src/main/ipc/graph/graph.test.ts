// RN-060, RN-061, RN-062, RN-063, RN-064, RN-073
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

vi.mock('../../services/graph');
vi.mock('../../store/config/configStore');

import * as graphService from '../../services/graph';
import * as configStore from '../../store/config/configStore';
import { registerGraphHandlers } from './graph';

const mockEvent = {};
const APP_DATA_PATH = '/app/data';
const VAULT_PATH = '/vault';

describe('registerGraphHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(handlers).forEach(k => delete handlers[k]);
    vi.mocked(configStore.getVaultPath).mockResolvedValue(VAULT_PATH);
    registerGraphHandlers(APP_DATA_PATH);
  });

  // --- graph:data ---
  describe('graph:data', () => {
    // RN-060, RN-061: nodes include both note nodes and category nodes
    it('should return { nodes, edges } from getGraphData', async () => {
      // Arrange
      const mockData = {
        nodes: [
          { id: 'note-1', label: 'Electron Basics', type: 'note' as const },
          { id: 'cat-1', label: 'Dev', type: 'category' as const },
        ],
        edges: [
          { source: 'note-1', target: 'cat-1' },
        ],
      };
      vi.mocked(graphService.getGraphData).mockResolvedValue(mockData);

      // Act
      const result = await handlers['graph:data'](mockEvent, {});

      // Assert
      expect(graphService.getGraphData).toHaveBeenCalledWith(VAULT_PATH);
      expect(result).toEqual(mockData);
    });

    // RN-063: isolated notes (no edges) appear in nodes list
    it('should include isolated note nodes with no edges', async () => {
      // Arrange
      const mockData = {
        nodes: [
          { id: 'isolated', label: 'Orphan Note', type: 'note' as const },
        ],
        edges: [],
      };
      vi.mocked(graphService.getGraphData).mockResolvedValue(mockData);

      // Act
      const result = await handlers['graph:data'](mockEvent, {}) as typeof mockData;

      // Assert
      expect(result.nodes).toHaveLength(1);
      expect(result.edges).toHaveLength(0);
      expect(result.nodes[0].id).toBe('isolated');
    });

    // RN-073: broken references do not produce edges
    it('should return empty edges when all references are broken', async () => {
      // Arrange
      const mockData = {
        nodes: [{ id: 'note-1', label: 'Note', type: 'note' as const }],
        edges: [], // broken refs excluded by service
      };
      vi.mocked(graphService.getGraphData).mockResolvedValue(mockData);

      // Act
      const result = await handlers['graph:data'](mockEvent, {}) as typeof mockData;

      // Assert
      expect(result.edges).toHaveLength(0);
    });

    // RN-062: both note→note and note→category edges are included
    it('should include both note-to-note and note-to-category edges', async () => {
      // Arrange
      const mockData = {
        nodes: [
          { id: 'note-1', label: 'Note 1', type: 'note' as const },
          { id: 'note-2', label: 'Note 2', type: 'note' as const },
          { id: 'cat-1', label: 'Category', type: 'category' as const },
        ],
        edges: [
          { source: 'note-1', target: 'note-2' },  // note→note via [[...]]
          { source: 'note-1', target: 'cat-1' },   // note→category via category_id
        ],
      };
      vi.mocked(graphService.getGraphData).mockResolvedValue(mockData);

      // Act
      const result = await handlers['graph:data'](mockEvent, {}) as typeof mockData;

      // Assert
      expect(result.edges).toHaveLength(2);
    });

    // Empty vault
    it('should return empty nodes and edges for an empty vault', async () => {
      // Arrange
      vi.mocked(graphService.getGraphData).mockResolvedValue({ nodes: [], edges: [] });

      // Act
      const result = await handlers['graph:data'](mockEvent, {}) as { nodes: unknown[]; edges: unknown[] };

      // Assert
      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['graph:data'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
      expect(graphService.getGraphData).not.toHaveBeenCalled();
    });

    it('should return serialized AppError on service failure', async () => {
      // Arrange
      vi.mocked(graphService.getGraphData).mockRejectedValue(new AppError('FILE_WRITE_ERROR', 'Could not read references'));

      // Act
      const result = await handlers['graph:data'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'FILE_WRITE_ERROR', message: 'Could not read references' });
    });

    it('should return UNKNOWN_ERROR for unexpected exceptions', async () => {
      // Arrange
      vi.mocked(graphService.getGraphData).mockRejectedValue(new Error('unexpected'));

      // Act
      const result = await handlers['graph:data'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'UNKNOWN_ERROR', message: expect.any(String) });
    });
  });
});

// TODO: E2E — save two notes with [[reference]], call graph:data, verify edge exists between them
// TODO: E2E — delete target note, call graph:data, verify edge is removed (broken ref excluded)
