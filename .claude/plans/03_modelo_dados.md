**NoteGraph**

**Modelo de Dados**

*Documento Satélite — NoteGraph*

|             |                                          |
|-------------|------------------------------------------|
| Versão      | 1.0 — Inicial                            |
| Status      | Preenchido                               |
| Referência  | Master PRD v2.0 + Regras de Negócio v1.0 |
| Responsável | Solo founder                             |
| Data        | 28/03/2026                               |

> *💡 Este documento descreve todas as estruturas de dados do NoteGraph — entidades dos arquivos .md, arquivos auxiliares e índice de busca. Deve ser mantido sincronizado com as Regras de Negócio e servir de base para o documento de Arquitetura Técnica.*

## 1. Visão Geral do Modelo

O NoteGraph não usa banco de dados relacional tradicional. Os dados são distribuídos em três camadas:

| **Camada**      | **Formato**                        | **Responsabilidade**                          |
|-----------------|------------------------------------|-----------------------------------------------|
| Notas           | Arquivos .md com frontmatter YAML  | Conteúdo principal — fonte de verdade         |
| Categorias      | Arquivo categories.json no vault   | Registro de categorias disponíveis            |
| Referências     | Arquivo references.json no vault   | Índice de links entre notas (source → target) |
| Índice de busca | Arquivo search-index.json no vault | Índice persistido para busca full-text        |
| Configuração    | Arquivo config.json fora do vault  | Caminho do vault e preferências do app        |

> *✅ Fonte de verdade: os arquivos .md são sempre a fonte de verdade. Em caso de inconsistência entre um .md e os arquivos auxiliares (references.json, search-index.json), o .md prevalece e os auxiliares devem ser reconstruídos.*

## 2. Notas (Arquivos .md)

### 2.1 Estrutura do Arquivo

Cada nota é um arquivo .md cujo nome é o UUID da nota. O arquivo é composto por duas partes: frontmatter YAML (metadados) e corpo Markdown.

*Exemplo de arquivo a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0.md:*

> ---
>
> id: a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0
>
> title: Como funciona o Electron
>
> category_id: b1c2d3e4-5f6a-7b8c-9d0e-f1a2b3c4d5e6
>
> created_at: 2026-03-28T10:00:00Z
>
> updated_at: 2026-03-28T14:30:00Z
>
> ---
>
> \## Introdução
>
> O Electron combina Chromium e Node.js. Veja também \[\[Node.js\]\] e \[\[IPC\]\].

### 2.2 Schema do Frontmatter

| **Campo**   | **Tipo**                 | **Obrigatório** | **Descrição**                                                                                                      |
|-------------|--------------------------|-----------------|--------------------------------------------------------------------------------------------------------------------|
| id          | UUID v4 (string)         | Sim             | Identificador único da nota. Imutável após criação. Também é o nome do arquivo .md.                                |
| title       | string                   | Sim             | Título da nota. Máx. 50 caracteres (RN-004). Não precisa ser único — duas notas podem ter o mesmo título.          |
| category_id | UUID v4 (string) \| null | Não             | UUID da categoria associada. Null se a nota não tiver categoria. Relação 1:N com categories.json (RN-031, RN-034). |
| created_at  | ISO 8601 (string)        | Sim             | Data e hora de criação da nota, em UTC. Definida no momento da criação e nunca alterada.                           |
| updated_at  | ISO 8601 (string)        | Sim             | Data e hora da última edição do título ou corpo. Atualizada a cada save.                                           |

> *💡 Usar ISO 8601 (ex: 2026-03-28T10:00:00Z) garante ordenação lexicográfica correta e compatibilidade com ferramentas externas.*

### 2.3 Corpo da Nota

| **Aspecto**         | **Detalhe**                                                             |
|---------------------|-------------------------------------------------------------------------|
| Formato             | Markdown padrão (CommonMark)                                            |
| Tamanho máximo      | Sem limite definido no MVP (RN-004)                                     |
| Referências         | Sintaxe \[\[Título da Nota\]\] — case-sensitive (RN-023)                |
| Categorias no texto | Sintaxe \#nome-da-categoria — resolvida pelo UUID internamente (RN-032) |
| Compatibilidade     | Legível por qualquer editor Markdown (Obsidian, VS Code, etc.)          |

## 3. Categorias (categories.json)

### 3.1 Localização e Propósito

O arquivo categories.json fica na raiz do vault e armazena todas as categorias disponíveis. É a fonte de verdade para categorias — o frontmatter das notas referencia UUIDs definidos aqui.

### 3.2 Estrutura do Arquivo

*Exemplo de categories.json:*

> {
>
> "categories": \[
>
> {
>
> "id": "b1c2d3e4-5f6a-7b8c-9d0e-f1a2b3c4d5e6",
>
> "name": "Electron",
>
> "color": "#3498DB",
>
> "created_at": "2026-03-28T10:00:00Z"
>
> },
>
> {
>
> "id": "c2d3e4f5-6a7b-8c9d-0e1f-a2b3c4d5e6f7",
>
> "name": "Estudos",
>
> "color": null,
>
> "created_at": "2026-03-28T11:00:00Z"
>
> }
>
> \]
>
> }

### 3.3 Schema de Cada Categoria

| **Campo**  | **Tipo**           | **Obrigatório** | **Descrição**                                                                                                                                   |
|------------|--------------------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| id         | UUID v4 (string)   | Sim             | Identificador único da categoria. Imutável após criação. Referenciado pelo campo category_id nas notas.                                         |
| name       | string             | Sim             | Nome da categoria. Máx. 50 caracteres (RN-036). Não precisa ser único — duas categorias podem ter o mesmo nome (RN-030).                        |
| color      | string hex \| null | Não             | Cor da categoria em formato hexadecimal de 6 dígitos, com \# (ex: \#3498DB). Null se não definida — a interface aplica uma cor padrão (RN-035). |
| created_at | ISO 8601 (string)  | Sim             | Data e hora de criação da categoria, em UTC.                                                                                                    |

> *⚠ Ao excluir uma categoria, remover seu objeto do categories.json e atualizar todas as notas que referenciavam seu UUID (definir category_id como null no frontmatter). As duas operações devem ser atômicas.*

## 4. Referências (references.json)

### 4.1 Localização e Propósito

O arquivo references.json fica na raiz do vault e armazena o índice de referências entre notas. É atualizado a cada vez que uma nota é salva — o sistema parseia o corpo do .md e recalcula os links \[\[...\]\] da nota.

> *✅ Decisão: referências persistidas em arquivo auxiliar, não extraídas em tempo real. Isso permite construir o grafo e detectar orphan links sem precisar parsear todos os .md a cada abertura do app.*

### 4.2 Estrutura do Arquivo

*Exemplo de references.json:*

> {
>
> "references": \[
>
> {
>
> "source_id": "a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0",
>
> "target_id": "d4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
>
> "target_title": "Node.js",
>
> "is_broken": false,
>
> "updated_at": "2026-03-28T14:30:00Z"
>
> },
>
> {
>
> "source_id": "a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0",
>
> "target_id": null,
>
> "target_title": "IPC",
>
> "is_broken": true,
>
> "updated_at": "2026-03-28T14:30:00Z"
>
> }
>
> \]
>
> }

### 4.3 Schema de Cada Referência

| **Campo**    | **Tipo**                 | **Obrigatório** | **Descrição**                                                                                                          |
|--------------|--------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------|
| source_id    | UUID v4 (string)         | Sim             | UUID da nota que contém a referência \[\[...\]\].                                                                      |
| target_id    | UUID v4 (string) \| null | Não             | UUID da nota referenciada. Null se a referência estiver quebrada (orphan link — RN-011).                               |
| target_title | string                   | Sim             | Título exato usado na referência \[\[Título\]\]. Preservado mesmo quando is_broken = true, para exibição na interface. |
| is_broken    | boolean                  | Sim             | True se a nota alvo não existe ou foi excluída (orphan link). False quando target_id aponta para uma nota existente.   |
| updated_at   | ISO 8601 (string)        | Sim             | Data e hora do último recálculo desta referência (coincide com o último save da nota origem).                          |

> *💡 Ao salvar uma nota, delete todos os registros onde source_id = UUID da nota e reinsira os recalculados. Isso garante consistência sem precisar fazer diff das referências antigas.*
>
> *⚠ Referências são case-sensitive (RN-023). \[\[Node.js\]\] e \[\[node.js\]\] são entradas distintas no references.json e buscam notas diferentes.*

### 4.4 Ciclo de Vida das Referências

| **Evento**       | **Ação no references.json**                                                                                                                                         |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Nota salva       | Remover todas as refs onde source_id = nota. Parsear \[\[...\]\] do corpo. Recriar registros com is_broken calculado.                                               |
| Nota excluída    | Remover todas as refs onde source_id = nota. Atualizar refs onde target_id = nota: definir target_id = null e is_broken = true.                                     |
| Nota renomeada   | Atualizar target_title em todas as refs onde target_id = nota. Recalcular refs da nota renomeada (source_id = nota).                                                |
| Nova nota criada | Verificar se há refs com is_broken = true cujo target_title coincide com o título da nova nota. Se sim, reconectar: definir target_id e is_broken = false (RN-012). |

## 5. Índice de Busca (search-index.json)

### 5.1 Localização e Propósito

O arquivo search-index.json fica na raiz do vault e mantém um índice persistido para busca full-text em títulos e corpos das notas. É reconstruído incrementalmente a cada save de nota.

> *✅ Decisão: índice persistido em JSON no vault. Evita varrer todos os arquivos .md a cada busca, o que seria custoso com muitas notas.*

### 5.2 Estrutura do Arquivo

*Exemplo de search-index.json:*

> {
>
> "version": 1,
>
> "updated_at": "2026-03-28T14:30:00Z",
>
> "entries": \[
>
> {
>
> "id": "a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0",
>
> "title": "Como funciona o Electron",
>
> "body_text": "O Electron combina Chromium e Node.js...",
>
> "category_id": "b1c2d3e4-5f6a-7b8c-9d0e-f1a2b3c4d5e6",
>
> "updated_at": "2026-03-28T14:30:00Z"
>
> }
>
> \]
>
> }

### 5.3 Schema de Cada Entrada

| **Campo**   | **Tipo**          | **Obrigatório** | **Descrição**                                                                                                   |
|-------------|-------------------|-----------------|-----------------------------------------------------------------------------------------------------------------|
| id          | UUID v4 (string)  | Sim             | UUID da nota — referência ao arquivo .md correspondente.                                                        |
| title       | string            | Sim             | Título da nota. Copiado do frontmatter. Incluído no índice para busca por título.                               |
| body_text   | string            | Não             | Corpo da nota em texto plano (Markdown removido). Usado para busca por substring no conteúdo. Pode estar vazio. |
| category_id | UUID \| null      | Não             | UUID da categoria da nota. Permite filtrar resultados de busca por categoria.                                   |
| updated_at  | ISO 8601 (string) | Sim             | Data do último save da nota. Usado para desempate na ordenação dos resultados (RN-054).                         |

> *💡 O campo body_text deve ter o Markdown stripado (remover \*\*, \_\_, \#, etc.) para que a busca por substring não encontre falsos positivos com sintaxe Markdown. Referências \[\[...\]\] e categorias \#... também devem ser removidas ou normalizadas.*

### 5.4 Ciclo de Vida do Índice

| **Evento**       | **Ação no search-index.json**                                                                                                  |
|------------------|--------------------------------------------------------------------------------------------------------------------------------|
| Nota salva       | Atualizar ou inserir entrada com id = UUID da nota. Recalcular body_text.                                                      |
| Nota excluída    | Remover entrada com id = UUID da nota.                                                                                         |
| Nota renomeada   | Atualizar campo title na entrada correspondente.                                                                               |
| App iniciado     | Verificar integridade: comparar entradas do índice com arquivos .md do vault. Reconstruir entradas ausentes ou desatualizadas. |
| Vault corrompido | Apagar search-index.json e reconstruir do zero varrendo todos os .md.                                                          |

## 6. Configuração do App (config.json)

### 6.1 Localização

O arquivo config.json é armazenado fora do vault, em um diretório de dados do app gerenciado pelo Electron — tipicamente:

- Windows: %APPDATA%\NoteGraph\config.json

- macOS: ~/Library/Application Support/NoteGraph/config.json

- Linux: ~/.config/NoteGraph/config.json

> *✅ Decisão: config.json fora do vault. O vault pode ser movido, compartilhado ou versionado sem arrastar consigo as configurações locais da máquina.*

### 6.2 Estrutura do Arquivo

*Exemplo de config.json:*

> {
>
> "vault_path": "/Users/lucas/Documents/notegraph-vault",
>
> "app_version": "0.1.0",
>
> "last_opened_at": "2026-03-28T14:30:00Z"
>
> }

### 6.3 Schema

| **Campo**      | **Tipo**          | **Obrigatório** | **Descrição**                                                                                |
|----------------|-------------------|-----------------|----------------------------------------------------------------------------------------------|
| vault_path     | string (path)     | Sim             | Caminho absoluto para a pasta raiz do vault no sistema de arquivos local.                    |
| app_version    | string (semver)   | Sim             | Versão do app que gerou este config. Útil para migrações futuras de schema.                  |
| last_opened_at | ISO 8601 (string) | Não             | Data e hora da última abertura do app. Informativo — pode ser usado em telas de boas-vindas. |

## 7. Estrutura Completa do Vault

Visão da árvore de arquivos de um vault típico do NoteGraph:

> vault/ ← pasta raiz escolhida pelo usuário
>
> ├── categories.json ← registro de todas as categorias
>
> ├── references.json ← índice de referências entre notas
>
> ├── search-index.json ← índice de busca full-text
>
> ├── a3f2c1d4-...-e5f6a7b8c9d0.md ← nota: 'Como funciona o Electron'
>
> ├── b4c5d6e7-...-f6a7b8c9d0e1.md ← nota: 'Node.js'
>
> └── c5d6e7f8-...-a7b8c9d0e1f2.md ← nota: 'IPC'

E fora do vault, na pasta de dados do sistema:

> ~/.config/NoteGraph/
>
> └── config.json ← caminho do vault e preferências
>
> *💡 Todos os arquivos auxiliares (categories.json, references.json, search-index.json) podem ser apagados e reconstruídos a partir dos arquivos .md. O app deve ser capaz de realizar essa reconstrução ao detectar arquivos ausentes ou corrompidos.*

## 8. Considerações de Evolução

| **Tema**                      | **O que pode mudar em versões futuras**                                                                                |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Múltiplas categorias por nota | Mudar category_id (UUID \| null) para category_ids (UUID\[\]). Impacta frontmatter, categories.json e índice de busca. |
| Hierarquia de categorias      | Adicionar campo parent_id (UUID \| null) em cada categoria no categories.json.                                         |
| Performance de busca          | Migrar search-index.json para SQLite auxiliar dentro do vault se o JSON crescer demais.                                |
| Histórico de versões          | Adicionar pasta .notegraph/history/ dentro do vault com snapshots dos .md.                                             |
| Múltiplos vaults              | Transformar config.json em lista de vaults com último vault ativo.                                                     |

## 9. Histórico de Revisões

| **Versão** | **Data**   | **Descrição**                                     | **Autor**    |
|------------|------------|---------------------------------------------------|--------------|
| 1.0        | 28/03/2026 | Criação do documento com modelo completo de dados | Solo founder |
| ✏          | ✏          | ✏                                                 | ✏            |
