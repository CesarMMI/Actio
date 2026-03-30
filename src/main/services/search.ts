// RN-050, RN-051, RN-052, RN-053, RN-054
import * as searchIndexStore from '../store/search/searchIndexStore';
import type { SearchEntry } from '../types/search/search-entry';
import type { QuerySearchInput } from '../types/search/query-search-input';
import type { QuerySearchResult } from '../types/search/query-search-result';

// RN-050: count occurrences of term in combined title + body_text
function countOccurrences(entry: SearchEntry, lower: string): number {
  const haystack = (entry.title + ' ' + entry.body_text).toLowerCase();
  return haystack.split(lower).length - 1;
}

// RN-050, RN-051, RN-053, RN-054: search in-memory cache with filtering and ranking
export async function querySearch(input: QuerySearchInput): Promise<QuerySearchResult> {
  const entries = searchIndexStore.getCache();
  const lower = input.term.toLowerCase();

  // RN-050: case-insensitive substring match in title or body_text
  let matched = entries.filter(e =>
    e.title.toLowerCase().includes(lower) || e.body_text.toLowerCase().includes(lower),
  );

  // RN-051: optional category filter
  if (input.category_id !== undefined) {
    matched = matched.filter(e => e.category_id === input.category_id);
  }

  // RN-054: sort by occurrence count desc, then updated_at desc
  matched.sort((a, b) => {
    const countDiff = countOccurrences(b, lower) - countOccurrences(a, lower);
    if (countDiff !== 0) return countDiff;
    return b.updated_at.localeCompare(a.updated_at);
  });

  return { results: matched };
}
