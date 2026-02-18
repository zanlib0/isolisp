# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

isolisp is an isomorphic Lisp DSL evaluator that lets backend developers define business logic (validations, field visibility rules) as Lisp expressions serializable to JSON. The same logic runs identically on both Express.js backend and React frontend. The example use case is a dynamic form with PESEL (Polish national ID) checksum validation.

This is a toy project that's not going to production. Do not focus on architecture or tests when modifying code. Everything should be maximally simple and readable, written in a functional style.

## Monorepo Structure

pnpm workspaces with three packages:

- **`packages/dsl`** (`@isolisp/dsl`) — The Lisp evaluator, stdlib, and utilities. This is the core of the project.
- **`apps/backend`** — Express.js server that defines form schemas with embedded Lisp rules and validates submissions.
- **`apps/frontend`** — React + Vite + Formik app that fetches schemas and evaluates the same Lisp rules client-side.

## Commands

```bash
# Install dependencies
pnpm install

# Run both backend (port 3000) and frontend (port 5173) concurrently
pnpm dev

# Run individually
pnpm dev:backend
pnpm dev:frontend

# Run all tests (currently only dsl package has tests)
pnpm test

# Run DSL tests only
pnpm --filter dsl test

# Lint
pnpm lint
pnpm lint:fix

# Build frontend
pnpm build:frontend
```

## DSL Evaluator Architecture (`packages/dsl`)

The evaluator is a ~144-line Lisp interpreter. Key design choices:

- **Symbols** are `{s: "name"}` objects (not native JS Symbols) so they survive JSON serialization over the wire.
- **References** are `{r: "fieldName"}` objects that look up form field values from a context object passed to `evaluate()`.
- **Environment** is modeled as a chain of functions `(symbol) => value`, not a hash map. Each scope level is a closure wrapping the outer scope.
- **Special forms** use their own special methods of evaluation, everything else is eagerly evaluated.

Entry point: `evaluate(term, context)` — evaluates a Lisp term (nested JS arrays/objects) with an optional context for reference resolution.

The stdlib (`stdlib.js`) provides arithmetic, list operations, string/type utilities, and comparisons. Helper `s()` and `r()` create symbols and references; `prettyprint()` renders expressions as readable Lisp strings.

## Isomorphic Flow

1. Backend defines form schemas with Lisp validation rules as JSON-serializable arrays (`rules.js`, `schemas.js`)
2. Frontend fetches schema via `/api/pesel-schema`, renders form with `DynamicForm`
3. Both frontend and backend call `evaluate()` from `@isolisp/dsl` on the same rule expressions
4. Frontend evaluates for instant feedback; backend re-validates on `POST /api/pesel` submission

## Testing

Uses **vitest** (no config file — defaults). Tests live in `packages/dsl/test/evaluate.test.js`. Only the DSL package has tests; apps have placeholder test scripts.

## Linting

ESLint flat config with `@eslint/js` recommended, React plugin (new JSX transform), and Stylistic plugin. Unused variables prefixed with `_` are allowed.
