import type { SearchEntry } from './search-entry';

export type SearchIndex = {
  version: number;
  updated_at: string;
  entries: SearchEntry[];
};
