// Rules covered: RN-011, RN-012, RN-020, RN-023, RN-073 | ADR-004
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  readReferences,
  writeReferences,
  getOutgoingRefs,
  getIncomingRefs,
  markBroken,
  reconnect,
} from './referencesStore';
import type { Reference } from '../../types/references/reference';

vi.mock('node:fs/promises');

import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

const mockReadFile = vi.mocked(readFile);
const mockWriteFile = vi.mocked(writeFile);
const mockRename = vi.mocked(rename);

const VAULT = '/vault';
const REFS_PATH = path.join(VAULT, 'references.json');
const TMP_PATH = path.join(VAULT, 'references.json.tmp');

const SOURCE_ID = 'a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0';
const TARGET_ID = 'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a';

const REF_VALID: Reference = {
  source_id: SOURCE_ID,
  target_id: TARGET_ID,
  target_title: 'Node.js',
  is_broken: false,
  updated_at: '2026-03-28T14:30:00Z',
};

const REF_BROKEN: Reference = {
  source_id: SOURCE_ID,
  target_id: null,
  target_title: 'IPC',
  is_broken: true,
  updated_at: '2026-03-28T14:30:00Z',
};

beforeEach(() => {
  vi.resetAllMocks();
});

// ---------------------------------------------------------------------------
describe('readReferences', () => {
  // Rules: RN-011, RN-020

  it('should parse and return all references from references.json', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_VALID, REF_BROKEN] }) as never,
    );

    // Act
    const refs = await readReferences(VAULT);

    // Assert
    expect(mockReadFile).toHaveBeenCalledWith(REFS_PATH, 'utf-8');
    expect(refs).toHaveLength(2);
    expect(refs[0]).toEqual(REF_VALID);
  });

  it('should return empty array when references.json does not exist', async () => {
    // Arrange — RN-086: missing auxiliary = empty
    const fsError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    mockReadFile.mockRejectedValue(fsError);

    // Act
    const refs = await readReferences(VAULT);

    // Assert
    expect(refs).toEqual([]);
  });

  it('should correctly represent a broken reference (orphan link)', async () => {
    // Arrange — RN-011: broken refs have target_id = null, is_broken = true
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_BROKEN] }) as never,
    );

    // Act
    const refs = await readReferences(VAULT);

    // Assert
    expect(refs[0].target_id).toBeNull();
    expect(refs[0].is_broken).toBe(true);
    expect(refs[0].target_title).toBe('IPC'); // title is preserved
  });
});

// ---------------------------------------------------------------------------
describe('writeReferences', () => {
  // ADR-004: write-then-rename

  it('should write references to a .tmp file then rename atomically', async () => {
    // Arrange
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await writeReferences(VAULT, [REF_VALID]);

    // Assert — ADR-004
    expect(mockWriteFile).toHaveBeenCalledWith(
      TMP_PATH,
      expect.stringContaining(SOURCE_ID),
      'utf-8',
    );
    expect(mockRename).toHaveBeenCalledWith(TMP_PATH, REFS_PATH);
  });

  it('should propagate FILE_WRITE_ERROR when writeFile fails', async () => {
    // Arrange
    mockWriteFile.mockRejectedValue(new Error('disk full'));

    // Act & Assert
    await expect(writeReferences(VAULT, [REF_VALID])).rejects.toMatchObject({
      code: 'FILE_WRITE_ERROR',
    });
  });
});

// ---------------------------------------------------------------------------
describe('getOutgoingRefs', () => {
  // Rules: RN-020, RN-023

  it('should return only references where source_id matches', async () => {
    // Arrange
    const otherId = 'ffffffff-0000-0000-0000-000000000001';
    const refFromOther: Reference = { ...REF_VALID, source_id: otherId };
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_VALID, REF_BROKEN, refFromOther] }) as never,
    );

    // Act
    const refs = await getOutgoingRefs(VAULT, SOURCE_ID);

    // Assert
    expect(refs).toHaveLength(2);
    refs.forEach((r) => expect(r.source_id).toBe(SOURCE_ID));
  });

  it('should return empty array when source has no outgoing refs', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify({ references: [] }) as never);

    // Act
    const refs = await getOutgoingRefs(VAULT, SOURCE_ID);

    // Assert
    expect(refs).toEqual([]);
  });

  it('should treat references as case-sensitive (RN-023)', async () => {
    // Arrange — RN-023: [[Node.js]] and [[node.js]] are different references
    const refLower: Reference = { ...REF_VALID, target_title: 'node.js' };
    const refMixed: Reference = { ...REF_VALID, target_title: 'Node.js' };
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [refLower, refMixed] }) as never,
    );

    // Act
    const refs = await getOutgoingRefs(VAULT, SOURCE_ID);

    // Assert — both exist as separate entries
    expect(refs).toHaveLength(2);
    expect(refs.map((r) => r.target_title)).toContain('node.js');
    expect(refs.map((r) => r.target_title)).toContain('Node.js');
  });
});

// ---------------------------------------------------------------------------
describe('getIncomingRefs', () => {
  // Rules: RN-011

  it('should return only references where target_id matches', async () => {
    // Arrange
    const refToOther: Reference = {
      ...REF_VALID,
      source_id: 'ffffffff-0000-0000-0000-000000000001',
      target_id: 'ffffffff-0000-0000-0000-000000000002',
    };
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_VALID, refToOther] }) as never,
    );

    // Act
    const refs = await getIncomingRefs(VAULT, TARGET_ID);

    // Assert
    expect(refs).toHaveLength(1);
    expect(refs[0].target_id).toBe(TARGET_ID);
  });

  it('should not return broken references when querying by target_id', async () => {
    // Arrange — RN-073: orphan links have no valid target_id
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_BROKEN] }) as never,
    );

    // Act — querying for null target_id should return empty
    const refs = await getIncomingRefs(VAULT, TARGET_ID);

    // Assert
    expect(refs).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
describe('markBroken', () => {
  // Rules: RN-011 (orphan link creation on note delete)

  it('should set target_id to null and is_broken to true for matching refs', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_VALID] }) as never,
    );
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await markBroken(VAULT, TARGET_ID);

    // Assert — RN-011: link becomes orphan
    const written = mockWriteFile.mock.calls[0][1] as string;
    const parsed = JSON.parse(written);
    const updated = parsed.references[0];
    expect(updated.target_id).toBeNull();
    expect(updated.is_broken).toBe(true);
    expect(updated.target_title).toBe('Node.js'); // title is preserved
  });

  it('should not modify references targeting a different note', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_VALID] }) as never,
    );
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    await markBroken(VAULT, 'completely-different-id');

    // Assert
    const written = mockWriteFile.mock.calls[0][1] as string;
    const parsed = JSON.parse(written);
    expect(parsed.references[0].is_broken).toBe(false);
  });

  it('should be a no-op when there are no references to the target', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(JSON.stringify({ references: [] }) as never);
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act & Assert
    await expect(markBroken(VAULT, TARGET_ID)).resolves.toBeUndefined();
    expect(mockWriteFile).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
describe('reconnect', () => {
  // Rules: RN-012 (orphan link re-connects when matching note is created)

  it('should reconnect broken refs whose target_title matches the new note title', async () => {
    // Arrange — RN-012: orphan link auto-reconnects
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_BROKEN] }) as never,
    );
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    const NEW_ID = 'e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0';

    // Act
    const reconnected = await reconnect(VAULT, 'IPC', NEW_ID);

    // Assert
    expect(reconnected).toBe(1);
    const written = mockWriteFile.mock.calls[0][1] as string;
    const parsed = JSON.parse(written);
    const updated = parsed.references[0];
    expect(updated.target_id).toBe(NEW_ID);
    expect(updated.is_broken).toBe(false);
  });

  it('should be case-sensitive when matching orphan target_title', async () => {
    // Arrange — RN-023: [[IPC]] != [[ipc]]
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_BROKEN] }) as never, // target_title = 'IPC'
    );
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act — searching for 'ipc' (lowercase) should NOT reconnect
    const reconnected = await reconnect(VAULT, 'ipc', 'some-id');

    // Assert
    expect(reconnected).toBe(0);
  });

  it('should return 0 when no orphan refs match the title', async () => {
    // Arrange
    mockReadFile.mockResolvedValue(
      JSON.stringify({ references: [REF_VALID] }) as never, // not broken
    );
    mockWriteFile.mockResolvedValue(undefined as never);
    mockRename.mockResolvedValue(undefined as never);

    // Act
    const reconnected = await reconnect(VAULT, 'Node.js', TARGET_ID);

    // Assert
    expect(reconnected).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// TODO: E2E — implement once Electron app is running
// describe('referencesStore E2E', () => {
//   it('should reflect deletions as broken links in the graph payload');
//   it('should auto-reconnect orphan link when a note with matching title is created');
// });
