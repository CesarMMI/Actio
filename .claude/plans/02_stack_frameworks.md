# NoteGraph

**Stack & Frameworks**

*Documento Satélite — NoteGraph*

| Campo | Detalhe |
|---|---|
| Versão | 1.0 — Inicial |
| Status | Preenchido |
| Referência | Master PRD v2.0 + Arquitetura Técnica v1.0 |
| Responsável | Solo founder |
| Data | 28/03/2026 |

> 💡 Este documento registra todas as tecnologias escolhidas, suas versões, justificativas e padrões de uso. Deve ser consultado antes de adicionar qualquer nova dependência ao projeto.

---

## 1. Visão Geral da Stack

| Camada | Tecnologia | Versão mínima | Status |
|---|---|---|---|
| Plataforma desktop | Electron | 29+ | ✅ Decidido |
| Toolchain | Electron Forge + plugin Vite | Forge 7+ / Vite 5+ | ✅ Decidido |
| Linguagem | TypeScript | 5+ | ✅ Decidido |
| UI framework | React | 18+ | ✅ Decidido |
| Editor de Markdown | CodeMirror 6 | 6+ | ✅ Decidido |
| Visualização de grafo | Cytoscape.js | 3+ | ✅ Decidido |
| Testes | Vitest | 1+ | ✅ Decidido |
| Estilização | A definir | — | ✏ Pendente |
| Gerenciador de estado | A definir | — | ✏ Pendente |

---

## 2. Plataforma e Toolchain

### 2.1 Electron

**Escolha:** Electron 29+

**Justificativa:** Permite construir um app desktop multiplataforma (Windows, macOS, Linux) usando tecnologias web. Acesso direto ao sistema de arquivos via Node.js no Main Process, sem necessidade de servidor. Alinha com a decisão de armazenamento local em arquivos `.md` (RN-081, RN-087).

**Configuração obrigatória:**

```typescript
// main/index.ts — BrowserWindow
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,      // obrigatório — segurança (ADR-001)
    nodeIntegration: false,      // obrigatório — segurança (ADR-001)
    preload: path.join(__dirname, 'preload.js'),
  }
});
```

```typescript
// preload.ts — expõe API ao Renderer via contextBridge
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  invoke: (channel: string, payload?: unknown) =>
    ipcRenderer.invoke(channel, payload),
});
```

> ⚠ `contextIsolation: true` e `nodeIntegration: false` são não-negociáveis. Nunca desabilitar, mesmo em desenvolvimento.

### 2.2 Electron Forge + Vite

**Escolha:** Electron Forge 7+ com `@electron-forge/plugin-vite`

**Justificativa:** Setup oficial e mantido pelo time do Electron. Já configura Main Process e Renderer como targets Vite separados, com HMR (Hot Module Replacement) no desenvolvimento. Elimina configuração manual de build — especialmente importante em um projeto solo com prazo curto.

**Inicialização do projeto:**

```bash
npm create electron-app@latest notegraph -- --template=vite-typescript
```

**Estrutura gerada:**

```
notegraph/
├── forge.config.ts        ← configuração do Electron Forge
├── vite.main.config.ts    ← config Vite para o Main Process
├── vite.renderer.config.ts← config Vite para o Renderer
├── src/
│   ├── main.ts            ← entry point do Main
│   ├── preload.ts         ← contextBridge
│   └── renderer.tsx       ← entry point do Renderer (React)
```

### 2.3 TypeScript

**Escolha:** TypeScript 5+

**Justificativa:** Tipagem estática reduz bugs em runtime, especialmente nos contratos IPC (payload/resposta) e na manipulação dos arquivos JSON do vault. Essencial para um projeto solo onde não há revisão de código por pares.

**Tipos compartilhados entre Main e Renderer:**

```typescript
// src/types/index.ts — importado por Main e Renderer
export interface Note {
  id: string;
  title: string;
  body: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
}

export interface Reference {
  source_id: string;
  target_id: string | null;
  target_title: string;
  is_broken: boolean;
  updated_at: string;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  category_id: string | null;
  updated_at: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'note' | 'category';
  color?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'reference' | 'category';
}

export interface IpcError {
  error: true;
  code: string;
  message: string;
}
```

---

## 3. Renderer (UI)

### 3.1 React

**Escolha:** React 18+

**Justificativa:** Ecossistema amplo, familiaridade comum entre devs, excelente integração com CodeMirror 6 e Cytoscape.js via wrappers. Concurrent Mode do React 18 melhora responsividade durante operações de busca com debounce.

**Padrões de uso:**

- Componentes funcionais com hooks — sem componentes de classe
- Estado local com `useState` e `useReducer`
- Efeitos colaterais com `useEffect`
- Chamadas IPC encapsuladas em custom hooks (ex: `useNotes`, `useSearch`, `useGraph`)
- Nenhuma chamada direta a `window.api.invoke` fora dos hooks

**Exemplo de hook IPC:**

```typescript
// renderer/hooks/useNotes.ts
import { useState, useCallback } from 'react';
import { Note } from '../../types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  const loadNotes = useCallback(async () => {
    const result = await window.api.invoke('note:list');
    if (!result.error) setNotes(result.notes);
  }, []);

  const saveNote = useCallback(async (payload: Partial<Note>) => {
    return window.api.invoke('note:save', payload);
  }, []);

  return { notes, loadNotes, saveNote };
}
```

### 3.2 Estilização

**Status:** ✏ A definir

**Opções recomendadas:**

| Opção | Prós | Contras |
|---|---|---|
| Tailwind CSS | Utilitário, sem CSS extra, rápido de usar | Requer configuração com Vite |
| CSS Modules | Zero dependência extra, isolamento por componente | Mais verboso |
| Styled Components | CSS-in-JS, dinâmico | Bundle maior, overhead em runtime |

> 💡 Para um projeto solo com prazo curto, **CSS Modules** é a opção de menor fricção — zero configuração adicional no Vite e sem dependências extras.

### 3.3 Gerenciamento de Estado Global

**Status:** ✏ A definir

**Opções recomendadas:**

| Opção | Prós | Contras |
|---|---|---|
| Context API + useReducer | Zero dependência, nativo do React | Pode gerar re-renders desnecessários em apps grandes |
| Zustand | Leve, simples, sem boilerplate | Dependência extra |
| Jotai | Atômico, sem boilerplate | Dependência extra |

> 💡 Para o MVP, **Context API + useReducer** é suficiente. O app tem poucos domínios de estado (notas, categorias, nota aberta, busca, grafo). Migrar para Zustand se houver problemas de performance.

---

## 4. Editor de Markdown — CodeMirror 6

**Escolha:** CodeMirror 6 (`@codemirror/...`)

**Justificativa:** Editor extensível e modular, projetado para ser customizado via sistema de extensões. Suporte nativo a syntax highlighting de Markdown. Permite criar extensão customizada para o autocomplete de `[[...]]` sem hacks. Mais leve que Monaco e mais adequado para Markdown puro que TipTap.

**Pacotes necessários:**

```bash
npm install @codemirror/view @codemirror/state @codemirror/lang-markdown
npm install @codemirror/autocomplete @codemirror/commands
npm install @uiw/react-codemirror   # wrapper React
```

**Configuração base:**

```typescript
// renderer/components/Editor/Editor.tsx
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { noteReferenceExtension } from './extensions/noteReference';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  notesList: { id: string; title: string }[];
}

export function Editor({ value, onChange, notesList }: EditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[
        markdown(),
        noteReferenceExtension(notesList), // autocomplete [[...]]
      ]}
    />
  );
}
```

**Extensão de autocomplete `[[...]]`:**

A extensão detecta quando o usuário digita `[[` e abre um painel de sugestões com os títulos das notas existentes. A busca é case-sensitive (RN-023).

```typescript
// renderer/components/Editor/extensions/noteReference.ts
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';

export function noteReferenceExtension(notes: { id: string; title: string }[]) {
  return autocompletion({
    override: [(context: CompletionContext) => {
      const match = context.matchBefore(/\[\[[^\]]*$/);
      if (!match) return null;
      const query = match.text.slice(2); // remove [[
      return {
        from: match.from + 2,
        options: notes
          .filter(n => n.title.includes(query))
          .map(n => ({ label: n.title, apply: `${n.title}]]` })),
      };
    }],
  });
}
```

---

## 5. Visualização de Grafo — Cytoscape.js

**Escolha:** Cytoscape.js 3+ com `cytoscape-react`

**Justificativa:** Biblioteca madura especializada em grafos e redes. Suporte a múltiplos algoritmos de layout automático (cose, cola, dagre) — essencial já que o layout não é persistido no MVP (RN-072, ADR-004). Mais adequada que React Flow para grafos com muitos nós e relacionamentos arbitrários.

**Pacotes necessários:**

```bash
npm install cytoscape
npm install @types/cytoscape
```

**Configuração base:**

```typescript
// renderer/components/Graph/Graph.tsx
import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { GraphNode, GraphEdge } from '../../../types';

interface GraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick: (id: string, type: 'note' | 'category') => void;
}

export function Graph({ nodes, edges, onNodeClick }: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [
        ...nodes.map(n => ({ data: { id: n.id, label: n.label, type: n.type, color: n.color } })),
        ...edges.map(e => ({ data: { source: e.source, target: e.target, type: e.type } })),
      ],
      style: [
        { selector: 'node[type="note"]', style: { 'background-color': '#2E86C1', label: 'data(label)' } },
        { selector: 'node[type="category"]', style: { 'background-color': 'data(color)', shape: 'diamond', label: 'data(label)' } },
        { selector: 'edge', style: { 'line-color': '#CCCCCC', width: 1 } },
      ],
      layout: { name: 'cose' }, // layout automático — recalculado sempre (RN-072)
    });

    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      onNodeClick(node.id(), node.data('type'));
    });

    return () => cyRef.current?.destroy();
  }, [nodes, edges]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
```

**Modo Foco (RN-064):**

```typescript
// Filtra o grafo para exibir apenas a nota selecionada e seus vizinhos diretos
function focusNode(cy: cytoscape.Core, nodeId: string) {
  const node = cy.$(`#${nodeId}`);
  const neighborhood = node.neighborhood().add(node);
  cy.elements().not(neighborhood).style({ opacity: 0.1 });
  neighborhood.style({ opacity: 1 });
}

// Restaura o modo global
function resetFocus(cy: cytoscape.Core) {
  cy.elements().style({ opacity: 1 });
}
```

---

## 6. Testes — Vitest

**Escolha:** Vitest 1+

**Justificativa:** Integração nativa com Vite — zero configuração adicional. API compatível com Jest, sem curva de aprendizado extra. Mais rápido que Jest para projetos Vite por reutilizar o mesmo pipeline de transformação.

**Pacotes necessários:**

```bash
npm install -D vitest @vitest/ui
```

**Configuração no vite.main.config.ts:**

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'node', // Main Process testa em Node
    include: ['src/main/**/*.test.ts'],
  },
});
```

**Estratégia de testes para o MVP:**

| Camada | O que testar | O que não testar |
|---|---|---|
| `parser/` | Extração de `[[...]]` e `#categoria` do Markdown | — |
| `services/notes` | Validações (título, caracteres), parsing de refs, ciclo de vida de orphan links | I/O de disco (mockar `fs`) |
| `services/categories` | Validações (nome, tamanho, cor hex) | I/O de disco |
| `services/search` | Busca por substring, ordenação por relevância + data (RN-052, RN-054) | — |
| `services/graph` | Montagem de nós e arestas, exclusão de orphan links do grafo | — |
| Renderer | Não testar no MVP | UI, hooks, componentes |

> 💡 Priorize testes no `parser/` e `services/` — são as camadas com mais lógica de negócio e maior risco de bug silencioso. O Renderer pode ser testado manualmente no MVP.

**Exemplo de teste:**

```typescript
// src/main/parser/markdown.test.ts
import { describe, it, expect } from 'vitest';
import { extractReferences } from './markdown';

describe('extractReferences', () => {
  it('extrai referências simples', () => {
    expect(extractReferences('Veja [[Node.js]] e [[IPC]]'))
      .toEqual(['Node.js', 'IPC']);
  });

  it('é case-sensitive', () => {
    expect(extractReferences('[[node.js]] e [[Node.js]]'))
      .toEqual(['node.js', 'Node.js']);
  });

  it('ignora colchetes incompletos', () => {
    expect(extractReferences('Texto com [[ sem fechar'))
      .toEqual([]);
  });

  it('retorna vazio para body sem referências', () => {
    expect(extractReferences('Texto normal sem links'))
      .toEqual([]);
  });
});
```

---

## 7. Dependências Completas

### 7.1 Dependencies (produção)

```json
{
  "electron": "^29.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "@codemirror/view": "^6.0.0",
  "@codemirror/state": "^6.0.0",
  "@codemirror/lang-markdown": "^6.0.0",
  "@codemirror/autocomplete": "^6.0.0",
  "@codemirror/commands": "^6.0.0",
  "@uiw/react-codemirror": "^4.0.0",
  "cytoscape": "^3.0.0",
  "uuid": "^9.0.0"
}
```

### 7.2 DevDependencies

```json
{
  "@electron-forge/cli": "^7.0.0",
  "@electron-forge/plugin-vite": "^7.0.0",
  "vite": "^5.0.0",
  "typescript": "^5.0.0",
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0",
  "@types/cytoscape": "^3.0.0",
  "@types/uuid": "^9.0.0",
  "vitest": "^1.0.0",
  "@vitest/ui": "^1.0.0"
}
```

> ⚠ Versões são mínimas recomendadas. Fixar versões exatas no `package-lock.json` antes de começar o desenvolvimento para evitar breaking changes inesperados.

---

## 8. Padrões de Código

### 8.1 Convenções Gerais

| Aspecto | Convenção |
|---|---|
| Nomenclatura de arquivos | `kebab-case` para arquivos, `PascalCase` para componentes React |
| Nomenclatura de variáveis | `camelCase` para variáveis e funções, `PascalCase` para tipos e interfaces |
| Imports | Absolutos via alias `@main/`, `@renderer/`, `@types/` — configurar no `tsconfig.json` |
| Exports | Named exports — evitar default exports exceto em componentes React |
| Async/await | Sempre `async/await` — nunca `.then().catch()` encadeados |
| Error handling | `try/catch` em todos os handlers IPC — nunca deixar erro não tratado chegar ao Renderer |

### 8.2 Regras TypeScript

```json
// tsconfig.json — opções obrigatórias
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 8.3 Adição de Novas Dependências

Antes de adicionar qualquer nova dependência ao projeto, verificar:

1. **Necessidade real** — o problema não pode ser resolvido com código próprio simples?
2. **Tamanho do bundle** — dependências pesadas impactam o tempo de inicialização do app Electron
3. **Manutenção** — o pacote tem manutenção ativa? Última versão há menos de 1 ano?
4. **Compatibilidade** — funciona com Electron + Vite + TypeScript sem configuração especial?

---

## 9. Histórico de Revisões

| Versão | Data | Descrição | Autor |
|---|---|---|---|
| 1.0 | 28/03/2026 | Criação do documento com stack completa definida | Solo founder |
