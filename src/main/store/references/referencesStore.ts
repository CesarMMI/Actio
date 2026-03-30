// Rules: RN-011, RN-012, RN-020, RN-023, RN-073 | ADR-004
import { readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { AppError } from '../../types/errors/app-error';
import type { Reference } from '../../types/references/reference';

const FILENAME = 'references.json';

// RN-011, RN-020: read references; missing file = empty list
export async function readReferences(vaultPath: string): Promise<Reference[]> {
  try {
    const content = await readFile(path.join(vaultPath, FILENAME), 'utf-8');
    const parsed = JSON.parse(content as unknown as string) as { references: Reference[] };
    return parsed.references;
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') return [];
    throw err;
  }
}

// ADR-004: atomic write-then-rename
export async function writeReferences(vaultPath: string, refs: Reference[]): Promise<void> {
  const tmpPath = path.join(vaultPath, `${FILENAME}.tmp`);
  const finalPath = path.join(vaultPath, FILENAME);
  const content = JSON.stringify({ references: refs }, null, 2);
  try {
    await writeFile(tmpPath, content, 'utf-8');
  } catch {
    throw new AppError('FILE_WRITE_ERROR', 'Failed to write references');
  }
  await rename(tmpPath, finalPath);
}

// RN-020, RN-023: filter references where source_id matches (case-sensitive)
export async function getOutgoingRefs(vaultPath: string, sourceId: string): Promise<Reference[]> {
  const refs = await readReferences(vaultPath);
  return refs.filter((r) => r.source_id === sourceId);
}

// RN-011, RN-073: filter references where target_id matches (null targets won't match a real id)
export async function getIncomingRefs(vaultPath: string, targetId: string): Promise<Reference[]> {
  const refs = await readReferences(vaultPath);
  return refs.filter((r) => r.target_id === targetId);
}

// RN-011: when a note is deleted, mark all references pointing to it as broken (orphan links)
export async function markBroken(vaultPath: string, targetId: string): Promise<void> {
  const refs = await readReferences(vaultPath);
  const updated = refs.map((r) =>
    r.target_id === targetId
      ? { ...r, target_id: null, is_broken: true }
      : r,
  );
  await writeReferences(vaultPath, updated);
}

// RN-012, RN-023: reconnect orphan links whose target_title matches (case-sensitive)
export async function reconnect(
  vaultPath: string,
  targetTitle: string,
  newTargetId: string,
): Promise<number> {
  const refs = await readReferences(vaultPath);
  let count = 0;
  const updated = refs.map((r) => {
    if (r.is_broken && r.target_title === targetTitle) {
      count++;
      return { ...r, target_id: newTargetId, is_broken: false };
    }
    return r;
  });
  await writeReferences(vaultPath, updated);
  return count;
}
