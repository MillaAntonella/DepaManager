# DepaManager - Sistema de Gestión de Alquileres

Sistema completo de gestión de propiedades de alquiler con frontend en React y backend en Node.js.

## 🏗️ Arquitectura del Sistema

### Backend (Node.js + Express + MySQL)
- **Framework**: Express.js con Sequelize ORM
- **Base de Datos**: MySQL con 12 tablas relacionadas
- **Autenticación**: JWT con roles (propietario/inquilino)
- **Estructura**: Patrón MVC con middlewares de seguridad

### Frontend (React)
- **Framework**: React 19.2.0 con React Router v7
- **UI**: Material-UI + CSS personalizado
- **Estado**: Context API para autenticación
- **API**: Axios con interceptores automáticos

## 📊 Modelo de Base de Datos

### Entidades Principales
1. **usuarios** - Gestión de usuarios (propietarios e inquilinos)
2. **propiedades** - Catálogo de inmuebles
3. **inquilinos** - Información de arrendatarios
4. **contratos** - Contratos de alquiler
5. **pagos** - Registro de pagos y morosidad
6. **incidencias** - Sistema de tickets de mantenimiento
7. **proveedores** - Directorio de servicios
8. **inventario** - Control de activos por propiedad
9. **postulantes** - Candidatos a inquilinos
10. **vehiculos** - Registro vehicular de inquilinos
11. **notificaciones** - Sistema de alertas
12. **reportes** - Generación de informes

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### Backend Setup
```bash
cd Backend
npm install
```

### Variables de Entorno (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=depamanager
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_muy_seguro
PORT=3000
```

### Base de Datos
```bash
# Crear la base de datos usando el script SQL
mysql -u root -p < src/config/database.sql

# Ejecutar migraciones (opcional)
npx sequelize-cli db:migrate
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🎯 Estructura del Proyecto

### Backend
```
Backend/
├── src/
│   ├── config/           # Configuración DB y Sequelize
│   ├── controllers/      # Lógica de negocio
│   ├── middlewares/      # Autenticación, validación, errores
│   ├── models/          # Modelos Sequelize
│   ├── routes/          # Definición de endpoints
│   ├── services/        # Servicios externos (en desarrollo)
│   └── utils/           # Constantes y utilidades
├── migrations/          # Migraciones de BD
└── uploads/            # Archivos subidos
```

### Frontend
```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── services/       # API y servicios
│   ├── styles/         # CSS y estilos
│   └── assets/         # Imágenes y recursos
└── public/             # Archivos estáticos
```

## 🔐 Sistema de Autenticación

### Roles y Permisos
- **Propietario**: Acceso completo a todas the funcionalidades
- **Inquilino**: Vista limitada a su información y solicitudes

### Endpoints de Autenticación
```
POST /api/auth/login          # Iniciar sesión
POST /api/auth/registro       # Registro de propietarios
POST /api/auth/crear-inquilino # Crear cuenta de inquilino
GET  /api/auth/perfil         # Obtener perfil
GET  /api/auth/dashboard      # Dashboard personalizado
```

## 📡 API Endpoints

### Propiedades
```
GET    /api/propiedades          # Listar propiedades
GET    /api/propiedades/:id      # Obtener propiedad
POST   /api/propiedades          # Crear propiedad
PUT    /api/propiedades/:id      # Actualizar propiedad
DELETE /api/propiedades/:id      # Eliminar propiedad
PATCH  /api/propiedades/:id/estado # Cambiar estado
```

### Inquilinos
```
GET    /api/inquilinos                    # Listar inquilinos
GET    /api/inquilinos/:id                # Obtener inquilino
POST   /api/inquilinos                    # Crear inquilino
PUT    /api/inquilinos/:id                # Actualizar inquilino
DELETE /api/inquilinos/:id                # Eliminar inquilino
GET    /api/inquilinos/propiedad/:id      # Por propiedad
```

### Contratos
```
GET  /api/contratos                    # Listar contratos
GET  /api/contratos/:id                # Obtener contrato
POST /api/contratos                    # Crear contrato
PUT  /api/contratos/:id                # Actualizar contrato
GET  /api/contratos/proximos-vencer    # Próximos a vencer
```

### Pagos
```
GET  /api/pagos                    # Listar pagos
GET  /api/pagos/:id                # Obtener pago
POST /api/pagos                    # Registrar pago
GET  /api/pagos/estado/pendientes  # Pagos pendientes
GET  /api/pagos/resumen/estadisticas # Resumen estadístico
```

### Incidencias
```
GET   /api/incidencias                  # Listar incidencias
GET   /api/incidencias/:id              # Obtener incidencia
POST  /api/incidencias                  # Crear incidencia
PATCH /api/incidencias/:id/estado       # Cambiar estado
GET   /api/incidencias/estado/:estado   # Por estado
```

## 🛠️ Comandos de Desarrollo

### Backend
```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm test         # Ejecutar tests (pendiente)
```

### Frontend
```bash
npm start        # Servidor de desarrollo
npm run build    # Build de producción
npm test         # Ejecutar tests
```

## 🔧 Funcionalidades Implementadas

- ✅ Sistema de autenticación JWT con roles
- ✅ CRUD completo de propiedades
- ✅ Gestión de inquilinos y contratos
- ✅ Sistema de pagos con estados
- ✅ Manejo de incidencias de mantenimiento
- ✅ Dashboard personalizado por rol
- ✅ Validaciones de entrada y manejo de errores
- ✅ Soft delete en todas las entidades
- ✅ Relaciones complejas entre modelos

## 🚧 En Desarrollo

- ⏳ Sistema de notificaciones
- ⏳ Generación de reportes
- ⏳ Upload de archivos
- ⏳ API para inquilinos
- ⏳ Tests automatizados
- ⏳ Documentación API con Swagger

## 📝 Notas Técnicas

### Seguridad
- Passwords hasheados con bcryptjs
- JWT tokens con expiración
- Middleware de autorización por roles
- Validación de entrada en todos los endpoints

### Base de Datos
- Soft deletes implementados
- Timestamps automáticos
- Hooks de Sequelize para auditoría
- Índices para optimización

### Frontend
- Rutas protegidas por rol
- Manejo automático de tokens
- Intercepción de errores 401/403
- Componentes reutilizables

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## ✨ Estado del Proyecto

**Versión Actual**: 1.0.0-alpha
**Estado**: En desarrollo activo
**Última Actualización**: Diciembre 2024

---

*DepaManager - Simplificando la gestión de propiedades de alquiler* 🏠