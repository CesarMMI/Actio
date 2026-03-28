**NoteGraph**

**Regras de Negócio**

*Documento Satélite — NoteGraph*

|             |                             |
|-------------|-----------------------------|
| Versão      | 1.0 — Preenchido            |
| Status      | Em revisão                  |
| Referência  | Master PRD v2.0 — NoteGraph |
| Responsável | Solo founder                |
| Data        | 28/03/2026                  |

> *💡 Este documento define as regras que governam o comportamento do sistema. Toda decisão técnica ou de UX que dependa de uma lógica de negócio deve estar registrada aqui. Campos com ✏ ainda precisam ser decididos.*

## Índice de Decisões

Resumo de todas as regras e seu status de decisão:

| **Código** | **Regra**                                                              | **Status**  |
|------------|------------------------------------------------------------------------|-------------|
| RN-001     | Títulos de notas não precisam ser únicos — diferenciadas por ID        | ✅ Decidido |
| RN-002     | Corpo da nota em Markdown, pode estar vazio                            | ✅ Decidido |
| RN-003     | Título não pode conter os caracteres \[ \]                             | ✅ Decidido |
| RN-004     | Tamanho máximo: título 50 caracteres, corpo indefinido                 | ✅ Decidido |
| RN-010     | Excluir nota identifica referências ativas                             | ✅ Decidido |
| RN-011     | Exclusão permitida — links viram orphan links                          | ✅ Decidido |
| RN-020     | Sintaxe de referência: \[\[Título da Nota\]\]                          | ✅ Decidido |
| RN-021     | Digitar \[\[ abre autocomplete de busca                                | ✅ Decidido |
| RN-022     | Busca de referência cobre título e corpo                               | ✅ Decidido |
| RN-023     | Referências são case-sensitive                                         | ✅ Decidido |
| RN-024     | Renomear nota atualiza todas as referências automaticamente            | ✅ Decidido |
| RN-030     | Categoria identificada por UUID único — nome pode se repetir           | ✅ Decidido |
| RN-031     | Nota pode ter zero ou uma categoria                                    | ✅ Decidido |
| RN-032     | Categorias via painel de metadados ou \#categoria no texto             | ✅ Decidido |
| RN-033     | Categorias são planas — sem hierarquia                                 | ✅ Decidido |
| RN-034     | Limite de categorias por nota: exatamente uma (ou nenhuma)             | ✅ Decidido |
| RN-035     | Categoria pode ter cor opcional (hex)                                  | ✅ Decidido |
| RN-036     | Nome da categoria: máximo 50 caracteres                                | ✅ Decidido |
| RN-040     | Excluir categoria desvincula das notas e some                          | ✅ Decidido |
| RN-050     | Busca global cobre títulos e corpos de todas as notas                  | ✅ Decidido |
| RN-051     | Busca de referência (no editor) cobre apenas títulos                   | ✅ Decidido |
| RN-052     | Busca em tempo real com debounce                                       | ✅ Decidido |
| RN-053     | Suporte a operadores de busca (AND, OR, aspas)                         | ✅ Decidido |
| RN-054     | Ordenação dos resultados de busca                                      | ✅ Decidido |
| RN-060     | Cada nota é um nó do grafo                                             | ✅ Decidido |
| RN-061     | Cada categoria é um nó com visual diferenciado                         | ✅ Decidido |
| RN-062     | Arestas representam referências nota→nota e nota→categoria             | ✅ Decidido |
| RN-063     | Notas sem conexão aparecem no grafo                                    | ✅ Decidido |
| RN-064     | Grafo global por padrão, com opção de foco em uma nota                 | ✅ Decidido |
| RN-070     | Clicar em nó abre a nota correspondente                                | ✅ Decidido |
| RN-071     | Layout do grafo persistido entre sessões                               | ✅ Decidido |
| RN-080     | App single-user, sem autenticação                                      | ✅ Decidido |
| RN-081     | Vault contém .md, categories.json, references.json e search-index.json | ✅ Decidido |

## 1. Notas

### 1.1 Criação e Identificação

**RN-001:** Notas não exigem título único. Duas notas podem ter o mesmo título e são diferenciadas internamente por um identificador único (UUID) gerado no momento da criação.

> *✅ Decisão: títulos duplicados são permitidos. O sistema usa UUID internamente para diferenciar as notas. A interface deve exibir o ID de forma acessível quando houver ambiguidade (ex: no autocomplete de referências).*

**RN-002:** O corpo da nota é escrito em Markdown e pode estar vazio. Uma nota com apenas título é válida.

**RN-003:** O título não pode conter os caracteres \[ ou \], pois são reservados para a sintaxe de referência \[\[...\]\].

**RN-004:** Tamanho máximo do título: 50 caracteres. Tamanho máximo do corpo: indefinido — sem limite rígido no MVP.

> *✅ Decisão: título limitado a 50 caracteres. O limite deve ser validado na interface antes de salvar, com contador visual de caracteres no editor. Corpo sem limite no MVP.*

### 1.2 Armazenamento

**RN-005:** Cada nota é salva como um arquivo .md no disco do usuário, dentro da pasta (vault) escolhida por ele na configuração inicial do app.

**RN-006:** O nome do arquivo .md é gerado a partir do UUID da nota (ex: a3f2c1d4.md), não do título. Isso permite títulos duplicados sem conflito no sistema de arquivos.

**RN-007:** O título e os metadados da nota (categoria, data de criação, data de edição) são armazenados no frontmatter YAML do arquivo .md, no seguinte formato:

> ---
>
> id: a3f2c1d4-...
>
> title: Minha Nota
>
> category_id: a1b2c3d4-5f6a-7b8c-9d0e-f1a2b3c4d5e6 (UUID da categoria, ou null)
>
> created_at: 2026-03-28T10:00:00Z
>
> updated_at: 2026-03-28T14:30:00Z
>
> ---
>
> *💡 Usar frontmatter YAML garante compatibilidade com Obsidian, VS Code e outros editores. O usuário pode abrir e editar os arquivos fora do NoteGraph sem perder os metadados.*

### 1.3 Exclusão de Notas

> *⚠ A exclusão de uma nota referenciada por outras gera orphan links. A interface deve comunicar isso claramente ao usuário antes de confirmar.*

**RN-010:** Ao iniciar a exclusão de uma nota, o sistema verifica se ela é referenciada por outras notas e exibe um aviso com a lista de notas que a referenciam.

**RN-011:** A exclusão é permitida mesmo com referências ativas. Após a exclusão, os links \[\[Título\]\] nas outras notas são marcados como orphan links — visualmente diferenciados na interface (ex: cor vermelha ou ícone de alerta).

> *✅ Decisão: orphan links não são removidos automaticamente do texto das notas. O usuário decide o que fazer com eles — pode removê-los manualmente ou aguardar uma nota ser criada com o mesmo título para o link se reconectar.*

**RN-012:** Um orphan link se reconecta automaticamente se uma nova nota for criada com o mesmo título exato (case-sensitive) da referência quebrada.

### 1.4 Referências Entre Notas

**RN-020:** A sintaxe de referência entre notas é \[\[Título da Nota\]\] no corpo do Markdown.

**RN-021:** Ao digitar \[\[ no editor, o sistema exibe um autocomplete com busca em tempo real por títulos de notas existentes.

**RN-022:** A busca do autocomplete de referências cobre títulos e corpos das notas.

**RN-023:** Referências são case-sensitive: \[\[minha nota\]\] e \[\[Minha Nota\]\] são tratadas como referências distintas e apontam para notas diferentes.

> *✅ Decisão: case-sensitive. O usuário é responsável por manter a consistência de capitalização. O autocomplete ajuda a evitar erros ao sugerir os títulos existentes.*

**RN-024:** Ao renomear uma nota, o sistema atualiza automaticamente todas as ocorrências de \[\[Título Antigo\]\] nos arquivos .md do vault para \[\[Novo Título\]\], preservando a integridade das referências.

> *✅ Decisão: atualização automática. Esta operação deve ser atômica — ou todas as referências são atualizadas, ou nenhuma. Em caso de falha parcial, o sistema deve alertar o usuário.*
>
> *⚠ A atualização automática de referências implica reescrever múltiplos arquivos .md. Implemente com cuidado: leia, substitua em memória e só então escreva — nunca truncar o arquivo durante a operação.*

## 2. Categorias

### 2.1 Estrutura

**RN-030:** Categorias são identificadas internamente por um UUID único, gerado no momento da criação. O nome da categoria não precisa ser único — podem existir duas categorias com o mesmo nome, diferenciadas pelo UUID.

> *✅ Decisão: categorias identificadas por UUID, mesmo modelo das notas. Nomes duplicados são permitidos. A interface deve exibir o UUID ou outro diferenciador visual quando dois itens com mesmo nome aparecerem lado a lado.*

**RN-031:** Uma nota pode ter zero ou uma categoria associada. Não é possível atribuir múltiplas categorias a uma mesma nota.

**RN-032:** A categoria pode ser atribuída via painel de metadados da nota (interface visual, com seletor de categoria) ou referenciada no corpo do texto com a sintaxe \#nome-da-categoria. A referência no texto usa o nome exibido; internamente o sistema resolve para o UUID correspondente.

**RN-033:** Categorias são planas — apenas um nível, sem hierarquia. Exemplos válidos: dev, estudo, trabalho.

**RN-034:** Uma nota pode ter no máximo uma categoria. A interface deve impedir a atribuição de uma segunda categoria quando já houver uma associada.

> *✅ Decisão: limite de exatamente uma categoria por nota. Simplifica o modelo de dados (relação 1:N entre categoria e notas em vez de N:N) e a interface de seleção.*

**RN-035:** Uma categoria pode ter uma cor associada, representada como um valor hexadecimal (ex: \#3498DB). A cor é opcional — se não definida, a interface aplica uma cor padrão.

> *✅ Decisão: cor é um atributo opcional da categoria. A cor é usada para diferenciar visualmente os nós de categoria no grafo e nos rótulos da interface. O valor é armazenado como hex de 6 dígitos (ex: \#3498DB).*

**RN-036:** O nome da categoria tem tamanho máximo de 50 caracteres. A interface deve exibir um contador visual e impedir a confirmação quando o limite for excedido.

> *✅ Decisão: mesmo limite do título das notas — 50 caracteres. Consistência entre as duas entidades.*

### 2.2 Exclusão de Categorias

**RN-040:** Ao excluir uma categoria, ela é desvinculada de todas as notas que a usavam e removida do vault. As notas afetadas ficam sem categoria. A operação exibe um aviso informando quantas notas perderão a categoria antes de confirmar.

> *✅ Decisão: exclusão sem bloqueio. A operação deve exibir um aviso informando quantas notas serão afetadas antes de confirmar.*

**RN-041:** Referências \#nome-da-categoria no corpo das notas não são removidas automaticamente ao excluir a categoria — o texto permanece intacto, mas o link deixa de ser reconhecido como uma categoria ativa.

## 3. Busca

### 3.1 Busca Global

**RN-050:** A busca global cobre títulos e corpos de todas as notas do vault.

**RN-051:** A busca de referências dentro do editor (autocomplete de \[\[...\]\]) cobre apenas títulos de notas.

**RN-052:** A busca global é em tempo real: os resultados são atualizados enquanto o usuário digita, com debounce para evitar buscas excessivas durante a digitação.

> *✅ Decisão: debounce de busca em tempo real. O tempo de debounce a ser definido na implementação — sugestão inicial de 300ms.*

**RN-053:** Na primeira versão, a busca suporta apenas o operador include — busca por substring simples, sem AND, OR ou aspas para frase exata.

> *✅ Decisão: apenas busca por substring (include) no MVP. Operadores avançados (AND, OR, aspas) podem ser adicionados em versões futuras com base no feedback dos usuários.*

**RN-054:** Resultados de busca são ordenados por relevância (número de ocorrências do termo na nota). Em caso de empate, usa a data de edição mais recente como critério de desempate.

> *✅ Decisão: ordenação por relevância com desempate por data de edição mais recente.*

### 3.2 Escopo e Limitações

**RN-055:** A busca é executada localmente no vault do usuário — nenhum dado é enviado para servidores externos.

**RN-056:** A busca não cobre o conteúdo do frontmatter YAML (metadados). Para filtrar por categoria, o usuário usa o painel de categorias, não a busca global.

## 4. Grafo de Relacionamentos

### 4.1 Composição do Grafo

**RN-060:** Cada nota é representada como um nó do grafo.

**RN-061:** Cada categoria é representada como um nó do grafo com visual diferenciado das notas — cor ou forma distintas.

**RN-062:** As arestas do grafo representam conexões de dois tipos: nota → nota (via referência \[\[...\]\]) e nota → categoria (via associação de categoria).

**RN-063:** Todas as notas aparecem no grafo, incluindo notas isoladas (sem nenhuma referência ou categoria). Notas isoladas são exibidas como nós sem arestas.

> *✅ Decisão: notas isoladas aparecem no grafo. Isso ajuda o usuário a identificar notas que ainda não foram conectadas a nada.*

### 4.2 Modos de Visualização

**RN-064:** O grafo possui dois modos de visualização:

- Modo Global (padrão): exibe todas as notas e categorias do vault e todas as suas conexões.

- Modo Foco: ao selecionar uma nota, o grafo exibe apenas aquela nota e seus vizinhos diretos (notas e categorias conectadas a ela em um grau de separação).

> *✅ Decisão: global por padrão, com opção de focar em uma nota. A transição entre os modos deve ser fluida — clicar em um nó pode ativar o modo foco para aquela nota.*

### 4.3 Interação com o Grafo

**RN-070:** Clicar em um nó de nota abre a nota correspondente para edição.

**RN-071:** Clicar em um nó de categoria filtra a lista de notas por aquela categoria.

**RN-072:** O layout do grafo (posição dos nós) não é persistido entre sessões no MVP. O layout é recalculado automaticamente a cada abertura do grafo.

> *✅ Decisão: sem persistência de layout no MVP. Recalcular sempre evita estados inconsistentes quando notas são adicionadas ou removidas. Persistência pode ser adicionada em versões futuras.*

### 4.4 Orphan Links no Grafo

**RN-073:** Orphan links (referências quebradas) não geram arestas no grafo. A aresta só existe quando ambos os nós (nota origem e nota destino) existem.

**RN-074:** A interface do grafo pode destacar visualmente notas que possuem orphan links (ex: ícone de alerta no nó), mas sem criar arestas fantasma.

## 5. Vault e Armazenamento

### 5.1 Definição de Vault

**RN-080:** Vault é a pasta raiz escolhida pelo usuário onde são armazenados os arquivos .md das notas e os arquivos auxiliares do sistema (categories.json, references.json, search-index.json).

**RN-081:** Na primeira execução do app, o usuário escolhe ou cria uma pasta no sistema de arquivos para ser o vault.

**RN-082:** O app é single-user e não possui autenticação. O controle de acesso ao vault é responsabilidade do sistema operacional do usuário.

**RN-083:** Os dados do usuário ficam distribuídos em dois locais: o vault (notas e arquivos auxiliares) e a pasta de configuração do sistema (config.json com o caminho do vault). Nenhuma informação é enviada para servidores externos.

### 5.2 Compatibilidade

**RN-084:** Os arquivos .md gerados pelo NoteGraph devem ser legíveis e editáveis por qualquer editor de texto ou Markdown externo (Obsidian, VS Code, etc.).

**RN-085:** O frontmatter YAML segue o padrão do Obsidian para máxima compatibilidade. Campos proprietários do NoteGraph (como o id) são prefixados para evitar conflitos.

> *💡 Compatibilidade com o Obsidian é um diferencial importante: o usuário nunca fica preso no NoteGraph e pode migrar seus dados a qualquer momento.*

**RN-086:** Os arquivos auxiliares do vault (categories.json, references.json, search-index.json) são derivados dos arquivos .md e podem ser reconstruídos a qualquer momento. Em caso de ausência ou corrupção, o app deve reconstruí-los automaticamente ao iniciar.

> *✅ Decisão: os arquivos .md são a fonte de verdade. Auxiliares são índices derivados — nunca fonte primária.*

**RN-087:** O caminho do vault é armazenado em um arquivo config.json fora do vault, na pasta de dados do sistema operacional gerenciada pelo Electron (ex: ~/.config/NoteGraph/ no Linux, %APPDATA%\NoteGraph\\ no Windows). Na primeira execução, o app solicita ao usuário que escolha ou crie a pasta do vault.

> *✅ Decisão: config.json fora do vault para que o vault possa ser movido, compartilhado ou versionado sem arrastar configurações locais da máquina.*

## 6. Glossário

| **Termo**   | **Definição**                                                                                        |
|-------------|------------------------------------------------------------------------------------------------------|
| Vault       | Pasta raiz no disco do usuário onde todos os arquivos .md são armazenados                            |
| Nota        | Unidade principal de conteúdo: título + corpo em Markdown, salva como arquivo .md                    |
| UUID        | Identificador único universal gerado para cada nota, usado como nome do arquivo .md                  |
| Frontmatter | Bloco de metadados YAML no início do arquivo .md (título, categoria, datas, id)                      |
| Referência  | Link explícito de uma nota para outra usando sintaxe \[\[Título\]\]                                  |
| Orphan link | Referência \[\[Título\]\] cujo alvo foi excluído — link quebrado                                     |
| Categoria   | Label plana associada a uma ou mais notas para agrupamento temático                                  |
| Grafo       | Visualização de notas e categorias como nós e suas conexões como arestas                             |
| Modo Global | Visualização do grafo mostrando todas as notas e categorias do vault                                 |
| Modo Foco   | Visualização do grafo mostrando apenas uma nota e seus vizinhos diretos                              |
| Debounce    | Técnica que atrasa a execução de uma função até o usuário parar de digitar por um intervalo definido |

## 7. Histórico de Revisões

| **Versão** | **Data**   | **Descrição**                                                         | **Autor**    |
|------------|------------|-----------------------------------------------------------------------|--------------|
| 1.0        | 28/03/2026 | Criação e preenchimento do documento com todas as decisões de negócio | Solo founder |
| ✏          | ✏          | ✏                                                                     | ✏            |
