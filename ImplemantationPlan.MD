# Plano de Implementação — Film{IN}hos (Gabarito React)

Você é um agente de implementação. Vá construir a aplicação **completa** seguindo este plano à risca, respeitando a arquitetura em camadas (config → adapter → interceptor → service → hook → provider → componentes) e tipagem forte em `types/`. Não pule etapas, não deixe `TODO`s. Ao final, tudo deve compilar e rodar.

---

## 0. Contexto

App de reviews de filmes inspirado no Letterboxd. API base: `https://tarefaapi.onrender.com/api/v1`.

**Convenções da API (críticas):**
- Todas as respostas de sucesso vêm embrulhadas em `{ "data": ... }`. Listas paginadas trazem também `{ "metadata": {...} }`.
- `POST /account/logout` NÃO vem embrulhado — responde `{ "message": "..." }`.
- Rotas 🔒 exigem header `Authorization: Bearer <token>`.
- Erros de validação (422) vêm em `{ "errors": [{ message, rule, field, meta? }] }`.
- Erros de recurso (404/403) vêm em `{ "message": "..." }`.
- `DELETE` retorna 204 sem body.
- Rating de review: apenas `0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5`.
- `POST /reviews` é **upsert** por `(userId, movieId)` — postar de novo atualiza.
- Favoritar/marcar assistido é **idempotente**.
- `GET /movies/:id` aceita token opcional (retorna `isFavorite`/`isWatched` reais se autenticado).

## 1. Stack e setup

- **Vite + React + TypeScript** (`npm create vite@latest . -- --template react-ts`).
- **React Router DOM v6** para rotas.
- **Axios** para HTTP (usado no adapter).
- **TanStack Query (React Query)** para cache/estado de servidor nos hooks.
- **CSS Modules** ou styled-components (escolha CSS Modules por simplicidade e controle nativo — coerente com preferência por soluções simples/nativas).
- Sem libs de UI pesadas. Componentes próprios.
- Configurar path alias `@/` → `src/`.

Instalar:
```
npm i react-router-dom axios @tanstack/react-query
npm i -D @types/node
```

## 2. Estrutura de pastas

```
src/
├── config/
│   └── env.ts                 # baseURL, chaves de storage, constantes
├── adapters/
│   └── http.adapter.ts        # instância axios + wrapper unwrap {data}
├── interceptors/
│   ├── auth.interceptor.ts    # injeta Bearer token
│   └── error.interceptor.ts   # normaliza erros da API
├── services/
│   ├── auth.service.ts
│   ├── movie.service.ts
│   ├── genre.service.ts
│   ├── review.service.ts
│   ├── account.service.ts
│   └── user.service.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useMovies.ts
│   ├── useMovieDetail.ts
│   ├── useFeaturedMovies.ts
│   ├── useGenres.ts
│   ├── useReviews.ts
│   ├── useRandomReviews.ts
│   ├── useFavorites.ts
│   ├── useWatched.ts
│   ├── useMyReviews.ts
│   ├── useUserProfile.ts
│   └── useDebounce.ts
├── providers/
│   ├── AuthProvider.tsx       # contexto de sessão (user + token)
│   └── AppProviders.tsx       # compõe QueryClient + Auth + Router
├── types/
│   ├── api.types.ts           # ApiResponse<T>, Paginated<T>, Metadata, ApiError
│   ├── auth.types.ts
│   ├── movie.types.ts
│   ├── genre.types.ts
│   ├── review.types.ts
│   └── user.types.ts
├── components/
│   ├── layout/                # Header, Footer, Layout
│   ├── ui/                    # Button, Input, Modal, StarRating, Spinner, Pagination, Carousel, MovieCard, ReviewCard
│   └── guards/                # ProtectedRoute
├── pages/
│   ├── auth/                  # LoginPage, SignupPage
│   ├── HomePage.tsx
│   ├── MovieDetailPage.tsx
│   ├── SearchPage.tsx
│   ├── FavoritesPage.tsx
│   ├── WatchedPage.tsx
│   ├── MyReviewsPage.tsx
│   └── UserProfilePage.tsx
├── routes/
│   └── AppRoutes.tsx
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

## 3. Camada `types/`

**`api.types.ts`:**
```ts
export interface ApiResponse<T> { data: T; }
export interface Metadata {
  total: number; perPage: number; currentPage: number;
  lastPage: number; firstPage: number;
  firstPageUrl: string; lastPageUrl: string;
  nextPageUrl: string | null; previousPageUrl: string | null;
}
export interface Paginated<T> { data: T[]; metadata: Metadata; }
export interface ApiFieldError { message: string; rule?: string; field?: string; meta?: Record<string, unknown>; }
export interface ApiErrorBody { errors?: ApiFieldError[]; message?: string; }
export interface NormalizedError { status: number; message: string; fieldErrors: Record<string, string>; }
```

**`user.types.ts`:** `PublicUser` (`id, fullName, avatarUrl, initials`), `AccountProfile` (adiciona `email, createdAt, updatedAt`), `AuthUser` (`id, fullName, email, createdAt, updatedAt, initials`).

**`genre.types.ts`:** `Genre { id: number; name: string }`.

**`movie.types.ts`:**
- `MovieLite { id, title, posterImageUrl, releaseYear, genres: Genre[] }`
- `MovieDetail` = tudo do lite + `synopsis, bannerImageUrl, durationMinutes, ageRating, contentWarning, cast, createdAt, updatedAt, avgRating: number|null, reviewCount, isFavorite, isWatched`.
- `MovieListParams { q?, genreIds?: number[], page?, perPage? }`.
- `CreateMoviePayload` / `UpdateMoviePayload` conforme docs (usados só se quiser cobrir criação; opcionais para o gabarito).

**`review.types.ts`:**
- `Rating = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5`.
- `Review { id, rating: number, text, createdAt, updatedAt, user: PublicUser, movie: MovieLite }`.
- `UpsertReviewPayload { movieId, rating, text }`, `UpdateReviewPayload { rating, text }`.

**`auth.types.ts`:** `SignupPayload { fullName?, email, password, passwordConfirmation }`, `LoginPayload { email, password }`, `AuthResponse { token, user: AuthUser }`.

## 4. Camada `config/`

`env.ts`:
```ts
export const ENV = {
  API_BASE_URL: 'https://tarefaapi.onrender.com/api/v1',
  TOKEN_STORAGE_KEY: 'filminhos.token',
  USER_STORAGE_KEY: 'filminhos.user',
} as const;
export const DEFAULT_PER_PAGE = 12;
export const RATING_VALUES = [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5] as const;
```

## 5. Camada `adapters/` + `interceptors/`

**`http.adapter.ts`:** cria instância axios com `baseURL: ENV.API_BASE_URL`, registra os dois interceptors, e expõe helpers que **desembrulham** `data`:
```ts
export const http = axios.create({ baseURL: ENV.API_BASE_URL });
// registrar attachAuthInterceptor(http) e attachErrorInterceptor(http)
export const httpClient = {
  get:  <T>(url, config?) => http.get<ApiResponse<T>>(url, config).then(r => r.data.data),
  getRaw: <T>(url, config?) => http.get<T>(url, config).then(r => r.data),      // p/ paginação (precisa de metadata)
  post: <T>(url, body?, config?) => http.post<ApiResponse<T>>(url, body, config).then(r => r.data.data),
  postRaw: <T>(url, body?, config?) => http.post<T>(url, body, config).then(r => r.data), // p/ logout
  put:  <T>(url, body?, config?) => http.put<ApiResponse<T>>(url, body, config).then(r => r.data.data),
  del:  (url, config?) => http.delete(url, config).then(() => undefined),
};
```
> Para endpoints paginados, use `getRaw<Paginated<T>>` porque você precisa de `data` **e** `metadata`.

**`auth.interceptor.ts`:** request interceptor lê o token do storage (via config) e adiciona `Authorization: Bearer <token>` quando existir.

**`error.interceptor.ts`:** response interceptor que, no erro, converte `AxiosError` em `NormalizedError` (extrai `status`, primeira `message` ou junta `errors`, e monta `fieldErrors` mapeando `field → message`). Se `401`, dispara limpeza de sessão (emitir um evento/callback registrado pelo AuthProvider — não importar o provider aqui para evitar ciclo).

## 6. Camada `services/`

Cada service é um objeto sem estado que só chama `httpClient`. Nunca acessa React.

- **`auth.service.ts`:** `signup(payload) → AuthResponse` (`post` em `/auth/signup`), `login(payload) → AuthResponse` (`/auth/login`), `logout()` (`postRaw` em `/account/logout`), `getProfile() → AccountProfile` (`/account/profile`).
- **`genre.service.ts`:** `list() → Genre[]` (`/genres`).
- **`movie.service.ts`:**
  - `list(params: MovieListParams) → Paginated<MovieLite>` via `getRaw`, serializando `genreIds` como `genreIds[]=1&genreIds[]=2` (use `paramsSerializer` do axios ou monte querystring manual).
  - `featured(count=10) → MovieLite[]` (`/movies/featured`).
  - `detail(id) → MovieDetail` (`/movies/:id`).
- **`review.service.ts`:** `listByMovie(movieId, page, perPage) → Paginated<Review>` (`/reviews?movieId=`), `random(count=10) → Review[]` (`/reviews/random`), `upsert(payload) → Review` (`POST /reviews`), `update(id, payload) → Review` (`PUT /reviews/:id`), `remove(id)` (`DELETE`).
- **`account.service.ts`:** `favorites(page, perPage, search) → Paginated<MovieLite>`, `addFavorite(movieId)`, `removeFavorite(movieId)`, `watched(...)`, `addWatched(movieId)`, `removeWatched(movieId)`, `myReviews(page, perPage) → Paginated<Review>`.
- **`user.service.ts`:** `profile(id) → PublicUser`, `favorites(id, page, perPage) → Paginated<MovieLite>`, `watched(id, ...)`, `reviews(id, ...) → Paginated<Review>`.

## 7. Camada `providers/`

**`AuthProvider.tsx`:** contexto com `{ user: AuthUser | null, token: string | null, isAuthenticated, login(payload), signup(payload), logout(), loading }`.
- Inicializa lendo token/user do storage.
- `login`/`signup` chamam o service, persistem token+user no storage, atualizam estado.
- `logout` chama o service, limpa storage e estado.
- Registra no error.interceptor o callback de `logout()` para 401.
- Expor hook `useAuthContext()`.

**`AppProviders.tsx`:** envolve a árvore com `QueryClientProvider` → `AuthProvider` → `BrowserRouter`.

## 8. Camada `hooks/`

Todos usam React Query e delegam aos services. Padrões:
- **`useDebounce(value, delay=400)`** — para inputs de busca.
- **`useAuth()`** — reexporta `useAuthContext`.
- **`useFeaturedMovies()`** — `useQuery(['movies','featured'], () => movieService.featured())`.
- **`useGenres()`** — `useQuery(['genres'], genreService.list)`.
- **`useMovies(params)`** — `useQuery(['movies', params], () => movieService.list(params), { keepPreviousData: true })`.
- **`useMovieDetail(id)`** — detalhe do filme; refetch depende do token (inclua `isAuthenticated` na queryKey).
- **`useReviews(movieId, page)`** — reviews do filme (paginado).
- **`useRandomReviews()`** — home.
- **`useFavorites(page, search)` / `useWatched(page, search)`** — usam account.service, `keepPreviousData`.
- **`useMyReviews(page)`** — account.service.
- **`useUserProfile(id)`** — combina `profile + favorites + watched + reviews` (pode ser hooks separados chamados na página).
- **Mutations** (dentro dos hooks relevantes ou hooks dedicados): `useToggleFavorite`, `useToggleWatched`, `useUpsertReview`, `useUpdateReview`, `useDeleteReview` — todos com `invalidateQueries` nas chaves afetadas (ex.: ao favoritar, invalidar `['movie', id]` e `['favorites']`).

## 9. Componentes UI reutilizáveis (`components/ui/`)

- **`Button`** — variantes primary/ghost/danger.
- **`Input`** — com label e mensagem de erro.
- **`Modal`** — overlay + `role="dialog"`, fecha em ESC/click-fora, usado para criar/editar review.
- **`StarRating`** — dois modos: **display** (mostra avg com meias estrelas) e **interactive** (seleciona um dos `RATING_VALUES`, meia-estrela no hover). Controlado via `value`/`onChange`.
- **`Spinner`** e **`EmptyState`**.
- **`Pagination`** — recebe `metadata`, botões prev/next + números.
- **`Carousel`** — scroll horizontal com setas; recebe `items` e `renderItem`.
- **`MovieCard`** — poster (fallback quando `posterImageUrl` null), título, ano; linka para `/movies/:id`.
- **`ReviewCard`** — avatar/iniciais do user, estrelas, texto, filme; ações opcionais (editar/deletar) via props.
- **`FilterChips`** — chips de gênero adicionáveis/removíveis (para a Pesquisa).

## 10. Layout (`components/layout/`)

- **`Header`** — logo, nav (Home, Pesquisa, Favoritos, Assistidos, Minhas Reviews) e área de sessão (login/avatar+logout). Links protegidos só aparecem autenticado.
- **`Footer`** — links de redes sociais (ícones).
- **`Layout`** — `<Header/> <main><Outlet/></main> <Footer/>`.
- **`ProtectedRoute`** (guards) — redireciona para `/login` se não autenticado.

## 11. Rotas (`routes/AppRoutes.tsx`)

```
/login              → LoginPage        (público)
/signup             → SignupPage       (público)
/                   → HomePage         (dentro do Layout)
/movies/:id         → MovieDetailPage
/search             → SearchPage
/favorites          → FavoritesPage    (protegida)
/watched            → WatchedPage      (protegida)
/my-reviews         → MyReviewsPage    (protegida)
/users/:id          → UserProfilePage
*                   → NotFound / redirect
```
Layout aplicado a todas menos login/signup (ou aplique e esconda header conforme preferir).

## 12. Páginas — requisitos por tela

**LoginPage / SignupPage:** formulários controlados; validação client-side leve (email, senha 8–32, confirmação igual); exibir `fieldErrors` vindos do 422; on success redireciona para `/`.

**HomePage:**
- Carrossel de destaques com `useFeaturedMovies()`.
- Um carrossel **por gênero**: para cada `Genre`, chamar `movieService.list({ genreIds: [g.id], perPage: 15 })` (crie um hook `useMoviesByGenre(genreId)` ou componente `GenreCarousel` que faz seu próprio fetch).
- Lista de reviews aleatórias com `useRandomReviews()`.

**MovieDetailPage:**
- Banner (`bannerImageUrl`, fallback poster) + título, ano, duração, classificação, sinopse, elenco, avg rating (StarRating display) e reviewCount.
- Botões **Favoritar** e **Marcar assistido** (toggle usando `isFavorite`/`isWatched` do detalhe; mutations idempotentes). Só habilitados se autenticado.
- Botão **Deixar review** → abre `Modal` com `StarRating` interativo + textarea → `useUpsertReview`. Como é upsert, se o user já tem review, pré-preencher.
- Lista paginada de reviews do filme (`useReviews(movieId, page)`).

**SearchPage:**
- Input de busca (com `useDebounce`) → `q`.
- `FilterChips` de gênero (add/remove) → `genreIds[]`.
- Lista paginada de `useMovies({ q, genreIds, page })` com `Pagination`.

**FavoritesPage / WatchedPage:**
- Input de busca por nome (`search`, debounced).
- Grid de `MovieCard` paginado (`useFavorites`/`useWatched`).
- `Pagination` via metadata.

**MyReviewsPage:**
- Lista paginada das reviews do user (`useMyReviews`).
- Cada `ReviewCard` com **Editar** (modal com `useUpdateReview`) e **Deletar** (`useDeleteReview` com confirmação).

**UserProfilePage (`/users/:id`):**
- Foto/iniciais e nome (`userService.profile`).
- Carrosséis de assistidos e favoritos (`userService.watched`/`favorites`).
- Lista de reviews (`userService.reviews`).

## 13. Regras de qualidade

- **Zero `any`** — tipar tudo via `types/`. Respostas de service já retornam o tipo desembrulhado.
- Tratar estados **loading / error / empty** em todas as telas (usar `Spinner` e `EmptyState`).
- Fallback de imagem sempre que `posterImageUrl`/`bannerImageUrl`/`avatarUrl` for `null`.
- `keepPreviousData` em listas paginadas para evitar flicker.
- Invalidar queries corretamente após mutations.
- Acessibilidade básica no Modal e StarRating (teclado, aria).
- Não commitar segredos; não há env obrigatório além da baseURL.

## 14. Ordem de execução sugerida

1. Setup Vite + deps + alias + estrutura de pastas.
2. `types/` completos.
3. `config/env.ts`.
4. `adapters/http.adapter.ts` + `interceptors/`.
5. `services/` (todos).
6. `providers/` (Auth + AppProviders) + `hooks/useAuth`, `useDebounce`.
7. Demais `hooks/`.
8. `components/ui/` e `components/layout/` + `ProtectedRoute`.
9. `routes/` + páginas de auth.
10. HomePage → MovieDetailPage → SearchPage → Favorites/Watched → MyReviews → UserProfile.
11. Passar `tsc --noEmit` e `npm run build` sem erros. Corrigir tudo.

Comece pela etapa 1 e vá sequencialmente. Ao terminar cada camada, garanta que compila antes de seguir.