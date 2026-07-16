// Must match `use.baseURL`/`webServer.url` in playwright.config.ts. Kept as an
// explicit constant (rather than relative `page.goto('/')` calls) because an
// absolute-path relative reference resolves against the *origin*, dropping
// the `/roldaices-character-sheets/` base path Vite serves the app under —
// only fragment-only references (`page.goto('#/mazes')`) are safe to resolve
// relative to `baseURL`.
export const BASE_URL = 'http://localhost:5173/roldaices-character-sheets/'
