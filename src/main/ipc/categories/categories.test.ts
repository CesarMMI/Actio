// RN-030, RN-031, RN-034, RN-035, RN-036, RN-040, RN-041
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

vi.mock('../../services/categories');
vi.mock('../../store/config/configStore');

import * as categoriesService from '../../services/categories';
import * as configStore from '../../store/config/configStore';
import { registerCategoryHandlers } from './categories';

const mockEvent = {};
const APP_DATA_PATH = '/app/data';
const VAULT_PATH = '/vault';

describe('registerCategoryHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(handlers).forEach(k => delete handlers[k]);
    vi.mocked(configStore.getVaultPath).mockResolvedValue(VAULT_PATH);
    registerCategoryHandlers(APP_DATA_PATH);
  });

  // --- category:list ---
  describe('category:list', () => {
    // RN-030: list all categories
    it('should return { categories } from listCategories', async () => {
      // Arrange
      const mockCategories = [
        { id: 'cat-1', name: 'Electron', color: '#3498DB', created_at: '2026-01-01T00:00:00Z' },
        { id: 'cat-2', name: 'Estudos', color: null, created_at: '2026-01-01T00:00:00Z' },
      ];
      vi.mocked(categoriesService.listCategories).mockResolvedValue(mockCategories);

      // Act
      const result = await handlers['category:list'](mockEvent, {});

      // Assert
      expect(categoriesService.listCategories).toHaveBeenCalledWith(VAULT_PATH);
      expect(result).toEqual({ categories: mockCategories });
    });

    it('should return empty array when no categories exist', async () => {
      // Arrange
      vi.mocked(categoriesService.listCategories).mockResolvedValue([]);

      // Act
      const result = await handlers['category:list'](mockEvent, {});

      // Assert
      expect(result).toEqual({ categories: [] });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['category:list'](mockEvent, {});

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
      expect(categoriesService.listCategories).not.toHaveBeenCalled();
    });
  });

  // --- category:save ---
  describe('category:save', () => {
    // RN-030: create new category (no id → UUID assigned by service)
    it('should return { category } when creating a new category', async () => {
      // Arrange
      const input = { name: 'Dev', color: '#FF0000' };
      const mockCategory = { id: 'new-uuid', name: 'Dev', color: '#FF0000', created_at: '2026-01-01T00:00:00Z' };
      vi.mocked(categoriesService.saveCategory).mockResolvedValue({ category: mockCategory });

      // Act
      const result = await handlers['category:save'](mockEvent, input);

      // Assert
      expect(categoriesService.saveCategory).toHaveBeenCalledWith(VAULT_PATH, input);
      expect(result).toEqual({ category: mockCategory });
    });

    // RN-030: update existing category (with id)
    it('should pass id when updating an existing category', async () => {
      // Arrange
      const input = { id: 'existing-uuid', name: 'Dev Updated', color: '#0000FF' };
      const mockCategory = { id: 'existing-uuid', name: 'Dev Updated', color: '#0000FF', created_at: '2026-01-01T00:00:00Z' };
      vi.mocked(categoriesService.saveCategory).mockResolvedValue({ category: mockCategory });

      // Act
      await handlers['category:save'](mockEvent, input);

      // Assert
      expect(categoriesService.saveCategory).toHaveBeenCalledWith(VAULT_PATH, input);
    });

    // RN-036: name exactly 50 chars is valid boundary
    it('should succeed when name is exactly 50 characters', async () => {
      // Arrange
      const name50 = 'x'.repeat(50);
      const mockCategory = { id: 'uuid', name: name50, color: null, created_at: '2026-01-01T00:00:00Z' };
      vi.mocked(categoriesService.saveCategory).mockResolvedValue({ category: mockCategory });

      // Act
      const result = await handlers['category:save'](mockEvent, { name: name50, color: null });

      // Assert
      expect(result).toEqual({ category: mockCategory });
    });

    // RN-036: name exceeds 50 chars
    it('should return CATEGORY_NAME_TOO_LONG for name with 51 characters', async () => {
      // Arrange
      vi.mocked(categoriesService.saveCategory).mockRejectedValue(
        new AppError('CATEGORY_NAME_TOO_LONG', 'Category name must be 50 characters or fewer'),
      );

      // Act
      const result = await handlers['category:save'](mockEvent, { name: 'x'.repeat(51), color: null });

      // Assert
      expect(result).toEqual({ error: true, code: 'CATEGORY_NAME_TOO_LONG', message: 'Category name must be 50 characters or fewer' });
    });

    // RN-035: color is optional — null is valid
    it('should pass null color through to the service', async () => {
      // Arrange
      const input = { name: 'NoColor', color: null };
      const mockCategory = { id: 'uuid', name: 'NoColor', color: null, created_at: '2026-01-01T00:00:00Z' };
      vi.mocked(categoriesService.saveCategory).mockResolvedValue({ category: mockCategory });

      // Act
      const result = await handlers['category:save'](mockEvent, input);

      // Assert
      expect(categoriesService.saveCategory).toHaveBeenCalledWith(VAULT_PATH, input);
      expect((result as { category: { color: null } }).category.color).toBeNull();
    });

    // RN-030: duplicate names are allowed (two categories can share same name)
    it('should succeed even when name already exists (duplicates allowed)', async () => {
      // Arrange
      const input = { name: 'Electron', color: null }; // duplicate name
      const mockCategory = { id: 'new-uuid-2', name: 'Electron', color: null, created_at: '2026-01-01T00:00:00Z' };
      vi.mocked(categoriesService.saveCategory).mockResolvedValue({ category: mockCategory });

      // Act
      const result = await handlers['category:save'](mockEvent, input);

      // Assert
      expect(result).toEqual({ category: mockCategory });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['category:save'](mockEvent, { name: 'Dev', color: null });

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
    });

    it('should return UNKNOWN_ERROR for unexpected exceptions', async () => {
      // Arrange
      vi.mocked(categoriesService.saveCategory).mockRejectedValue(new Error('disk error'));

      // Act
      const result = await handlers['category:save'](mockEvent, { name: 'Dev', color: null });

      // Assert
      expect(result).toEqual({ error: true, code: 'UNKNOWN_ERROR', message: expect.any(String) });
    });
  });

  // --- category:delete ---
  describe('category:delete', () => {
    // RN-040: delete category and unlink from notes
    it('should return { affected_notes } from deleteCategory', async () => {
      // Arrange
      vi.mocked(categoriesService.deleteCategory).mockResolvedValue({ affected_notes: 5 });

      // Act
      const result = await handlers['category:delete'](mockEvent, { id: 'cat-1' });

      // Assert
      expect(categoriesService.deleteCategory).toHaveBeenCalledWith(VAULT_PATH, 'cat-1');
      expect(result).toEqual({ affected_notes: 5 });
    });

    // RN-040: deleting unused category affects 0 notes
    it('should return affected_notes: 0 when no notes use the category', async () => {
      // Arrange
      vi.mocked(categoriesService.deleteCategory).mockResolvedValue({ affected_notes: 0 });

      // Act
      const result = await handlers['category:delete'](mockEvent, { id: 'cat-unused' });

      // Assert
      expect(result).toEqual({ affected_notes: 0 });
    });

    it('should return VAULT_NOT_FOUND when vault path is null', async () => {
      // Arrange
      vi.mocked(configStore.getVaultPath).mockResolvedValue(null);

      // Act
      const result = await handlers['category:delete'](mockEvent, { id: 'cat-1' });

      // Assert
      expect(result).toEqual({ error: true, code: 'VAULT_NOT_FOUND', message: expect.any(String) });
    });

    it('should return UNKNOWN_ERROR for unexpected exceptions', async () => {
      // Arrange
      vi.mocked(categoriesService.deleteCategory).mockRejectedValue(new Error('write error'));

      // Act
      const result = await handlers['category:delete'](mockEvent, { id: 'cat-1' });

      // Assert
      expect(result).toEqual({ error: true, code: 'UNKNOWN_ERROR', message: expect.any(String) });
    });
  });
});

// TODO: E2E — create category, assign to note, delete category → note.category_id becomes null
