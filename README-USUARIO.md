# 🏢 DepaManager - Manual de Usuario

## 📋 Índice
1. [¿Qué es DepaManager?](#qué-es-depamanager)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Panel de Administrador](#panel-de-administrador)
4. [Panel de Inquilino](#panel-de-inquilino)
5. [Solución de Problemas](#solución-de-problemas)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🏠 ¿Qué es DepaManager?

**DepaManager** es un sistema completo de gestión de alquileres que permite a propietarios administrar sus propiedades e inquilinos de manera eficiente, mientras que los inquilinos pueden gestionar sus pagos y comunicarse con los administradores.

### ✨ Características Principales

**Para Propietarios:**
- 👥 Gestión completa de inquilinos
- 💰 Control de pagos y vencimientos
- 📊 Dashboard con estadísticas
- 🔧 Gestión de incidencias y reparaciones
- 📧 Sistema de notificaciones

**Para Inquilinos:**
- 💳 Visualización de pagos pendientes
- ✅ Marcado de pagos realizados
- 🛠️ Reporte de incidencias
- 📱 Notificaciones importantes
- 👤 Gestión de perfil personal

---

## 🚪 Acceso al Sistema

### 🌐 Acceder a la Plataforma

1. **Abrir navegador web** (Chrome, Firefox, Edge, Safari)
2. **Ir a la dirección:** `http://localhost:5173` (desarrollo) o la URL proporcionada
3. **Página de inicio:** Verás dos opciones principales

### 🎯 Página de Inicio

![Landing Page](docs/images/landing.png)

La página inicial te ofrece dos opciones:

#### 🏢 **Acceso Administrador**
- **Botón**: "Acceso Administrador"
- **Para**: Propietarios que gestionan propiedades
- **Funciones**: Panel completo de administración

#### 🏠 **Acceso Inquilino**  
- **Botón**: "Acceso Inquilino"
- **Para**: Personas que alquilan una propiedad
- **Funciones**: Panel personal de inquilino

---

## 👔 Panel de Administrador

### 🔐 Inicio de Sesión - Administrador

![Admin Login](docs/images/admin-login.png)

#### Credenciales de Acceso
- **Email**: Tu email registrado como propietario
- **Contraseña**: Tu contraseña personal
- **Rol**: Automáticamente identificado como "Propietario"

#### Proceso de Login
1. **Ingresar email** en el campo correspondiente
2. **Ingresar contraseña** 
3. **Hacer clic** en "Iniciar Sesión"
4. **Redirección automática** al dashboard administrativo

#### ¿Primera vez? - Registro
Si no tienes cuenta:
1. **Hacer clic** en "¿No tienes cuenta? Regístrate"
2. **Completar datos**:
   - Nombre completo
   - Email válido
   - Contraseña segura
3. **Confirmar registro**
4. **Iniciar sesión** con las credenciales creadas

### 📊 Dashboard Principal

![Admin Dashboard](docs/images/admin-dashboard.png)

#### Vista General
El dashboard te muestra un resumen completo de tu negocio:

**📈 Estadísticas Principales**
- 👥 **Total Inquilinos**: Número de inquilinos activos
- 💰 **Total Pagos**: Cantidad total de pagos registrados
- 🔧 **Incidencias Abiertas**: Reparaciones pendientes
- ⏰ **Pagos Pendientes**: Pagos sin realizar
- 💵 **Ingresos del Mes**: Ingresos mensuales

**🔄 Navegación por Pestañas**
- **Dashboard**: Vista general con estadísticas
- **Gestión de Pagos**: Administrar todos los pagos
- **Gestión de Incidencias**: Manejar reparaciones
- **Gestión de Inquilinos**: Administrar inquilinos

### 💰 Gestión de Pagos

![Payment Management](docs/images/payment-management.png)

#### Ver Todos los Pagos
- **Lista completa** de pagos de todos los inquilinos
- **Filtros disponibles**:
  - Por estado: Pendiente, Pagado, Vencido
  - Por inquilino
  - Por fecha
- **Información mostrada**:
  - Nombre del inquilino
  - Monto del pago
  - Fecha de vencimiento
  - Estado actual
  - Concepto del pago

#### ➕ Crear Nuevo Pago

**Paso 1: Abrir Modal de Creación**
1. **Hacer clic** en "➕ Crear Pago"
2. **Se abre ventana modal** con formulario

**Paso 2: Completar Información**
```
📝 Formulario de Nuevo Pago:
- Inquilino: [Seleccionar de lista desplegable]
- Monto: [Ejemplo: 500.00]
- Fecha Vencimiento: [Seleccionar fecha]
- Concepto: [Ejemplo: "Alquiler Marzo 2024"]
- Observaciones: [Opcional]
```

**Paso 3: Guardar Pago**
1. **Revisar información** ingresada
2. **Hacer clic** en "Crear Pago"
3. **Confirmación**: El pago aparece en la lista
4. **Notificación**: El inquilino ve el nuevo pago

#### ✏️ Editar Pagos Existentes
1. **Ubicar el pago** en la lista
2. **Hacer clic** en icono de edición (✏️)
3. **Modificar campos** necesarios
4. **Guardar cambios**

#### ✅ Marcar Como Pagado
1. **Encontrar pago pendiente**
2. **Hacer clic** en "Marcar como Pagado"
3. **Confirmación**: Estado cambia a "Pagado"
4. **Actualización automática** de estadísticas

#### 🗑️ Eliminar Pagos
1. **Seleccionar pago** a eliminar
2. **Hacer clic** en icono de eliminación (🗑️)
3. **Confirmar eliminación** en ventana emergente
4. **Eliminación suave**: El pago se oculta pero se mantiene en historial

### 👥 Gestión de Inquilinos

![Tenant Management](docs/images/tenant-management.png)

#### Ver Lista de Inquilinos
- **Información mostrada**:
  - Nombre completo
  - Email de contacto
  - Teléfono
  - Unidad/Propiedad asignada
  - Fecha inicio contrato
  - Estado (Activo/Inactivo)

#### ➕ Crear Nuevo Inquilino

**Importante**: Solo los propietarios pueden crear cuentas de inquilinos.

**Proceso de Creación:**
1. **Hacer clic** en "➕ Crear Inquilino"
2. **Completar formulario**:
   ```
   📝 Datos del Nuevo Inquilino:
   - Nombre: [Nombre completo]
   - Email: [Email único y válido]
   - Contraseña: [Contraseña temporal]
   ```
3. **Hacer clic** en "Crear Inquilino"
4. **Resultado**: 
   - Se crea cuenta con rol "inquilino"
   - El inquilino recibe credenciales de acceso
   - Aparece en la lista de inquilinos

#### 🔍 Buscar Inquilinos
- **Barra de búsqueda** en la parte superior
- **Búsqueda por**:
  - Nombre
  - Email
  - Unidad

### 🔧 Gestión de Incidencias

![Incident Management](docs/images/incident-management.png)

#### Ver Incidencias
- **Lista de todas las incidencias** reportadas
- **Estados disponibles**:
  - 🔴 Abierta
  - 🟡 En Progreso  
  - 🟢 Resuelta
  - ❌ Cerrada

#### Actualizar Estado de Incidencia
1. **Seleccionar incidencia**
2. **Cambiar estado** según progreso
3. **Añadir comentarios** sobre el progreso
4. **Notificar al inquilino** automáticamente

#### Asignar Proveedor
1. **Seleccionar incidencia**
2. **Elegir proveedor** de la lista
3. **Confirmar asignación**
4. **Seguimiento** del trabajo

---

## 🏠 Panel de Inquilino

### 🔐 Inicio de Sesión - Inquilino

![Tenant Login](docs/images/tenant-login.png)

#### Credenciales de Acceso
- **Email**: Proporcionado por el administrador
- **Contraseña**: Proporcionada por el administrador
- **Rol**: Automáticamente identificado como "Inquilino"

#### Primer Acceso
1. **Usar credenciales** proporcionadas por el propietario
2. **Cambiar contraseña** en el primer acceso (recomendado)
3. **Completar perfil** con información personal

### 🏠 Dashboard del Inquilino

![Tenant Dashboard](docs/images/tenant-dashboard.png)

#### Vista Personalizada
- **Información del inquilino**: Nombre, unidad asignada
- **Resumen de pagos**: Pendientes, pagados, próximos vencimientos
- **Incidencias activas**: Estado de reparaciones
- **Notificaciones recientes**: Mensajes del administrador

#### 🧭 Navegación
- **Dashboard**: Vista general
- **Pagos**: Gestión de pagos personales
- **Historial**: Historial de transacciones
- **Incidencias**: Reportar problemas
- **Notificaciones**: Mensajes importantes
- **Perfil**: Datos personales

### 💳 Gestión de Pagos - Inquilino

![Tenant Payments](docs/images/tenant-payments.png)

#### Ver Mis Pagos
- **Solo pagos personales** del inquilino actual
- **Información detallada**:
  - Monto a pagar
  - Fecha de vencimiento
  - Estado actual
  - Concepto del pago
  - Días hasta vencimiento

#### Estados de Pagos
- 🔴 **Pendiente**: Pago no realizado
- ✅ **Pagado**: Pago confirmado
- ⚠️ **Vencido**: Pago con fecha pasada

#### ✅ Marcar Pago Como Realizado

**Importante**: Esta función permite al inquilino confirmar que realizó el pago.

**Proceso:**
1. **Ubicar pago pendiente** en la lista
2. **Hacer clic** en "Marcar como Pagado"
3. **Confirmar acción** en ventana emergente
4. **Resultado**:
   - Estado cambia a "Pagado"
   - Notificación al administrador
   - Actualización en estadísticas

**⚠️ Nota**: Esta acción debe realizarse solo después de hacer el pago real (transferencia, efectivo, etc.)

### 📱 Funciones Adicionales - Inquilino

#### 🛠️ Reportar Incidencias
1. **Ir a sección** "Incidencias"
2. **Hacer clic** en "➕ Nueva Incidencia"
3. **Completar formulario**:
   - Título del problema
   - Descripción detallada
   - Urgencia (Baja, Media, Alta)
   - Fotos (opcional)
4. **Enviar reporte**
5. **Seguimiento** del estado

#### 📧 Ver Notificaciones
- **Mensajes del administrador**
- **Recordatorios de pago**
- **Actualizaciones de incidencias**
- **Avisos importantes**

#### 👤 Actualizar Perfil
- **Cambiar contraseña**
- **Actualizar información personal**
- **Modificar datos de contacto**

---

## 🔧 Solución de Problemas

### ❓ Problemas Comunes

#### 🚫 No Puedo Iniciar Sesión

**Síntomas**: Error al ingresar credenciales

**Soluciones**:
1. **Verificar email**: Asegúrate de escribir correctamente
2. **Verificar contraseña**: Revisa mayúsculas/minúsculas
3. **Limpiar caché**: Ctrl+F5 para refrescar página
4. **Contactar administrador**: Si eres inquilino
5. **Recuperar contraseña**: Usar opción de recuperación

#### 🔄 La Página No Carga

**Síntomas**: Página en blanco o error de conexión

**Soluciones**:
1. **Verificar conexión**: Comprobar internet
2. **Refrescar página**: F5 o Ctrl+F5
3. **Cambiar navegador**: Probar con Chrome/Firefox
4. **Limpiar cookies**: Borrar datos del sitio
5. **Contactar soporte técnico**: Si persiste el problema

#### 💰 No Veo Mis Pagos

**Síntomas**: Lista de pagos vacía o incompleta

**Soluciones Inquilino**:
1. **Verificar sesión**: Cerrar y volver a iniciar sesión
2. **Contactar administrador**: Puede que no hayan creado pagos
3. **Verificar filtros**: Revisar si hay filtros activos
4. **Refrescar página**: Actualizar información

**Soluciones Administrador**:
1. **Crear pagos**: Los pagos deben crearse manualmente
2. **Verificar inquilinos**: Asegurarse de que existan inquilinos
3. **Revisar base de datos**: Contactar soporte si es necesario

#### 📱 No Recibo Notificaciones

**Síntomas**: Falta de notificaciones importantes

**Soluciones**:
1. **Revisar sección**: Ir directamente a "Notificaciones"
2. **Actualizar página**: Refrescar contenido
3. **Verificar configuración**: Revisar permisos del navegador
4. **Contactar administrador**: Reportar el problema

### 🛠️ Contacto Técnico

#### Para Administradores
- **Email**: soporte-admin@depamanager.com
- **Teléfono**: +1 (555) 123-4567
- **Horario**: Lunes a Viernes, 9:00 AM - 6:00 PM

#### Para Inquilinos
- **Primer contacto**: Tu administrador/propietario
- **Soporte técnico**: soporte@depamanager.com
- **Emergencias**: +1 (555) 987-6543

---

## ❓ Preguntas Frecuentes

### 🏢 Para Administradores

#### ❓ ¿Cómo creo mi primera cuenta de inquilino?
1. **Iniciar sesión** como administrador
2. **Ir a** "Gestión de Inquilinos"
3. **Hacer clic** en "➕ Crear Inquilino"
4. **Completar datos** del inquilino
5. **Proporcionar credenciales** al inquilino

#### ❓ ¿Puedo eliminar un pago por error?
- **Sí**, los pagos se pueden eliminar
- **Eliminación suave**: Se ocultan pero se mantienen en historial
- **Recuperación**: Contacta soporte técnico si necesitas recuperar un pago

#### ❓ ¿Cómo cambio el estado de una incidencia?
1. **Ir a** "Gestión de Incidencias"
2. **Seleccionar incidencia**
3. **Cambiar estado** en el dropdown
4. **Guardar cambios**

#### ❓ ¿Puedo tener múltiples propiedades?
- **Actualmente**: El sistema maneja una propiedad por administrador
- **Futuro**: Se planea soporte para múltiples propiedades
- **Contacto**: Habla con soporte para requerimientos específicos

### 🏠 Para Inquilinos

#### ❓ ¿Cómo obtengo mis credenciales de acceso?
- **Tu administrador** te proporcionará:
  - Email de acceso
  - Contraseña temporal
  - Instrucciones de primer acceso

#### ❓ ¿Puedo cambiar mi contraseña?
- **Sí**, ve a tu "Perfil"
- **Sección**: "Cambiar Contraseña"
- **Recomendado**: Cambiar la contraseña temporal en primer acceso

#### ❓ ¿Qué pasa si marco un pago como pagado por error?
- **Contacta** inmediatamente a tu administrador
- **El administrador** puede revertir el estado
- **Importante**: Solo marcar como pagado después del pago real

#### ❓ ¿Cómo reporto una emergencia?
1. **Ir a** "Incidencias"
2. **Crear nueva incidencia**
3. **Seleccionar urgencia**: "Alta"
4. **Describir problema** detalladamente
5. **Para emergencias graves**: Contactar también por teléfono

#### ❓ ¿Puedo ver el historial de mis pagos anteriores?
- **Sí**, ve a la sección "Historial"
- **También**: En "Pagos" puedes filtrar por pagos pasados
- **Información incluida**: Fechas, montos, estados

### 🔒 Seguridad y Privacidad

#### ❓ ¿Es segura mi información personal?
- **Sí**, todos los datos están protegidos
- **Encriptación**: Contraseñas hasheadas
- **Acceso limitado**: Solo tu información personal
- **Cumplimiento**: Normativas de protección de datos

#### ❓ ¿Quién puede ver mis datos?
- **Tú**: Acceso completo a tu información
- **Tu administrador**: Información necesaria para gestión
- **Nadie más**: Acceso restringido por roles

#### ❓ ¿Cómo protejo mi cuenta?
- **Usar contraseña fuerte**: Mínimo 8 caracteres, números y símbolos
- **No compartir credenciales**: Mantener privadas tus credenciales
- **Cerrar sesión**: Especialmente en computadoras compartidas
- **Reportar problemas**: Contactar si sospechas acceso no autorizado

---

## 📞 Soporte y Contacto

### 🆘 ¿Necesitas Ayuda?

#### Opción 1: Contacto Directo
- **Email General**: soporte@depamanager.com
- **Teléfono**: +1 (555) 123-4567
- **Horario**: Lunes a Viernes, 9:00 AM - 6:00 PM

#### Opción 2: Soporte por Rol
- **Administradores**: admin-support@depamanager.com
- **Inquilinos**: tenant-support@depamanager.com

#### Opción 3: Emergencias
- **Teléfono 24/7**: +1 (555) 987-6543
- **Solo para**: Problemas técnicos críticos

### 📧 Información a Incluir en tu Consulta

**Para Soporte Efectivo, incluye:**
- 👤 **Tu nombre completo**
- 📧 **Email registrado en el sistema**
- 🏢 **Rol** (Administrador/Inquilino)
- 🖥️ **Navegador utilizado** (Chrome, Firefox, etc.)
- 📱 **Dispositivo** (Computadora, tablet, móvil)
- 📝 **Descripción detallada** del problema
- 📷 **Capturas de pantalla** (si es posible)
- ⏰ **Cuándo ocurrió** el problema

### 🔄 Actualizaciones del Sistema

**Mantenimientos Programados:**
- **Cuándo**: Domingos de 2:00 AM - 4:00 AM
- **Notificación**: 48 horas antes
- **Duración**: Máximo 2 horas

**Nuevas Funcionalidades:**
- **Frecuencia**: Actualizaciones mensuales
- **Notificación**: En el dashboard
- **Documentación**: Manual actualizado automáticamente

---

## 🎯 Consejos de Uso Eficiente

### 💡 Para Administradores

1. **📅 Crear pagos con anticipación**: Crea los pagos del mes siguiente
2. **🔔 Revisar notificaciones**: Mantente al día con reportes de inquilinos
3. **📊 Usar dashboard**: Revisa estadísticas regularmente
4. **💾 Backup de datos**: Contacta soporte para respaldos periódicos
5. **👥 Comunicación activa**: Mantén comunicación fluida con inquilinos

### 💡 Para Inquilinos

1. **📅 Revisar pagos**: Chequea pagos pendientes semanalmente
2. **✅ Marcar pagos**: Confirma pagos inmediatamente después de realizarlos
3. **🛠️ Reportar rápido**: Reporta incidencias tan pronto como ocurran
4. **📱 Revisar notificaciones**: Lee mensajes del administrador
5. **👤 Mantener perfil actualizado**: Actualiza información de contacto

---

**🏆 ¡Esperamos que DepaManager haga más fácil la gestión de tu propiedad o tu experiencia como inquilino!**

*Última actualización: Octubre 2024*
*Versión del Manual: 1.0*