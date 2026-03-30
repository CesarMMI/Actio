export type Category = {
  id: string;            // UUID v4 (RN-030)
  name: string;          // max 50 chars (RN-036)
  color: string | null;  // hex e.g. #3498DB, or null (RN-035)
  created_at: string;    // ISO 8601 UTC
};
