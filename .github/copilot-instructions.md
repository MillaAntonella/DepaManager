# Copilot / AI Agent Instructions for DepaManager

Purpose: give an AI coding agent immediate, actionable context for making correct changes in this monorepo (Backend + Frontend).

Quick architecture
- Monorepo with two main services: `Backend/` (Node/Express + Sequelize + MySQL) and `frontend/` (React CRA).
- Backend exposes REST endpoints under `/api/*`. Frontend talks to the backend via `frontend/src/services/api.js` which sets baseURL to `http://localhost:3000/api` and injects JWT tokens from localStorage.
- Auth flow: JWT issued by `Backend/src/controllers/auth.controller.js` on login/registro; validated by `Backend/src/middlewares/auth.middleware.js`. Roles are `propietario` and `inquilino` and guard many routes.

Key files to reference when changing behavior
- Backend entry: `Backend/src/index.js` (sets up Express, routes, DB sync)
- Sequelize config: `Backend/src/confaig/sequelize.js` and `Backend/src/config/database.sql` (schema/migrations live in `Backend/migrations/`)
- Auth controller: `Backend/src/controllers/auth.controller.js` (login, registro, crearInquilino, obtenerDashboard)
- Auth middleware: `Backend/src/middlewares/auth.middleware.js` (verificarToken, verificarRol, soloPropietarios)
- User model: `Backend/src/models/usuario.js` (fields and defaults; password hashing handled in controller)
- Frontend API wrapper: `frontend/src/services/api.js` (axios instance; attaches Authorization header; handles 401 by clearing localStorage and redirecting)
- Frontend routing: `frontend/src/App.js` and pages under `frontend/src/pages/` (roles selection and protected pages live here)

Environment & run scripts (developer workflows)
- Backend
  - Start: `cd Backend; npm run start` (reads `.env` for DB and JWT secret). Use `npm run dev` for nodemon.
  - Sequelize CLI available as dev dependency (`sequelize-cli`) for running migrations under `Backend/migrations`.
  - DB: expects MySQL and env vars: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `PORT`.
- Frontend
  - Start: `cd frontend; npm start` (CRA dev server on default port 3000)
  - Build: `npm run build`

Important conventions & patterns
- Role-based access: controllers often expect `req.usuario` populated by `verificarToken` middleware. When adding routes that require authentication, wire `verificarToken` (or `soloPropietarios` / `soloInquilinos`) and use `req.usuario.id`/`req.usuario.rol` instead of reading tokens directly.
- Token is stored client-side in `localStorage` under `token` and `usuario`. Frontend Axios instance injects `Authorization: Bearer <token>`.
- Backend returns Spanish message strings (e.g., `mensaje: 'Perfil obtenido exitosamente'`) — match the existing language when adding user-facing responses.
- Password handling: controllers hash passwords with `bcryptjs` before calling `Usuario.create`.
- Role creation rules: only `propietario` can register directly; `inquilino` accounts are created by owners using `crearInquilino`. Do not change this logic without updating frontend UX flows.

Testing & debugging notes
- There are no automated tests configured. Use manual testing: run Backend (`npm run dev`) and Frontend (`npm start`) and exercise endpoints via the UI or curl/Postman.
- Common dev pitfall: Frontend CRA also defaults to port 3000; Backend uses port from env or 3000. If both run on 3000, change frontend port (set `PORT=3001` before `npm start`) or backend port in `.env` to avoid conflicts.
- When updating DB models, create a new migration under `Backend/migrations/` (naming prefix timestamp). The repo already has `20241019000001-add-rol-to-usuarios.js` as an example.

Examples (use these exact code locations when modifying behavior)
- Add a protected route that only propietarios can call:
  - Route file: `Backend/src/rutas/auth.routes.js` (see existing routes). Add route middleware: `router.post('/inquilino', verificarToken, soloPropietarios, authController.crearInquilino)`
- Frontend: call protected API and handle tokens:
  - Use `frontend/src/services/api.js` instance: `api.post('/auth/inquilino', payload)`; token will be attached automatically.

Edit style & language
- Files use CommonJS (require/module.exports) in Backend. Keep consistency when editing server code.
- Frontend uses ES modules / React 19 and React Router v7. Keep JSX + hooks patterns consistent.

When to ask the human
- If a change requires DB credentials or running migrations, ask for guidance or a staging DB. Do not attempt to modify `.env` with secrets.
- If a change affects role or auth policy (e.g., allowing direct inquilino registration), confirm product intent before altering controllers and frontend UX.

If you modify package.json scripts or ports
- Update the README or this instructions file with the new scripts/port expectations.

Files worth opening first for context
- `Backend/src/controllers/auth.controller.js`
- `Backend/src/middlewares/auth.middleware.js`
- `frontend/src/services/api.js`
- `frontend/src/App.js`

If this file needs adjustments or you want more details (migrations policy, CI, or any secret handling), tell me what to expand and I will iterate.