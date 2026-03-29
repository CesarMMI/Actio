// Rules: RN-030, RN-035, RN-036, RN-040 | ADR-004
import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import type { Category } from '../../types';
import { AppError } from '../../types';

const FILENAME = 'categories.json';

// RN-030, RN-035: read categories from categories.json; missing file = empty list
export async function readCategories(vaultPath: string): Promise<Category[]> {
  try {
    const content = await readFile(path.join(vaultPath, FILENAME), 'utf-8');
    const parsed = JSON.parse(content as unknown as string) as { categories: Category[] };
    return parsed.categories;
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') return [];
    throw err;
  }
}

// RN-030 | ADR-004: atomic write-then-rename
export async function writeCategories(vaultPath: string, categories: Category[]): Promise<void> {
  const tmpPath = path.join(vaultPath, `${FILENAME}.tmp`);
  const finalPath = path.join(vaultPath, FILENAME);
  const content = JSON.stringify({ categories }, null, 2);
  try {
    await writeFile(tmpPath, content, 'utf-8');
  } catch {
    throw new AppError('FILE_WRITE_ERROR', 'Failed to write categories');
  }
  await rename(tmpPath, finalPath);
}

// RN-030, RN-036: append a category and persist
export async function addCategory(vaultPath: string, category: Category): Promise<Category[]> {
  const current = await readCategories(vaultPath);
  const updated = [...current, category];
  await writeCategories(vaultPath, updated);
  return updated;
}

// RN-040: remove a category by id and persist
export async function removeCategory(vaultPath: string, id: string): Promise<Category[]> {
  const current = await readCategories(vaultPath);
  const updated = current.filter((c) => c.id !== id);
  await writeCategories(vaultPath, updated);
  return updated;
}
