# react-native-clean

Aplicação React Native desenvolvida com Expo e TypeScript para consulta e navegação por repositórios utilizando GitHub e GitLab como fontes de dados.

O projeto foi desenvolvido com foco em Clean Architecture, desacoplamento, troca de fonte de dados em runtime, cache com TanStack Query, Design System tipado e cobertura de testes.

## Funcionalidades

- Busca de repositórios.
- Paginação através de infinite scroll.
- Pull-to-refresh.
- Visualização dos detalhes de um repositório.
- Visualização de issues.
- Paginação de issues.
- Pull-to-refresh de issues.
- Alternância em runtime entre GitHub e GitLab.
- Cache separado por fonte de dados.
- Tratamento de loading, empty state, erros de rede e rate limit.
- Design System próprio e tipado.
- Tema claro e escuro.
- Tela de Showcase do Design System.

## Stack

- Expo
- React Native
- TypeScript
- TanStack Query
- Axios
- Jest
- React Native Testing Library
- ESLint
- Prettier

## Execução

### Requisitos

É necessário possuir:

- Node.js instalado.
- npm instalado.
- Expo Go instalado no dispositivo móvel.

### Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

### Inicialização

Execute:

```bash
npm start
```

Após a inicialização, o Expo exibirá um QR Code no terminal.

Abra o aplicativo **Expo Go** no dispositivo móvel, escaneie o QR Code e aguarde o carregamento da aplicação.

> O projeto utiliza recursos públicos das APIs do GitHub e GitLab e não depende de variáveis de ambiente para execução.

---

# Arquitetura

O projeto foi organizado utilizando os conceitos de Clean Architecture, separando regras de negócio, casos de uso, infraestrutura e apresentação.

A estrutura principal é:

```text
src/
├── domain/
├── application/
├── infrastructure/
├── presentation/
└── shared/
```

## Domain

Responsável pelos conceitos centrais da aplicação e seus contratos.

Contém, entre outros elementos:

- entidades;
- tipos de domínio;
- contratos de repositories;
- erros utilizados pela aplicação.

O domínio não possui dependência de:

- React Native;
- Expo;
- Axios;
- TanStack Query;
- bibliotecas específicas de infraestrutura.

A principal intenção é garantir que as regras e contratos centrais permaneçam independentes de detalhes tecnológicos.

## Application

Responsável por orquestrar as operações da aplicação através dos use cases.

Os principais use cases são:

```text
SearchRepositoriesUseCase
GetRepositoryDetailsUseCase
GetRepositoryIssuesUseCase
```

Os use cases dependem das abstrações definidas no domínio, e não das implementações concretas das APIs.

## Infrastructure

Responsável pelos detalhes externos da aplicação.

Contém:

- Axios Client;
- implementação do repository para GitHub;
- implementação do repository para GitLab;
- tipos específicos das APIs;
- mappers;
- tratamento das particularidades de cada fonte;
- composição das dependências.

GitHub e GitLab implementam o mesmo contrato de repository, enquanto suas diferenças de payload, paginação e identificação são tratadas dentro de suas respectivas implementações.

## Presentation

Responsável pela interface do usuário.

Contém:

- telas;
- hooks;
- providers;
- componentes do Design System.

As telas não realizam chamadas HTTP diretamente e não precisam conhecer detalhes específicos do GitHub ou GitLab.

## Shared

Contém elementos compartilhados pela aplicação, como tema e tokens utilizados pelo Design System.

---

# Por que Clean Architecture?

O principal motivo para utilizar Clean Architecture neste projeto foi garantir que as regras da aplicação não dependessem diretamente de detalhes como HTTP, Axios ou das APIs específicas do GitHub e GitLab.

O teste técnico enfatiza explicitamente:

- inversão de dependência;
- interfaces antes das implementações;
- domínio isolado;
- application separada;
- presentation desacoplada.

A arquitetura adotada segue esses princípios.

Por exemplo, o domínio define o contrato:

```text
RepositoryRepository
```

e as implementações concretas ficam na infraestrutura:

```text
GitHubRepository
GitLabRepository
```

Assim, a camada de aplicação não precisa saber qual tecnologia ou fonte de dados está por trás do contrato.

## Trade-offs

A principal desvantagem é o aumento da quantidade de arquivos e abstrações em comparação com uma implementação direta em uma aplicação pequena.

Neste projeto, essa complexidade foi mantida deliberadamente limitada ao necessário para demonstrar desacoplamento.

Não foi utilizado um framework de Dependency Injection dedicado. A composição das dependências é realizada através de uma solução própria e simples, adequada ao tamanho do projeto.

---

# Multi-provider: GitHub e GitLab

O projeto possui duas fontes de dados:

```text
GitHub
GitLab
```

Apesar de representarem conceitos equivalentes, as duas APIs possuem contratos diferentes.

Para impedir que essas diferenças cheguem à UI, ambas implementam o mesmo contrato definido no domínio.

Conceitualmente:

```text
                    RepositoryRepository
                           ↑
                 ┌─────────┴─────────┐
                 │                   │
        GitHubRepository      GitLabRepository
                 │                   │
           GitHub API          GitLab API
```

Cada implementação possui seus próprios:

- tipos de resposta;
- mappers;
- regras de construção de URLs;
- tratamento de paginação;
- tratamento das particularidades da API.

## Mapeamento

As respostas externas nunca são utilizadas diretamente pela apresentação.

O fluxo é:

```text
GitHub API
    ↓
GitHub response type
    ↓
GitHub mapper
    ↓
Domain model
    ↓
Application / Presentation
```

O mesmo acontece com GitLab.

Isso permite que a apresentação trabalhe com um modelo único.

---

# Troca de fonte em runtime

A fonte ativa é armazenada no `DataSourceProvider`.

O usuário pode alternar entre:

```text
GitHub
GitLab
```

durante a utilização do aplicativo, sem reiniciar a aplicação.

A escolha do usuário altera a fonte ativa e a composição da aplicação fornece a implementação correspondente:

```text
GitHub
   ↓
GitHubRepository

GitLab
   ↓
GitLabRepository
```

A UI não cria repositories e não possui lógica condicional espalhada para decidir qual API utilizar.

A escolha das implementações fica centralizada na composição das dependências.

O fluxo é:

```text
Usuário
   ↓
DataSourceProvider
   ↓
createDependencies
   ↓
GitHubRepository OU GitLabRepository
   ↓
Use Cases
   ↓
Presentation
```

Como resultado, Search, Details e Issues continuam consumindo os mesmos contratos independentemente da fonte ativa.

---

# Identificação do repositório

O projeto utiliza uma referência de domínio baseada em `fullName`.

Exemplo:

```text
facebook/react-native
```

A diferença entre GitHub e GitLab é tratada pela infraestrutura.

No GitHub, a referência é interpretada como:

```text
owner/repository
```

e utilizada para construir endpoints no formato:

```text
/repos/{owner}/{repo}
```

No GitLab, a mesma referência pode ser tratada como um path de projeto e transformada em um identificador URL-encoded quando necessário.

Dessa forma, a camada de aplicação não precisa conhecer as diferenças de identificação entre as APIs.

---

# Cache e Data Fetching

O projeto utiliza **TanStack Query**.

As consultas de repositories e issues utilizam `useInfiniteQuery`, permitindo o carregamento progressivo das páginas através de infinite scroll.

As query keys incluem a fonte de dados.

Exemplo conceitual:

```text
repositories / github / react native
repositories / gitlab  / react native
```

Isso mantém os caches dos providers separados.

Consequentemente, ao alternar entre GitHub e GitLab, os dados previamente carregados de cada fonte permanecem associados à sua própria query enquanto estiverem disponíveis no cache.

Além disso, o TanStack Query é responsável pelo estado e ciclo de vida das consultas, enquanto Axios permanece responsável pelo transporte HTTP.

O fluxo é:

```text
TanStack Query
      ↓
Use Case
      ↓
Repository
      ↓
Axios
      ↓
API
```

---

# Design System

Foi desenvolvido um Design System mínimo e tipado contendo:

```text
Text
Avatar
Badge
Button
Card
Input
SegmentedControl
EmptyState
ErrorState
```

Também foram implementados:

- tokens;
- ThemeProvider;
- tema light;
- tema dark.

Os componentes utilizam propriedades tipadas para suas variações e estados, evitando a necessidade de definir estilos livres em cada tela.

Existe uma tela de **Design System Showcase** para demonstrar os componentes e suas variações.

---

# Estados e UX

A aplicação trata os estados principais de carregamento e comunicação com as APIs.

## Loading

Estados de carregamento inicial são apresentados ao usuário.

Durante o carregamento de páginas adicionais, os dados já exibidos permanecem disponíveis e um estado específico de carregamento é utilizado para a próxima página.

## Empty state

Quando uma busca não retorna resultados, a aplicação apresenta um estado vazio específico.

## Erro de rede

Falhas de comunicação são convertidas para um erro de aplicação e apresentadas com uma mensagem amigável.

## Rate limit

Os limites das APIs são tratados através de `RateLimitError` e apresentados ao usuário sem expor os detalhes técnicos da API.

## Pull-to-refresh

Search e Issues possuem atualização através de pull-to-refresh.

---

# Testes

O projeto possui testes cobrindo:

- Use Cases;
- GitHub Repository;
- GitLab Repository;
- Mappers;
- Hooks;
- Components.

Os testes dos use cases utilizam as abstrações do domínio, sem depender diretamente das APIs externas.

O objetivo é manter as regras de aplicação testáveis de forma isolada.

---

# Uso de IA

O desenvolvimento foi realizado com uso de IA de forma assistida.

Foram utilizadas:

- **Agy**, principalmente em momentos de desenvolvimento assistido por code agent;
- **ChatGPT**;
- **Gemini**.

A IA foi utilizada como ferramenta de apoio ao desenvolvimento, revisão e resolução de problemas, não como substituição das decisões arquiteturais.

## O que foi assistido por IA

A IA foi utilizada durante diferentes etapas do desenvolvimento, incluindo:

- discussão e revisão da arquitetura;
- elaboração de partes da implementação;
- auxílio na escrita de testes;
- revisão de código;
- resolução de problemas de implementação;
- apoio na integração entre as camadas.

## O que foi adaptado

As sugestões foram revisadas e adaptadas ao contexto do projeto.

Em especial, foram rejeitadas ou modificadas sugestões relacionadas a:

- nomes de pastas;
- criação de abstrações desnecessárias;
- estruturas excessivamente complexas;
- over-engineering.

A decisão foi manter a implementação proporcional ao tamanho e ao objetivo do desafio.

## O que foi rejeitado

Foram rejeitadas abordagens que aumentariam a complexidade sem contribuir diretamente para os requisitos do teste.

Um exemplo foi evitar a criação de uma camada genérica de abstração HTTP adicional sobre o Axios. O projeto utiliza um `AxiosClient` isolado na infraestrutura, mantendo a solução menor sem permitir que Axios chegue ao domínio ou aos use cases.

Também foi evitada a adoção de um framework de Dependency Injection dedicado, pois a quantidade de dependências do projeto não justificava essa complexidade.

A utilização de IA foi sempre acompanhada de revisão e validação do código.

---

# Decisões de implementação

Algumas decisões foram tomadas para atender aos requisitos sem introduzir complexidade desnecessária.

## Axios

Axios fica restrito à infraestrutura.

O projeto utiliza um `AxiosClient` para centralizar as chamadas HTTP.

TanStack Query e Axios possuem responsabilidades diferentes:

```text
TanStack Query
→ cache, estados de consulta, refetch e paginação

Axios
→ transporte HTTP
```

## Paginação

A aplicação utiliza `useInfiniteQuery`.

GitHub e GitLab possuem mecanismos diferentes para indicar paginação. Essas diferenças são tratadas pelos repositories específicos de cada provider.

O restante da aplicação recebe um modelo normalizado com:

```text
items
page
hasNextPage
```

## Repositório selecionado

Como os dados necessários à tela de detalhes já estão disponíveis no resultado da busca, o projeto utiliza a entidade `Repository` já carregada para navegar da Search para Details, evitando uma nova chamada desnecessária para obter os mesmos dados.

---

# Limitações conhecidas

Algumas melhorias ficaram fora do escopo atual:

- os filtros da tela de busca poderiam ser mais completos, permitindo filtrar por linguagem e adicionar opções de ordenação;
- a tela de Issues poderia possuir uma tela ou fluxo adicional para visualizar comentários de uma issue;
- o projeto ainda não possui uma pipeline de CI com GitHub Actions;
- os commits ainda podem ser refinados para ficarem mais estritamente atômicos e consistentes.

Esses pontos poderiam ser tratados em uma próxima evolução do projeto.

---

# O que eu faria diferente com mais tempo

Com mais tempo, eu priorizaria:

### GitHub Actions

Adicionar CI para automatizar:

- instalação;
- lint;
- testes;
- validação do projeto.

### Issues

Adicionar uma tela de detalhes da issue, incluindo seus comentários.

### Busca

Evoluir os filtros da busca com opções como:

- linguagem;
- ordenação;
- outros critérios relevantes para refinamento dos resultados.

---

# Histórico de commits

Durante o desenvolvimento, foi buscada uma estratégia de commits pequenos e descritivos, separando evolução arquitetural, funcionalidades e testes.

O histórico ainda pode ser melhorado em alguns pontos para ficar mais estritamente atômico e consistente.

---

# Status

O projeto atende aos principais requisitos funcionais e arquiteturais do teste técnico:

- [x] Expo + TypeScript
- [x] Busca de repositories
- [x] Paginação / infinite scroll
- [x] Detalhes do repository
- [x] Issues
- [x] GitHub
- [x] GitLab
- [x] Troca de provider em runtime
- [x] Clean Architecture
- [x] Design System tipado
- [x] Design System Showcase
- [x] Light / Dark theme
- [x] TanStack Query
- [x] Cache separado por provider
- [x] Pull-to-refresh
- [x] Loading state
- [x] Empty state
- [x] Network error
- [x] Rate limit
- [x] Testes de Use Cases
- [x] Testes de repositories
- [x] Testes de mappers
- [x] Testes de hooks
- [x] Testes de components
- [x] Documentação do uso de IA
