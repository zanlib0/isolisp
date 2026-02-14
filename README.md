# isolisp

The idea of this project is to explore the concept of building an isomorphic JS implementation that would let a backend developer implement some frontend logic in the controller, send it over the wire to the frontend, and the frontend would be able to render it and execute things like validation without knowing anything about the logic itself. The frontend can provide some basic components, and a form library, and a lisp evaluator.

See `/docs/conv-1.md` for a Claude Code conversation where this idea was hashed out.

## Monorepo Structure

This is a JavaScript monorepo using npm workspaces:

```
isolisp/
├── apps/
│   ├── backend/          # Node.js/Express backend server
│   └── frontend/         # React frontend with Vite
├── packages/
│   └── shared/           # Shared utilities and constants
└── package.json          # Root workspace configuration
```

## Getting Started

### Installation

Install all dependencies across the monorepo:

```bash
npm install
```

### Development

Run both backend and frontend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Backend only (http://localhost:3000)
npm run dev:backend

# Frontend only (http://localhost:5173)
npm run dev:frontend
```

### Project Details

**Backend** (`apps/backend`)
- Express server on port 3000
- Uses the `@isolisp/shared` package for validation
- Provides REST API endpoints
- Hot reload with `--watch` flag

**Frontend** (`apps/frontend`)
- React app built with Vite
- Uses the `@isolisp/shared` package for client-side validation
- Proxies `/api` requests to backend
- Hot module replacement in development

**Shared Library** (`packages/shared`)
- Common utilities, validation, and constants
- Used by both backend and frontend
- Demonstrates code sharing in the monorepo
