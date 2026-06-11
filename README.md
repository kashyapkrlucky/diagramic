# Diagramic

Diagramic is a React-based flowchart and diagram editor. It gives authenticated users a workspace for creating, opening, editing, saving, and deleting drawings, with a canvas-first editor for shapes, freehand drawing, text, color selection, zooming, panning, undo, redo, and canvas clearing.

## Features

- Auth-protected drawing dashboard
- Atlas ID sign-in and guest login
- Create, list, open, update, and delete drawings
- Canvas editor with select, hand, draw, shape, arrow, text, and annotation tools
- Stroke size and color controls
- Zoom, pan, save, undo, redo, and clear actions
- Token refresh handling through Axios interceptors
- SPA routing configured for Vercel rewrites

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- Zustand
- Axios
- Lucide React

## Getting Started

### Prerequisites

- Node.js
- npm
- A running Diagramic-compatible API server

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The Vite dev server will print the local URL, usually `http://localhost:5173`.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
src/
  app/                 App shell, routing, protected routes, error boundary
  components/          Shared UI and editor-specific components
  hooks/               Canvas, auth, fetch, position, and zoom/pan hooks
  lib/                 Axios client configuration
  pages/               Home, editor, and sign-in pages
  shared/              Shared UI primitives and utilities
  store/               Zustand stores for auth, canvas, and drawings
  types/               Shared TypeScript types
  utils/               Canvas and drawing helper functions
```

## API Integration

The frontend expects these drawing and auth endpoints under `${VITE_API_URL}/api`:

- `POST /v1/modules/guest`
- `POST /v1/modules/session`
- `POST /v1/modules/session/refresh`
- `GET /v1/modules/drawings`
- `POST /v1/modules/drawings`
- `GET /v1/modules/drawings/:id`
- `PATCH /v1/modules/drawings/:id`
- `DELETE /v1/modules/drawings/:id`

Access and refresh tokens are stored in local storage. Authenticated API requests include the access token as a bearer token, and the client attempts to refresh tokens once when a request receives `401`.

## Deployment

This project includes a `vercel.json` rewrite rule that routes all paths back to `/`, allowing React Router to handle client-side routes in production.

## License

This project is licensed under the terms in [LICENSE](LICENSE).
