export type SearchEntry = {
  id: string;
  title: string;
  body_text: string;          // markdown-stripped body
  category_id: string | null;
  updated_at: string;         // ISO 8601 UTC
};
