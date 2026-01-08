# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Running AngaX (Frontend + Backend)

This repo includes:

- `cliente/`: React (Vite)
- `servidor/`: Laravel API

### 1) Start the backend (Laravel API)

From the project root:

```bash
cd servidor
php -d upload_max_filesize=20M -d post_max_size=20M -d memory_limit=256M -S 127.0.0.1:8011 router.php
```

Windows shortcuts:

- PowerShell:

```bash
cd servidor
powershell -ExecutionPolicy Bypass -File dev-server.ps1
```

- CMD:

```bash
cd servidor
dev-server.bat
```

Test it:

```bash
curl -i http://127.0.0.1:8011/api/suggested-users
```

### 2) Start the frontend (Vite)

```bash
cd cliente
npm install
npm run dev
```

### API Base URL

By default, in **dev** the frontend uses:

- `http://127.0.0.1:8011/api`

You can override it by creating a local env file (not committed) in `cliente/`:

- `VITE_API_BASE_URL=http://127.0.0.1:8011/api`

