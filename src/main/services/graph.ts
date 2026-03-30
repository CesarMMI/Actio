// RN-060, RN-061, RN-062, RN-063, RN-073
import * as searchIndexStore from '../store/search/searchIndexStore';
import * as categoriesStore from '../store/categories/categoriesStore';
import * as referencesStore from '../store/references/referencesStore';
import type { GraphData } from '../types/graph/graph-data';
import type { GraphNode } from '../types/graph/graph-node';
import type { GraphEdge } from '../types/graph/graph-edge';

// RN-060, RN-061, RN-062, RN-063, RN-073: build graph of notes and categories with edges
export async function getGraphData(vaultPath: string): Promise<GraphData> {
  const entries = searchIndexStore.getCache();
  const cats = await categoriesStore.readCategories(vaultPath);
  const refs = await referencesStore.readReferences(vaultPath);

  // RN-060: one node per note
  const noteNodes: GraphNode[] = entries.map(e => ({ id: e.id, label: e.title, type: 'note' }));

  // RN-061: one node per category
  const catNodes: GraphNode[] = cats.map(c => ({ id: c.id, label: c.name, type: 'category' }));

  const nodes = [...noteNodes, ...catNodes];

  // RN-062, RN-073: edges for non-broken note→note references only
  const refEdges: GraphEdge[] = refs
    .filter(r => !r.is_broken)
    .map(r => ({ source: r.source_id, target: r.target_id as string }));

  // RN-062: edges for note→category relationships
  const catEdges: GraphEdge[] = entries
    .filter(e => e.category_id !== null)
    .map(e => ({ source: e.id, target: e.category_id as string }));

  const edges = [...refEdges, ...catEdges];

  return { nodes, edges };
}
