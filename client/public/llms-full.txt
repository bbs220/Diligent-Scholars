# Diligent Scholars

A production-grade, full-stack real-time social application architecture built with Express 5, React 19, and Tailwind CSS 4.

---

## 01: Core Architecture

This monorepo leverages modern, bleeding-edge frameworks engineered to minimize latency, maximize security, and streamline development velocity.

| Layer | Selected Library | Architectural Role |
| :--- | :--- | :--- |
| **Backend Framework** | Express `^5.2.1` | Native promise handling, structural request routing, and clean middleware pipelines. |
| **Frontend Core** | React `^19.2.6` | High-efficiency UI rendering, native async handling, and state optimization. |
| **Styling Engine** | Tailwind CSS `^4.3.1` | Ultra-fast build times, container queries, and native `@tailwindcss/vite` compilation. |

---

## 02: Dependency & Strategy Breakdown

### Backend Strategy

```json
{
  "dependencies": {
    "express": "^5.2.1",
    "express-rate-limit": "^8.5.2",
    "helmet": "^8.2.0",
    "pino": "^10.3.1",
    "zod": "^4.4.3"
  }
}
```

| Package / Ecosystem | Production Purpose |
| :--- | :--- |
| **Express 5** | Natively resolves rejected promises in async route handlers, completely removing `try/catch` wrapper boilerplate. |
| **Helmet & Rate Limit** | Hardens the API. `helmet` enforces secure HTTP headers (mitigating XSS) while `rate-limit` blocks brute-force stuffing. |
| **Zod `^4.4.3`** | Guarantees runtime type safety by validating incoming payloads before they hit the controllers. |
| **Pino `^10.3.1`** | High-performance, zero-overhead asynchronous JSON logging that prevents main-thread event-loop blocking. |

### Frontend & Communication Strategy

```json
{
  "dependencies": {
    "@stream-io/video-react-sdk": "^1.39.0",
    "@tanstack/react-query": "^5.101.0",
    "stream-chat-react": "^14.6.0",
    "zustand": "^5.0.14"
  }
}
```

| Package / Ecosystem | Production Purpose |
| :--- | :--- |
| **TanStack Query (v5)** | Manages asynchronous server state, orchestrating cache invalidation, background refetching, and optimistic updates. |
| **Stream IO Engine** | Outsources raw WebSockets/WebRTC architectures, handling edge-routing and media streaming via optimized cloud services. |
| **Zustand `^5.0.14`** | Provides an ultra-lightweight store for client-side ephemeral state, completely bypassing context re-render overhead. |

---

## 03: Monorepo Deployment Controls

The top-level workspace orchestrates development and deployment tasks across boundaries via a dual-prefix build lifecycle:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "build": "npm install --include=dev && tsc && npm install --prefix client --include=dev && npm run build --prefix client",
    "start": "node dist/main.js"
  }
}
```

Hosting providers run a single command (`npm run build`) to automatically provision dependencies, transpile the TypeScript backend, compile frontend assets via `@tailwindcss/vite`, and prepare the app to serve the production static build directly from the compiled backend root.
