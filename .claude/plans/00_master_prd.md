**NoteGraph**

Master PRD — Product Requirements Document

*App desktop de notas interconectadas para desenvolvedores*

|             |                                                  |
|-------------|--------------------------------------------------|
| Versão      | 2.0 — Preenchido                                 |
| Status      | Em elaboração                                    |
| Produto     | NoteGraph — App desktop de notas interconectadas |
| Responsável | Solo founder                                     |
| Data        | 28/03/2026                                       |
| Prazo MVP   | Menos de 1 mês                                   |

> *💡 Este é o documento central do produto. Cada seção aprofundada possui um documento satélite próprio, referenciado ao longo deste PRD. Campos marcados com ✏ ainda precisam ser preenchidos.*

## 1. Visão do Produto

### 1.1 Declaração de Visão

Para desenvolvedores e profissionais de tecnologia que se perdem entre anotações desconexas, o NoteGraph é um app desktop de notas que conecta ideias visualmente através de referências explícitas e um grafo interativo. Diferente do Obsidian, o NoteGraph prioriza uma interface mais simples e direta, reduzindo a curva de aprendizado sem abrir mão do poder das conexões entre notas.

### 1.2 Problema que Resolve

Desenvolvedores acumulam conhecimento fragmentado em múltiplas ferramentas — arquivos de texto, wikis, comentários em código, bookmarks. Ferramentas como o Obsidian resolvem parte do problema, mas sua interface densa e cheia de configurações afasta usuários que querem apenas capturar e conectar ideias sem fricção.

O NoteGraph resolve isso entregando as funcionalidades essenciais — notas em Markdown, referências cruzadas e visualização em grafo — em uma interface limpa, sem configuração excessiva, e com dados 100% locais em arquivos .md que o usuário controla completamente.

### 1.3 Inspirações e Referências

O produto é diretamente inspirado no Obsidian, com as seguintes diferenças de posicionamento:

| **Aspecto**   | **Obsidian**                 | **NoteGraph**                                  |
|---------------|------------------------------|------------------------------------------------|
| Interface     | Rica, altamente configurável | Simples, opinativa, sem configuração excessiva |
| Distribuição  | App proprietário (grátis)    | Open source, self-hosted                       |
| Plugins       | Ecossistema extenso          | Sem plugins no MVP                             |
| Armazenamento | Arquivos .md locais          | Arquivos .md locais (mesmo modelo)             |
| Público-alvo  | Amplo (qualquer pessoa)      | Desenvolvedores e profissionais de tech        |

## 2. Público-Alvo

### 2.1 Persona Principal

| **Atributo**        | **Detalhe**                                                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Nome fictício       | Lucas, 28 anos — Desenvolvedor de Software                                                                                  |
| Perfil              | Dev backend/fullstack, usa muito terminal e editores de texto, valoriza ferramentas que não atrapalham o fluxo de trabalho  |
| Comportamento atual | Mistura Notion, arquivos .md avulsos, comentários em código e bookmarks para guardar conhecimento                           |
| Dor principal       | Perde tempo procurando anotações antigas e não consegue visualizar conexões entre conceitos que estudou                     |
| O que espera        | Uma ferramenta rápida de abrir, sem login, sem configuração, onde ele escreve em Markdown e vê as conexões entre suas notas |

### 2.2 Casos de Uso Primários

- Documentar aprendizados técnicos e conectá-los a conceitos relacionados

- Criar uma base de conhecimento pessoal sobre projetos e decisões de arquitetura

- Mapear visualmente dependências entre conceitos durante estudos

- Manter notas de reuniões e referenciá-las a projetos ou decisões

## 3. Objetivos e Métricas

### 3.1 Objetivos do MVP

- Entregar um app desktop funcional (Electron) em menos de 1 mês

- Permitir criação e edição de notas com suporte completo a Markdown

- Implementar referências cruzadas entre notas via sintaxe \[\[Título\]\]

- Criar sistema de categoria vinculada às notas — uma categoria por nota, com cor opcional e identificação por UUID

- Exibir grafo interativo de relacionamentos entre notas e categorias

- Garantir que todos os dados fiquem em arquivos .md locais no disco do usuário

### 3.2 Métricas de Sucesso

> *💡 Por ser um projeto open source solo, as métricas de sucesso são orientadas a adoção e qualidade do produto, não a receita.*

| **Métrica**                | **Meta (MVP)**           | **Como medir**                      |
|----------------------------|--------------------------|-------------------------------------|
| MVP entregue               | Em menos de 1 mês        | Data de primeiro release público    |
| Stars no GitHub            | 50+ em 3 meses           | GitHub insights                     |
| Issues reportados críticos | 0 bugs de perda de dados | GitHub issues                       |
| Funcionalidades do escopo  | 100% do MVP entregue     | Checklist de features               |
| Feedback qualitativo       | Ao menos 5 devs testando | Issues, comentários, contato direto |

## 4. Escopo do MVP

### 4.1 Funcionalidades Incluídas

| **Funcionalidade**      | **Descrição**                                                                | **Prioridade**   |
|-------------------------|------------------------------------------------------------------------------|------------------|
| Criação de notas        | Título + corpo em Markdown, salvo como arquivo .md                           | P0 — Must have   |
| Edição e exclusão       | CRUD completo de notas via interface desktop                                 | P0 — Must have   |
| Persistência local      | Notas salvas como .md em pasta escolhida pelo usuário                        | P0 — Must have   |
| Referências entre notas | Sintaxe \[\[Título\]\] com autocomplete por busca                            | P0 — Must have   |
| Categorias              | Uma categoria por nota, com cor opcional e referenciável no texto via \#nome | P1 — Should have |
| Visualização em grafo   | Grafo interativo de notas e categorias com suas conexões                     | P1 — Should have |
| Busca global            | Busca em títulos e textos de todas as notas                                  | P1 — Should have |

### 4.2 Fora do Escopo (MVP)

- Autenticação — app é single-user, sem login

- Sincronização entre dispositivos — dados ficam apenas no disco local

- App mobile — apenas desktop no MVP

- Sistema de plugins ou extensões

- Colaboração em tempo real ou compartilhamento de notas

- Exportação para formatos além de .md (PDF, HTML, etc.)

- Histórico de versões de notas (além do que o próprio sistema de arquivos oferece)

- Temas ou customização visual avançada

## 5. Arquitetura Macro

> *💡 Este é um resumo executivo. O detalhamento completo está no documento satélite: Arquitetura Técnica.*

### 5.1 Decisões Técnicas Fundamentais

| **Decisão**         | **Escolha**                                             | **Justificativa**                                                                                                                                                   |
|---------------------|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Plataforma          | Desktop (Electron)                                      | Acesso direto ao sistema de arquivos, sem servidor, sem login                                                                                                       |
| Armazenamento       | Arquivos .md no disco                                   | Dados 100% locais, sem risco de vazamento, legíveis por qualquer editor                                                                                             |
| Autenticação        | Nenhuma                                                 | App single-user; acesso controlado pelo próprio SO do usuário                                                                                                       |
| Categorias          | Uma por nota, identificada por UUID, cor opcional (hex) | Simplifica modelo de dados (1:N) e interface de seleção                                                                                                             |
| Modelo de negócio   | Open source                                             | Público de devs valoriza transparência e controle do código                                                                                                         |
| Frontend (Renderer) | React 18 + TypeScript 5 + CodeMirror 6 + Cytoscape.js   | Ecossistema React + TypeScript para tipagem dos contratos IPC; CodeMirror 6 para editor com autocomplete \[\[...\]\]; Cytoscape.js para grafo com layout automático |

### 5.2 Fluxo de Dados

Os dados do usuário ficam distribuídos entre o vault (no disco local) e a pasta de configuração do sistema. Nenhuma informação é enviada para servidores externos:

> Usuário → Interface (Renderer) → Main Process (Electron) → vault/ (.md + auxiliares) \| ~/.config/ (config.json)

## 6. Documentos Satélites

Este PRD é o documento central. Os temas abaixo são detalhados em documentos específicos:

| **Documento**       | **Conteúdo**                                      | **Status** |
|---------------------|---------------------------------------------------|------------|
| Regras de Negócio   | Lógicas, restrições, casos de borda do sistema    | Concluído  |
| Arquitetura Técnica | Componentes Electron (Main/Renderer), IPC, fluxos | Concluído  |
| Stack & Frameworks  | Tecnologias escolhidas e justificativas           | Concluído  |
| Modelo de Dados     | Estrutura dos arquivos .md e metadados            | Concluído  |

## 7. Premissas e Restrições

### 7.1 Premissas

- O usuário é desenvolvedor ou profissional de tecnologia — familiarizado com Markdown e conceitos técnicos

- O usuário tem um computador desktop ou notebook com sistema operacional Windows, macOS ou Linux

- Cada instalação do NoteGraph serve um único usuário — não há cenário multi-usuário no MVP

- O usuário escolhe e gerencia a pasta onde suas notas serão salvas

- Arquivos .md criados pelo NoteGraph são compatíveis com outros editores (Obsidian, VS Code, etc.) — metadados armazenados em frontmatter YAML padrão

- O projeto será desenvolvido por uma única pessoa em menos de 1 mês

### 7.2 Restrições

- Sem servidor — toda a lógica roda localmente via Electron. Dados distribuídos entre o vault (notas + auxiliares) e a pasta de configuração do SO (config.json)

- Sem autenticação — controle de acesso é responsabilidade do sistema operacional do usuário

- Sem sincronização entre dispositivos no MVP

- Sem versão mobile no MVP — apenas desktop

- Prazo de menos de 1 mês impõe escopo fechado; nenhuma feature fora do P0/P1 entra no MVP

- Stack do frontend definida: React 18 + TypeScript 5 + CodeMirror 6 + Cytoscape.js + Electron Forge com Vite

## 8. Riscos

| **Risco**                                                                | **Probabilidade** | **Mitigação**                                                                                   |
|--------------------------------------------------------------------------|-------------------|-------------------------------------------------------------------------------------------------|
| Prazo de 1 mês insuficiente para todas as features P0 + P1               | Alta              | Priorizar P0 absolutamente; grafo e categorias (P1) podem ser cortados se necessário            |
| Complexidade do grafo interativo subestimada                             | Média             | Usar Cytoscape.js (escolhido) com layout cose automático; não construir do zero                 |
| Perda de dados por bug na escrita de arquivos .md                        | Baixa             | Escrever arquivo novo antes de sobrescrever o anterior; testes de integração nos fluxos de save |
| Diferencial de 'interface mais simples' difícil de comunicar vs Obsidian | Média             | Capturar screenshots comparativos; focar em onboarding zero-config no README                    |
| Falta de adoção por ser mais um app de notas                             | Média             | Lançar cedo, colher feedback de devs reais, iterar rápido no pós-MVP                            |

## 9. Histórico de Revisões

| **Versão** | **Data**   | **Descrição**                                                                                                                   | **Autor**    |
|------------|------------|---------------------------------------------------------------------------------------------------------------------------------|--------------|
| 1.0        | 28/03/2026 | Criação do documento (template)                                                                                                 | Solo founder |
| 2.0        | 28/03/2026 | Preenchimento com decisões do produto: Electron, .md local, sem auth, open source                                               | Solo founder |
| 3.0        | 28/03/2026 | Revisão geral: stack definida (React + TS + CodeMirror 6 + Cytoscape.js), satélites concluídos, restrições e riscos atualizados | Solo founder |
| ✏          | ✏          | ✏                                                                                                                               | ✏            |
