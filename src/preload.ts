// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import type { SaveNoteInput } from './main/types/notes/save-note-input';
import type { SaveCategoryInput } from './main/types/categories/save-category-input';
import type { QuerySearchInput } from './main/types/search/query-search-input';

contextBridge.exposeInMainWorld('api', {
  notes: {
    list: () => ipcRenderer.invoke('note:list'),
    get: (id: string) => ipcRenderer.invoke('note:get', { id }),
    save: (input: SaveNoteInput) => ipcRenderer.invoke('note:save', input),
    delete: (id: string) => ipcRenderer.invoke('note:delete', { id }),
    deleteConfirm: (id: string) => ipcRenderer.invoke('note:delete:confirm', { id }),
    rename: (input: { id: string; title: string }) => ipcRenderer.invoke('note:rename', input),
  },
  categories: {
    list: () => ipcRenderer.invoke('category:list'),
    save: (input: SaveCategoryInput) => ipcRenderer.invoke('category:save', input),
    delete: (id: string) => ipcRenderer.invoke('category:delete', { id }),
  },
  search: {
    query: (input: QuerySearchInput) => ipcRenderer.invoke('search:query', input),
  },
  graph: {
    data: () => ipcRenderer.invoke('graph:data'),
  },
  vault: {
    rebuild: () => ipcRenderer.invoke('vault:rebuild'),
    check: () => ipcRenderer.invoke('vault:check'),
    config: () => ipcRenderer.invoke('app:config'),
  },
});
