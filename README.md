# Receitas — Sistema de Gerenciamento de Receitas e Categorias

Aplicação em camadas (SRP) construída com Node.js, TypeScript e Express, com contêiner simples de injeção de dependências. Inclui serviços de negócio, repositórios em memória e API HTTP.

## Sumário
- Visão Geral
- Arquitetura
- Pré-requisitos
- Instalação
- Execução
- Endpoints
- Exemplos rápidos (Windows)
- Estrutura do projeto
- Trocar implementações via DI

## Visão Geral
- CRUD de Categorias, Ingredientes e Receitas.
- Busca e filtragem de receitas por `categoryId` e por texto (`search`).
- Regras de negócio:
  - Unicidade de nome para Categoria e Ingrediente.
  - Receita deve referenciar uma Categoria existente.
  - Bloqueio de exclusão de Categoria quando houver Receitas relacionadas.

## Arquitetura
- `domain`: entidades e contratos de repositório.
- `infrastructure`: implementações concretas (aqui, memória) e contêiner DI.
- `application`: serviços de negócio, sem HTTP ou detalhes de persistência.
- `presentation`: API HTTP (Express), rotas, middlewares e composição.

Referências úteis no código:
- Servidor e composição: `src/presentation/http/server.ts`.
- Contêiner DI: `src/infrastructure/di/container.ts`.
- Serviços: `src/application/services/*Service.ts`.
- Rotas: `src/presentation/http/routes/*.ts`.

### Fábricas de domínio
- `src/domain/factories.ts` centraliza a criação de entidades (`Category`, `Ingredient`, `Recipe`).
- As fábricas geram `id` (`randomUUID`) e `createdAt` (`new Date`), fazem `trim` e copiam arrays.
- Os serviços usam as fábricas e passam a entidade criada para os repositórios.

## Pré-requisitos
- Node.js 18+ (recomendado 20+)
- npm 9+

## Instalação
1. Baixar o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd receitas
   ```
   Substitua `<URL_DO_REPOSITORIO>` pelo endereço do seu repositório.
2. Instalar dependências:
   ```bash
   npm install
   ```

## Execução
- Desenvolvimento:
  ```bash
  npm run dev
  ```
- Produção local:
  ```bash
  npm run build
  npm start
  ```
- Porta: `PORT` (opcional). Padrão `3000`.

## Endpoints
Categorias
- `GET /categories` — lista todas
- `GET /categories/:id` — detalhe
- `POST /categories` — cria `{ name }`
- `PUT /categories/:id` — atualiza `{ name? }`
- `DELETE /categories/:id` — remove (bloqueado se houver receitas)

Ingredientes
- `GET /ingredients` — lista todos
- `GET /ingredients/:id` — detalhe
- `POST /ingredients` — cria `{ name }`
- `PUT /ingredients/:id` — atualiza `{ name? }`
- `DELETE /ingredients/:id` — remove

Receitas
- `GET /recipes?categoryId=&search=` — lista com filtros
- `GET /recipes/:id` — detalhe
- `POST /recipes` — cria `{ title, description?, ingredients[], steps[], categoryId }`
- `PUT /recipes/:id` — atualiza parcial dos mesmos campos
- `DELETE /recipes/:id` — remove

Códigos de erro: as validações retornam `400` com `{ error: "mensagem" }` (middleware em `src/presentation/http/middlewares/errorHandler.ts`).

## Exemplos rápidos (Windows PowerShell)
- Criar categoria usando arquivo:
  ```powershell
  curl.exe -s -X POST http://localhost:3000/categories -H "Content-Type: application/json" --data @requests/category.json
  ```
- Criar ingrediente usando arquivo:
  ```powershell
  curl.exe -s -X POST http://localhost:3000/ingredients -H "Content-Type: application/json" --data @requests/ingredient.json
  ```
- Criar receita (ajuste `categoryId`):
  ```powershell
  curl.exe -s -X POST http://localhost:3000/recipes -H "Content-Type: application/json" --data @requests/recipe.json
  ```
- Listar categorias:
  ```powershell
  curl.exe -s http://localhost:3000/categories
  ```
- Listar ingredientes:
  ```powershell
  curl.exe -s http://localhost:3000/ingredients
  ```
- Filtrar receitas por texto:
  ```powershell
  curl.exe -s "http://localhost:3000/recipes?search=chocolate"
  ```

## Estrutura do projeto
```
receitas/
├─ src/
│  ├─ domain/
│  │  ├─ entities/
│  │  │  ├─ Category.ts
│  │  │  └─ Recipe.ts
│  │  └─ repositories/
│  │     ├─ ICategoryRepository.ts
│  │     └─ IRecipeRepository.ts
│  ├─ infrastructure/
│  │  ├─ di/
│  │  │  └─ container.ts
│  │  └─ repositories/
│  │     └─ memory/
│  │        ├─ CategoryMemoryRepository.ts
│  │        ├─ IngredientMemoryRepository.ts
│  │        └─ RecipeMemoryRepository.ts
│  ├─ application/
│  │  └─ services/
│  │     ├─ CategoryService.ts
│  │     ├─ IngredientService.ts
│  │     └─ RecipeService.ts
│  └─ presentation/
│     └─ http/
│        ├─ middlewares/errorHandler.ts
│        ├─ routes/categories.ts
│        ├─ routes/ingredients.ts
│        ├─ routes/recipes.ts
│        └─ server.ts
├─ requests/
│  ├─ category.json
│  ├─ ingredient.json
│  ├─ ingredient-update.json
│  └─ recipe.json
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Trocar implementações via DI
Altere apenas os registros do contêiner em `src/infrastructure/di/container.ts`:
- Substitua `*MemoryRepository` por implementações de banco (ex.: SQLite/PostgreSQL).
- Os serviços e rotas permanecem inalterados porque dependem dos contratos (`ICategoryRepository`, `IIngredientRepository`, `IRecipeRepository`).

### Observação sobre DTOs de criação
- Os repositórios recebem entidades já criadas com `id` e `createdAt` (gerados pelo serviço/fábrica).
- As requisições HTTP enviam apenas os campos de entrada (ex.: `{ name }` para categoria/ingrediente; `{ title, description?, ingredients[], steps[], categoryId }` para receita).

## Scripts
- `npm run dev` — inicia em modo desenvolvimento (ts-node)
- `npm run build` — compila TypeScript
- `npm start` — executa o build compilado
