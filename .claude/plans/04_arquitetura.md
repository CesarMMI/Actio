# NoteGraph

**Arquitetura Técnica**

*Documento Satélite — NoteGraph*

| Campo | Detalhe |
|---|---|
| Versão | 1.0 — Inicial |
| Status | Preenchido |
| Referência | Master PRD v2.0 + Regras de Negócio v1.0 + Modelo de Dados v1.0 |
| Responsável | Solo founder |
| Data | 28/03/2026 |

> 💡 Este documento descreve como o sistema é organizado em componentes, como eles se comunicam e os principais fluxos de execução. Deve ser lido em conjunto com o Modelo de Dados. Mantenha-o atualizado a cada decisão técnica relevante.

---

## 1. Visão de Alto Nível

O NoteGraph é um app Electron — um processo Node.js (Main) que carrega uma janela de browser (Renderer). Não há servidor remoto. Toda a lógica de negócio, leitura e escrita de arquivos acontece no Main Process. O Renderer é responsável apenas pela interface.

```
┌─────────────────────────────────────────────────────────┐
│                    Electron App                         │
│                                                         │
│  ┌─────────────────┐   IPC (invoke/handle)   ┌───────────────────┐  │
│  │    Renderer     │ ───────────────────────► │  Main Process     │  │
│  │  (UI / React)   │ ◄─────────────────────── │  (Node.js)        │  │
│  └─────────────────┘                          └────────┬──────────┘  │
│                                                        │             │
│                                               ┌────────▼──────────┐  │
│                                               │   Sistema de      │  │
│                                               │   Arquivos Local  │  │
│                                               │                   │  │
│                                               │  vault/           │  │
│                                               │  ├── *.md         │  │
│                                               │  ├── categories.json│ │
│                                               │  ├── references.json│ │
│                                               │  └── search-index.json│
│                                               │                   │  │
│                                               │  ~/.config/NoteGraph/│
│                                               │  └── config.json  │  │
│                                               └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes

### 2.1 Renderer Process (UI)

O Renderer é uma aplicação web executada dentro do Chromium embutido do Electron. Não tem acesso direto ao sistema de arquivos — toda operação de dados passa pelo IPC.

**Responsabilidades:**
- Renderizar a interface (editor de notas, lista de notas, grafo, busca, gerenciador de categorias)
- Capturar eventos do usuário e traduzir em chamadas IPC para o Main
- Exibir o resultado das operações retornadas pelo Main
- Gerenciar estado local da UI (nota aberta, modo do grafo, termo de busca)

**O que o Renderer NÃO faz:**
- Ler ou escrever arquivos diretamente
- Parsear referências `[[...]]` ou atualizar índices
- Tomar decisões de negócio — apenas apresenta dados e repassa ações

### 2.2 Main Process (Lógica e I/O)

O Main Process é o coração do app. Roda Node.js com acesso completo ao sistema operacional.

**Responsabilidades:**
- Expor handlers IPC para todas as operações do Renderer
- Executar lógica de negócio (validações, regras, parsing)
- Ler e escrever arquivos no vault e no config.json
- Gerenciar o ciclo de vida da janela Electron

**Módulos internos do Main:**

| Módulo | Responsabilidade |
|---|---|
| `ipc/` | Handlers IPC — ponto de entrada de cada operação |
| `services/notes` | CRUD de notas, parsing de referências, atualização de índices |
| `services/categories` | CRUD de categorias, validações (RN-030 a RN-036) |
| `services/search` | Busca por substring no search-index.json |
| `services/graph` | Montagem dos nós e arestas para o grafo |
| `services/vault` | Leitura do vault, reconstrução de auxiliares, integridade |
| `store/` | Leitura e escrita dos arquivos JSON (categories, references, search-index, config) |
| `parser/` | Extração de referências `[[...]]` e categorias `#...` do corpo Markdown |

### 2.3 Sistema de Arquivos

Tratado como a camada de persistência. O Main acessa diretamente via APIs do Node.js (`fs`, `path`). Nenhuma abstração de banco de dados é usada.

Estrutura detalhada no documento **Modelo de Dados v1.0**.

---

## 3. Comunicação IPC

Toda comunicação entre Renderer e Main usa IPC síncrono via `ipcRenderer.invoke` (Renderer) e `ipcMain.handle` (Main).

> ✅ Decisão: IPC síncrono (`invoke/handle`) para todas as operações. O Renderer aguarda a resposta antes de atualizar a UI. Simplifica o gerenciamento de estado — não há necessidade de reconciliar respostas assíncronas out-of-order.

### 3.1 Contrato dos Handlers IPC

Convenção de nomenclatura: `entidade:ação` (ex: `note:save`, `category:delete`).

| Canal IPC | Payload (Renderer → Main) | Resposta (Main → Renderer) |
|---|---|---|
| `note:list` | `{}` | `{ notes: NoteIndex[] }` |
| `note:get` | `{ id: string }` | `{ note: Note }` |
| `note:save` | `{ id?: string, title: string, body: string, category_id: string \| null }` | `{ note: Note, references: Reference[] }` |
| `note:delete` | `{ id: string }` | `{ orphaned: Reference[] }` |
| `note:rename` | `{ id: string, title: string }` | `{ note: Note, updated_references: number }` |
| `category:list` | `{}` | `{ categories: Category[] }` |
| `category:save` | `{ id?: string, name: string, color: string \| null }` | `{ category: Category }` |
| `category:delete` | `{ id: string }` | `{ affected_notes: number }` |
| `search:query` | `{ term: string, category_id?: string }` | `{ results: SearchResult[] }` |
| `graph:data` | `{}` | `{ nodes: Node[], edges: Edge[] }` |
| `vault:open` | `{}` | `{ vault_path: string }` |
| `vault:rebuild` | `{}` | `{ rebuilt: boolean }` |
| `app:config` | `{}` | `{ config: Config }` |

### 3.2 Formato de Erro

Todos os handlers retornam erros no mesmo formato, para tratamento uniforme no Renderer:

```json
{
  "error": true,
  "code": "NOTE_TITLE_TOO_LONG",
  "message": "O título não pode exceder 50 caracteres."
}
```

Códigos de erro relevantes: `NOTE_TITLE_TOO_LONG`, `NOTE_TITLE_INVALID_CHARS`, `CATEGORY_NAME_TOO_LONG`, `VAULT_NOT_FOUND`, `FILE_WRITE_ERROR`, `REBUILD_REQUIRED`.

---

## 4. Fluxos Principais

### 4.1 Inicialização do App

```
1. Electron inicia o Main Process
2. Main lê config.json → obtém vault_path
   └── Se config.json não existe → abre diálogo para o usuário escolher pasta do vault
3. Main verifica integridade do vault:
   ├── categories.json existe? Senão → criar vazio []
   ├── references.json existe? Senão → reconstruir varrendo os .md
   └── search-index.json existe? Senão → reconstruir varrendo os .md
4. Main cria a janela Electron e carrega o Renderer
5. Renderer dispara note:list e category:list via IPC
6. UI exibe a lista de notas
```

> ⚠ A reconstrução dos auxiliares na inicialização pode ser lenta com muitas notas. Para o MVP, isso é aceitável. Se necessário, exibir uma tela de carregamento com progresso.

### 4.2 Criar / Salvar Nota

```
Renderer                          Main Process                    Disco
   │                                    │                           │
   │── invoke('note:save', payload) ───►│                           │
   │                                    │ 1. Valida título (≤50 chars, sem [ ])
   │                                    │ 2. Gera UUID se nota nova
   │                                    │ 3. Monta frontmatter YAML
   │                                    │ 4. Escreve <uuid>.md ────►│
   │                                    │ 5. Parseia [[...]] do body │
   │                                    │ 6. Remove refs antigas de source_id
   │                                    │ 7. Recalcula is_broken p/ cada ref
   │                                    │ 8. Escreve references.json►│
   │                                    │ 9. Atualiza entrada no search-index.json
   │                                    │10. Escreve search-index.json►│
   │◄── { note, references } ──────────│                           │
   │                                    │                           │
   │ Atualiza UI (editor + lista)       │                           │
```

> ✅ Decisão: steps 4 a 10 são síncronos — o Renderer só recebe confirmação após todas as escritas concluírem. Garante consistência entre .md e auxiliares.

> ⚠ Os passos 4, 8 e 10 envolvem três escritas em disco. Implemente com write-then-rename (escrever em arquivo temporário e renomear) para evitar corrupção em caso de falha parcial.

### 4.3 Excluir Nota

```
Renderer                          Main Process                    Disco
   │                                    │                           │
   │── invoke('note:delete', {id}) ────►│                           │
   │                                    │ 1. Busca refs onde target_id = id
   │                                    │ 2. Exibe contagem ao Renderer (pré-confirmação)
   │◄── { orphaned: Reference[] } ─────│                           │
   │                                    │                           │
   │ (usuário confirma na UI)           │                           │
   │── invoke('note:delete:confirm') ──►│                           │
   │                                    │ 3. Remove <uuid>.md ─────►│
   │                                    │ 4. Remove refs onde source_id = id
   │                                    │ 5. Atualiza refs onde target_id = id:
   │                                    │    → target_id = null, is_broken = true
   │                                    │ 6. Escreve references.json►│
   │                                    │ 7. Remove entrada do search-index.json
   │                                    │ 8. Escreve search-index.json►│
   │◄── { success: true } ─────────────│                           │
```

### 4.4 Renomear Nota

```
Renderer                          Main Process                    Disco
   │                                    │                           │
   │── invoke('note:rename', {id, title})►│                        │
   │                                    │ 1. Valida novo título
   │                                    │ 2. Atualiza frontmatter do <uuid>.md
   │                                    │ 3. Atualiza target_title nas refs
   │                                    │    onde target_id = id
   │                                    │ 4. Verifica orphan links com
   │                                    │    target_title = novo título → reconecta
   │                                    │ 5. Escreve references.json►│
   │                                    │ 6. Atualiza title no search-index.json
   │                                    │ 7. Escreve search-index.json►│
   │◄── { note, updated_references } ──│                           │
```

> ✅ A operação de renomear é atômica do ponto de vista do Renderer — uma única chamada IPC que orquestra todas as escritas necessárias (RN-024).

### 4.5 Busca Global

```
Renderer                          Main Process
   │                                    │
   │── invoke('search:query', {term}) ─►│
   │                                    │ 1. Carrega search-index.json em memória
   │                                    │    (ou usa cache se já carregado)
   │                                    │ 2. Filtra entries onde title ou body_text
   │                                    │    contém term (substring, case-insensitive)
   │                                    │ 3. Ordena: ocorrências desc, updated_at desc
   │                                    │ 4. Retorna até N resultados com snippet
   │◄── { results: SearchResult[] } ───│
```

> 💡 O search-index.json deve ser carregado em memória na inicialização e mantido em cache no Main Process. Isso elimina leitura de disco a cada busca — especialmente importante com debounce ativo (RN-052).

### 4.6 Montagem do Grafo

```
Renderer                          Main Process
   │                                    │
   │── invoke('graph:data', {}) ───────►│
   │                                    │ 1. Lê search-index.json → lista de notas (nós)
   │                                    │ 2. Lê categories.json → lista de categorias (nós)
   │                                    │ 3. Lê references.json → arestas nota→nota
   │                                    │ 4. Monta arestas nota→categoria via category_id
   │                                    │ 5. Exclui arestas com is_broken = true
   │                                    │ 6. Retorna { nodes, edges }
   │◄── { nodes: Node[], edges: Edge[] }│
   │                                    │
   │ Renderer renderiza grafo com lib   │
   │ escolhida (Cytoscape.js / React Flow)
```

---

## 5. Estrutura de Pastas do Projeto

```
notegraph/
├── electron.js                  ← entry point do Electron (cria BrowserWindow)
├── package.json
│
├── src/
│   ├── main/                    ← Main Process
│   │   ├── ipc/                 ← handlers IPC (um arquivo por entidade)
│   │   │   ├── notes.js
│   │   │   ├── categories.js
│   │   │   ├── search.js
│   │   │   ├── graph.js
│   │   │   └── vault.js
│   │   ├── services/            ← lógica de negócio
│   │   │   ├── notes.js
│   │   │   ├── categories.js
│   │   │   ├── search.js
│   │   │   ├── graph.js
│   │   │   └── vault.js
│   │   ├── store/               ← leitura/escrita dos JSONs
│   │   │   ├── notesStore.js
│   │   │   ├── categoriesStore.js
│   │   │   ├── referencesStore.js
│   │   │   ├── searchIndexStore.js
│   │   │   └── configStore.js
│   │   └── parser/              ← parsing de [[...]] e #categoria
│   │       └── markdown.js
│   │
│   └── renderer/                ← Renderer Process (UI)
│       ├── index.html
│       ├── main.jsx             ← entry point React
│       ├── components/          ← componentes de UI
│       │   ├── Editor/
│       │   ├── NoteList/
│       │   ├── Graph/
│       │   ├── Search/
│       │   └── Categories/
│       ├── hooks/               ← custom hooks (ex: useSearch, useGraph)
│       └── ipc/                 ← wrappers para ipcRenderer.invoke
│           └── client.js
```

---

## 6. Decisões de Arquitetura (ADRs)

### ADR-001 — IPC Síncrono para todas as operações

| Campo | Detalhe |
|---|---|
| Status | ✅ Aceito |
| Contexto | Renderer precisa saber quando operações de I/O terminaram para atualizar a UI corretamente. |
| Decisão | Usar `ipcRenderer.invoke` + `ipcMain.handle` (Promise-based) em todas as operações. |
| Consequências | UI fica bloqueada durante o I/O, mas operações são rápidas em disco local. Simplifica gerenciamento de estado — sem race conditions entre respostas assíncronas. |

### ADR-002 — Parsing de referências no Main, síncrono ao save

| Campo | Detalhe |
|---|---|
| Status | ✅ Aceito |
| Contexto | Referências `[[...]]` precisam ser extraídas e persistidas para alimentar o grafo e detectar orphan links. |
| Decisão | O Main parseia o corpo do .md e atualiza references.json como parte síncrona do fluxo de save. O Renderer não faz parsing. |
| Consequências | Garante consistência entre .md e references.json. Adiciona processamento ao save, mas é negligenciável para notas de tamanho normal. |

### ADR-003 — search-index.json em memória cache no Main

| Campo | Detalhe |
|---|---|
| Status | ✅ Aceito |
| Contexto | Busca com debounce (RN-052) pode disparar múltiplas queries por segundo. Ler o JSON do disco a cada query seria custoso. |
| Decisão | Carregar search-index.json em memória na inicialização do app e manter o cache atualizado a cada save/delete/rename. |
| Consequências | Busca é feita 100% em memória — muito mais rápida. Custo: memória proporcional ao número de notas. Para o MVP, aceitável. |

### ADR-004 — Write-then-rename para escritas críticas

| Campo | Detalhe |
|---|---|
| Status | ✅ Aceito |
| Contexto | Escritas em disco podem falhar no meio da operação (ex: queda de energia), corrompendo arquivos. |
| Decisão | Para .md e JSONs auxiliares, escrever primeiro em arquivo temporário (ex: `<uuid>.md.tmp`) e só então fazer rename atômico para o nome final. |
| Consequências | Elimina risco de corrupção parcial. O arquivo antigo permanece intacto até o novo estar completamente escrito. |

### ADR-005 — Auxiliares reconstruíveis a partir dos .md

| Campo | Detalhe |
|---|---|
| Status | ✅ Aceito |
| Contexto | categories.json, references.json e search-index.json são derivados dos .md, não fontes de verdade. |
| Decisão | Qualquer um desses arquivos pode ser apagado e reconstruído. Na inicialização, o app verifica sua existência e os reconstrói se ausentes. |
| Consequências | Resiliência: o usuário nunca perde dados mesmo que os auxiliares sejam corrompidos ou deletados. Os .md são a única coisa que precisa ser preservada. |

---

## 7. Segurança e Isolamento

### 7.1 Context Isolation

O Electron deve rodar com `contextIsolation: true` e `nodeIntegration: false` no Renderer. A comunicação com o Main ocorre exclusivamente via `contextBridge` — o Renderer nunca tem acesso direto às APIs do Node.js.

```javascript
// preload.js — exposto ao Renderer via contextBridge
contextBridge.exposeInMainWorld('api', {
  invoke: (channel, payload) => ipcRenderer.invoke(channel, payload)
});
```

> ⚠ Nunca desabilitar `contextIsolation` mesmo durante o desenvolvimento. É a principal barreira de segurança do Electron contra execução de código arbitrário no Main via Renderer.

### 7.2 Validação no Main

Todas as validações de regras de negócio (tamanho de título, caracteres inválidos, etc.) devem ser executadas no Main — nunca confiar apenas na validação do Renderer. O Renderer pode validar para feedback imediato na UI, mas o Main é a barreira final.

---

## 8. Performance e Limites do MVP

| Aspecto | Limite aceitável no MVP | Ação se excedido |
|---|---|---|
| Notas no vault | Até ~500 notas | Otimizar store; considerar SQLite |
| Tempo de save (com parsing) | < 200ms | Perfil de parsing; otimizar regex |
| Tempo de busca (em memória) | < 100ms | Otimizar estrutura do cache |
| Tempo de montagem do grafo | < 500ms | Paginar ou limitar vizinhos exibidos |
| Tamanho do search-index.json | < 10MB | Migrar para SQLite auxiliar |

---

## 9. Histórico de Revisões

| Versão | Data | Descrição | Autor |
|---|---|---|---|
| 1.0 | 28/03/2026 | Criação do documento com arquitetura completa | Solo founder |
