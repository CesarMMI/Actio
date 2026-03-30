export type Note = {
  id: string;            // UUID v4 — also the filename (<id>.md)
  title: string;         // max 50 chars, no [ or ] (RN-003, RN-004)
  body: string;          // Markdown body, may be empty (RN-002)
  category_id: string | null;  // UUID of associated category, or null (RN-031)
  created_at: string;    // ISO 8601 UTC
  updated_at: string;    // ISO 8601 UTC
};
