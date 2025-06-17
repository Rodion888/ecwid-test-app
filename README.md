# Ecwid Test App

> **Application for Ecwid Developer Position**  
> Vue.js & TypeScript Test Task with SSR

[![Live Demo](https://img.shields.io/badge/Live_Demo-ecwid--test--app.vercel.app-blue?style=for-the-badge)](https://ecwid-test-app.vercel.app/)
<br/>
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.13-green?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.4-purple?style=flat-square&logo=vite)](https://vitejs.dev/)

---

## Overview

Vue.js application with Server-Side Rendering (SSR), featuring product catalog, shopping cart, and integration with Ecwid REST API.

---

## Tech Stack

### Frontend

- **Vue.js** 3.5.13
- **TypeScript** 5.8.0
- **Vite** 6.2.4
- **Vue Router** 4.5.0
- **Pinia** 3.0.1

### Backend & SSR

- **Express.js** 4.19.2
- **Server-Side Rendering** with Vite SSR

### API Integration

- **Ecwid REST API**

---

## Development

```bash
# Clone repository
git clone https://github.com/Rodion888/ecwid-test-app.git
cd ecwid-test-app

# Install dependencies
npm install

# Start development server (SPA)
npm run dev

# Start SSR development server
npm run dev:ssr

# Build for production
npm run build

# Lint & format code
npm run lint
npm run format

# Type checking
npm run type-check
```

**Development servers:**
- SPA: http://localhost:5173
- SSR: http://localhost:3000

---

## Project Structure

```
src/
├── components/         # Reusable UI components
├── views/              # Page components
├── stores/             # Pinia stores
├── services/           # API services
├── types/              # TypeScript interfaces
├── router/             # Vue Router configuration
├── styles/             # Global styles
├── app.ts              # Vue app factory
├── entry-client.ts     # Client entry point
└── entry-server.ts     # SSR entry point
```

---

## Links

- **Live Demo:** [ecwid-test-app.vercel.app](https://ecwid-test-app.vercel.app/)
- **Repository:** [github.com/Rodion888/ecwid-test-app](https://github.com/Rodion888/ecwid-test-app)

---

<div align="center">

**Built with ❤️ for Ecwid**

</div>
