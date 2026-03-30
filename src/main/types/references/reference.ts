export type Reference = {
  source_id: string;
  target_id: string | null;  // null when broken (RN-011)
  target_title: string;       // preserved even when broken
  is_broken: boolean;
  updated_at: string;         // ISO 8601 UTC
};
