# Copilot / AI Agent Instructions for Colf

Purpose: give an AI coding agent the minimal, concrete knowledge to be productive in this repo.

- Quick start (commands)
  - Install / run dev server: `npm install` then `npm start` (runs `ng serve`).
  - Build: `npm run build` (uses `ng build`).
  - Tests: `npm test` (Karma + Jasmine via Angular CLI).

- Big picture
  - This is a small Angular application (Angular CLI v20.x). Entry point: `src/main.ts`.
  - The app uses the standalone-component style and the modern bootstrap API: `bootstrapApplication(App, appConfig)`.
  - Root component: `src/app/app.ts` (selector `app-root`) with its template at `src/app/app.html` and styles at `src/app/app.css`.
  - Router wiring: `src/app/app.routes.ts` exports the `routes: Routes` array; `src/app/app.config.ts` calls `provideRouter(routes)`.
  - Assets/extra files are served from `public/` (see `angular.json` asset config).

- Important project-specific patterns
  - Standalone components: components declare `imports: [...]` inside the `@Component` decorator (see `src/app/app.ts`).
  - Templates and styles are simple files next to `app.ts` named `app.html` and `app.css` (note: this project does not use the typical `.component.html` naming convention).
  - Reactive primitives: the code uses Angular Signals (e.g. `signal`) for local state in components.
  - App configuration explicitly enables `provideZoneChangeDetection({ eventCoalescing: true })` — avoid changing this without performance validation.
  - Prettier is configured in `package.json` to parse HTML with the `angular` parser; follow this formatting when editing templates.

- Where to make common changes
  - Add routes: edit `src/app/app.routes.ts` and export route entries; `src/app/app.config.ts` already wires `provideRouter(routes)`.
  - Root UI changes: update `src/app/app.html` / `src/app/app.css` or `src/app/app.ts` for component logic.
  - Global/entry changes: `src/main.ts` (bootstrapping) and `index.html` (base HTML).

- Tests & CI
  - Unit tests use Karma. Test configuration is driven by `tsconfig.spec.json` and `angular.json` test target. Use `npm test` locally.

- Merge/update guidance for this file
  - If `.github/copilot-instructions.md` already exists, preserve any author notes and only append or update concrete, discoverable details above.

- Examples (short)
  - Add a simple route (in `src/app/app.routes.ts`):

    export const routes: Routes = [
      { path: '', loadComponent: () => import('./home').then(m => m.Home) }
    ];

  - Update root template: edit `src/app/app.html` (no bundling step required while `ng serve` is running).

- Notes for agents
  - Do not assume Angular CLI defaults beyond `angular.json` and `package.json` — refer to those files for exact build/serve/test commands.
  - Prefer small, conservative changes: this is a minimal app; avoid large refactors unless requested.
  - Preserve explicit performance/config choices (zone change detection + event coalescing) unless the user asks to change them.

If anything here is unclear or you want me to expand examples (routing, components, or tests), tell me which area to elaborate.
