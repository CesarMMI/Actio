export interface Note {
  id: string;            // UUID v4 — also the filename (<id>.md)
  title: string;         // max 50 chars, no [ or ] (RN-003, RN-004)
  body: string;          // Markdown body, may be empty (RN-002)
  category_id: string | null;  // UUID of associated category, or null (RN-031)
  created_at: string;    // ISO 8601 UTC
  updated_at: string;    // ISO 8601 UTC
}

export type NoteIndex = Omit<Note, 'body'>;

export interface Category {
  id: string;            // UUID v4 (RN-030)
  name: string;          // max 50 chars (RN-036)
  color: string | null;  // hex e.g. #3498DB, or null (RN-035)
  created_at: string;    // ISO 8601 UTC
}

export interface Reference {
  source_id: string;
  target_id: string | null;  // null when broken (RN-011)
  target_title: string;       // preserved even when broken
  is_broken: boolean;
  updated_at: string;         // ISO 8601 UTC
}

export interface SearchEntry {
  id: string;
  title: string;
  body_text: string;          // markdown-stripped body
  category_id: string | null;
  updated_at: string;         // ISO 8601 UTC
}

export interface SearchIndex {
  version: number;
  updated_at: string;
  entries: SearchEntry[];
}

export interface Config {
  vault_path: string;   // absolute path to vault folder (RN-087)
  app_version: string;  // semver
  last_opened_at?: string;
}

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
