# Kerstvakantie Leeschallenge 🎄📚

**Kerstvakantie Leeschallenge** is an interactive, kid-friendly reading app in a Christmas theme, built to help young readers (around age 6) practice words and syllables in a playful, motivating environment.

---

## 🔎 Key features

- Gentle, child-friendly UI with a Christmas/magical theme
- Syllable highlighting and interactive word practice
- Day-based challenges and progress tracking
- Confetti and celebration effects for motivation
- Small Express-based server used to serve the built app in production

---

## ⚙️ Tech stack

- Frontend: React 19 + Vite + TypeScript
- Styling: Tailwind CSS (+ animations)
- Server: Express (TypeScript, bundled with esbuild for production)
- Tooling: pnpm, Prettier, TypeScript, Vitest (dev)

---

## 🚀 Quick start

Prerequisites: Node 18+ and pnpm

1. Install dependencies

```bash
pnpm install
```

2. Start dev server (Vite, with HMR)

```bash
pnpm dev
```

3. Build for production (this builds the client and bundles the server)

```bash
pnpm build
```

4. Start the production server (after build)

```bash
pnpm start
```

Preview the built client locally with:

```bash
pnpm preview
```

Useful checks/formatters:

- Type checking: `pnpm check` (runs `tsc --noEmit`)
- Format code: `pnpm format` (runs Prettier)

> ⚠️ The server reads `NODE_ENV` and uses `process.env.PORT` (defaults to `3000`).

---

## 📁 Project structure (high level)

- `client/` – frontend source (Vite + React + TypeScript)
  - `src/` – app code, components, hooks, pages
  - `public/woordenlijst.json` – word list used by the app
- `server/` – small Express server (`index.ts`) used to serve `dist` in production
- `patches/` – pnpm patches (e.g. patched `wouter`)
- `ideas.md` – design brainstorming and notes (the app uses the "Magisch Winterwonderland" concept)

---

## 🧪 Tests & utilities

- Vitest is included as a dev dependency; run with `pnpm exec vitest` for unit / component tests.
- Use `pnpm check` to run TypeScript checks.

---

## ✍️ Contributing

- Create issues for bugs and feature requests
- Fork & open a PR for code changes
- Run `pnpm format` before opening a PR
- Keep changes small and add tests where appropriate

---

## 💡 Development notes

- The production `build` script runs `vite build` and uses `esbuild` to bundle `server/index.ts` into `dist` so the server can be started with `node dist/index.js`.
- Word data lives in `client/public/woordenlijst.json` — edit or extend this file to add more words.
- The repo uses `pnpm` and contains a patched dependency under `patches/` (see `package.json` -> `pnpm.patchedDependencies`).

---

## 📄 License

This project is licensed under the **MIT** License.

---

Enjoy building and iterating! 🎉
