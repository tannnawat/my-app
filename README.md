# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## Render deployment (Frontend + API in one Web Service)

Configure the Render **Web Service** with:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment Variables:** `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` (use the PostgreSQL connection values from Render; do not commit secrets).

The Express server serves the Vite build from `dist`, and the frontend calls `/api/login` on the same origin. After deploying, open `/api/health` to check the API; the site root `/` should display the login page.

The demo account buttons are configured for the test password `ChangeMe123!`; this must match the hashes stored for the three test accounts in PostgreSQL.
