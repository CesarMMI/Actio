// RN-030, RN-035, RN-036, RN-040, RN-041
import * as categoriesStore from '../store/categories/categoriesStore';
import * as notesStore from '../store/notes/notesStore';
import { AppError } from '../types/errors/app-error';
import type { Category } from '../types/categories/category';
import type { SaveCategoryInput } from '../types/categories/save-category-input';

// RN-030: list all categories
export async function listCategories(vaultPath: string): Promise<Category[]> {
  return categoriesStore.readCategories(vaultPath);
}

// RN-030, RN-035, RN-036: create or update a category
export async function saveCategory(vaultPath: string, input: SaveCategoryInput): Promise<{ category: Category }> {
  // RN-036: name length validation
  if (input.name.length > 50) throw new AppError('CATEGORY_NAME_TOO_LONG', 'Category name must be 50 characters or fewer');

  if (input.id !== undefined) {
    // Update existing category
    const cats = await categoriesStore.readCategories(vaultPath);
    const updated = cats.map(c => c.id === input.id ? { ...c, name: input.name, color: input.color } : c);
    await categoriesStore.writeCategories(vaultPath, updated);
    const category = updated.find(c => c.id === input.id) as Category;
    return { category };
  }

  // Create new category (RN-030: duplicate names allowed, distinguished by UUID)
  const now = new Date().toISOString();
  const category: Category = { id: crypto.randomUUID(), name: input.name, color: input.color, created_at: now };
  await categoriesStore.addCategory(vaultPath, category);
  return { category };
}

// RN-040: delete category and unlink from all notes that use it
export async function deleteCategory(vaultPath: string, id: string): Promise<{ affected_notes: number }> {
  const notes = await notesStore.listNotes(vaultPath);
  const affected = notes.filter(n => n.category_id === id);

  await Promise.all(
    affected.map(async n => {
      const note = await notesStore.readNote(vaultPath, n.id);
      await notesStore.writeNote(vaultPath, { ...note, category_id: null });
    }),
  );

  await categoriesStore.removeCategory(vaultPath, id);
  return { affected_notes: affected.length };
}
