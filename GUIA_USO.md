# DepaManager - Guía de Uso

## 🚀 Configuración Inicial

### 1. Configurar Base de Datos
Asegúrate de tener un archivo `.env` en la carpeta `Backend/` con:
```
DB_HOST=tu_host_mysql
DB_PORT=3306
DB_NAME=depamanager
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_muy_seguro
PORT=3000
```

### 2. Ejecutar Migraciones
```bash
cd Backend
npx sequelize-cli db:migrate
```

## 🏃‍♂️ Ejecutar la Aplicación

### Terminal 1 - Backend
```bash
cd Backend
npm run dev
```
El backend estará en: http://localhost:3000

### Terminal 2 - Frontend  
```bash
cd frontend
npm start
```
El frontend estará en: http://localhost:3001

## 📱 Flujo de Usuario

### 1. Página Principal
- Accede a http://localhost:3001
- Verás 2 botones:
  - **"Soy Administrador"** - Para propietarios
  - **"Soy Inquilino"** - Para inquilinos

### 2. Como Administrador (Propietario)
1. **Registro/Login:**
   - Click en "Soy Administrador"
   - Puedes registrarte o iniciar sesión
   - Al registrarte, se crea automáticamente como rol "propietario"

2. **Dashboard:**
   - Selecciona un plan (Gratuito o Pago)
   - Accede a "Gestión de Inquilinos"

3. **Crear Inquilinos:**
   - Completa el formulario con datos del inquilino
   - Se genera una contraseña automática
   - Comparte las credenciales con el inquilino

### 3. Como Inquilino
1. **Login:**
   - Click en "Soy Inquilino"
   - Usa las credenciales proporcionadas por el administrador
   - Solo login (no registro directo)

2. **Dashboard:**
   - Panel específico para inquilinos
   - Funcionalidades limitadas según el rol

## 🔧 Estructura Técnica

### Autenticación
- JWT tokens almacenados en localStorage
- Roles: `propietario` (admin) y `inquilino` (tenant)
- Middleware de autorización por roles

### API Endpoints Principales
- `POST /api/auth/registro` - Registro de propietarios
- `POST /api/auth/login` - Login universal
- `POST /api/auth/inquilino` - Crear inquilino (solo propietarios)
- `GET /api/auth/dashboard` - Dashboard por rol

### Frontend
- React 19 con Vite
- Tailwind CSS para estilos
- React Router v7 para navegación
- Axios para comunicación con API

## 🛠️ Desarrollo

### Backend
- Node.js + Express
- Sequelize ORM con MySQL
- JWT para autenticación
- Bcrypt para hash de contraseñas

### Frontend
- React 19 con hooks
- Zustand para estado global (opcional)
- Axios con interceptores automáticos
- Rutas protegidas por rol

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT con expiración
- Middleware de autorización
- Validación de roles en cada endpoint
- Logout automático en tokens expirados

## 📝 Notas Importantes

1. El puerto del frontend es 3001 para evitar conflicto con el backend (3000)
2. Los inquilinos NO pueden registrarse directamente
3. Solo los propietarios pueden crear cuentas de inquilinos
4. Las contraseñas se generan automáticamente al crear inquilinos
5. El sistema está en español para los mensajes de usuario

## 🐛 Troubleshooting

- Si hay errores de CORS, verifica que el backend esté en puerto 3000
- Si no cargan los estilos, ejecuta `npm install` en frontend
- Para problemas de base de datos, verifica las credenciales en .env
- Si los tokens no funcionan, verifica JWT_SECRET en .env