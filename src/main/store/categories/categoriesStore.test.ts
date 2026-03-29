// Rules covered: RN-030, RN-035, RN-036, RN-040 | ADR-004
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readCategories, writeCategories, addCategory, removeCategory } from './categoriesStore';
import type { Category } from '../../types';

vi.mock('node:fs/promises');

import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

const mockReadFile = vi.mocked(readFile);
const mockWriteFile = vi.mocked(writeFile);
const mockRename = vi.mocked(rename);

const VAULT = '/vault';
const CATEGORIES_PATH = path.join(VAULT, 'categories.json');
const TMP_PATH = path.join(VAULT, 'categories.json.tmp');

const CAT_A: Category = {
  id: 'b1c2d3e4-5f6a-7b8c-9d0e-f1a2b3c4d5e6',
  name: 'Electron',
  color: '#3498DB',
  created_at: '2026-03-28T10:00:00Z',
};

const CAT_B: Category = {
  id: 'c2d3e4f5-6a7b-8c9d-0e1f-a2b3c4d5e6f7',
  name: 'Estudos',
  color: null,
  created_at: '2026-03-28T11:00:00Z',
};

beforeEach(() => {
  vi.resetAllMocks();
});

// ---------------------------------------------------------------------------
describe('readCategories', () => {
  // Rules: RN-030, RN-035

  it('should parse and return all categories from categories.json', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(
      JSON.stringify({ categories: [CAT_A, CAT_B] }) as never,
    );

    // Act
    const categories = await readCategories(VAULT);

    // Assert
    expect(mockReadFile).toHaveBeenCalledWith(CATEGORIES_PATH, 'utf-8');
    expect(categories).toHaveLength(2);
    expect(categories[0]).toEqual(CAT_A);
  });

  it('should return empty array when categories.json does not exist', async () => {
    // Arrange — RN-086: auxiliaries are reconstructable, missing = empty
    const fsError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    mockReadFile.mockRejectedValue(fsError);

    // Act
    const categories = await readCategories(VAULT);

    // Assert
    expect(categories).toEqual([]);
  });

  it('should accept a category with null color', async () => {
    // Arrange — RN-035: color is optional
    mockReadFile.mockResolvedValue(
      JSON.stringify({ categories: [CAT_B] }) as never,
    );

    // Act
    const categories = await readCategories(VAULT);

    // Assert
    expect(categories[0].color).toBeNull();
  });

  it('should return empty array when categories array is empty', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify({ categories: [] }) as never);

    // Act
    const categories = await readCategories(VAULT);

    // Assert
    expect(categories).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
describe('writeCategories', () => {
  // Rules: RN-030 | ADR-004

  it('should write categories as JSON to a .tmp file then rename atomically', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await writeCategories(VAULT, [CAT_A, CAT_B]);

    // Assert — ADR-004: write-then-rename
    expect(mockWriteFile).toHaveBeenCalledWith(
      TMP_PATH,
      expect.stringContaining(CAT_A.id),
      'utf-8',
    );
    expect(mockRename).toHaveBeenCalledWith(TMP_PATH, CATEGORIES_PATH);
  });

  it('should serialize all fields including null color', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await writeCategories(VAULT, [CAT_B]);

    // Assert — RN-035: null color preserved
    const written = mockWriteFile.mock.calls[0][1] as string;
    const parsed = JSON.parse(written);
    expect(parsed.categories[0].color).toBeNull();
  });

  it('should propagate FILE_WRITE_ERROR when writeFile fails', async () => {
    // Arrange
    mockWriteFile.mockRejectedValue(new Error('disk full'));

    // Act & Assert
    await expect(writeCategories(VAULT, [CAT_A])).rejects.toMatchObject({
      code: 'FILE_WRITE_ERROR',
    });
  });
});

// ---------------------------------------------------------------------------
describe('addCategory', () => {
  // Rules: RN-030, RN-036

  it('should append a new category and persist the updated list', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify({ categories: [CAT_A] }) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    const updated = await addCategory(VAULT, CAT_B);

    // Assert
    expect(updated).toHaveLength(2);
    expect(updated).toContainEqual(CAT_B);
    expect(mockWriteFile).toHaveBeenCalledTimes(1);
  });

  it('should allow two categories with the same name (different UUIDs)', async () => {
    // Arrange — RN-030: name uniqueness not required
    const catDuplicate: Category = { ...CAT_A, id: 'deadbeef-0000-0000-0000-000000000001' };
    mockReadFile.mockResolvedValue(JSON.stringify({ categories: [CAT_A] }) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    const updated = await addCategory(VAULT, catDuplicate);

    // Assert
    expect(updated).toHaveLength(2);
    expect(updated[0].name).toBe(updated[1].name);
  });

  it('should allow category name exactly 50 characters (boundary)', async () => {
    // Arrange — RN-036: max name length is 50
    const catAtBoundary: Category = { ...CAT_B, name: 'B'.repeat(50) };
    mockReadFile.mockResolvedValue(JSON.stringify({ categories: [] }) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act & Assert — should not throw
    await expect(addCategory(VAULT, catAtBoundary)).resolves.toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
describe('removeCategory', () => {
  // Rules: RN-040

  it('should remove a category by id and persist the updated list', async () => {
    // Arrange — RN-040: deletion removes category from store
    mockReadFile.mockResolvedValue(JSON.stringify({ categories: [CAT_A, CAT_B] }) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    const updated = await removeCategory(VAULT, CAT_A.id);

    // Assert
    expect(updated).toHaveLength(1);
    expect(updated[0].id).toBe(CAT_B.id);
    expect(mockWriteFile).toHaveBeenCalledTimes(1);
  });

  it('should return unchanged list when id does not exist', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify({ categories: [CAT_A] }) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    const updated = await removeCategory(VAULT, 'non-existent-id');

    // Assert
    expect(updated).toHaveLength(1);
  });

  it('should return empty array when last category is removed', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify({ categories: [CAT_A] }) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    const updated = await removeCategory(VAULT, CAT_A.id);

    // Assert
    expect(updated).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// TODO: E2E — implement once Electron app is running
// describe('categoriesStore E2E', () => {
//   it('should persist categories across app restarts');
//   it('should rebuild categories.json from scratch when file is missing');
// });
