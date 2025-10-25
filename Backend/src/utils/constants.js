// =====================================================
// CONSTANTES DEL SISTEMA DEPAMANAGER
// =====================================================

const ROLES = {
  PROPIETARIO: 'propietario',
  INQUILINO: 'inquilino'
};

const ESTADOS_PROPIEDAD = {
  DISPONIBLE: 'disponible',
  OCUPADA: 'ocupada',
  MANTENIMIENTO: 'mantenimiento'
};

const TIPOS_PROPIEDAD = {
  RESIDENCIAL: 'residencial',
  COMERCIAL: 'comercial'
};

const ESTADOS_INQUILINO = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  PENDIENTE: 'pendiente'
};

const ESTADOS_CONTRATO = {
  ACTIVO: 'activo',
  VENCIDO: 'vencido',
  TERMINADO: 'terminado'
};

const TIPOS_CONTRATO = {
  RESIDENCIAL: 'residencial',
  COMERCIAL: 'comercial'
};

const ESTADOS_PAGO = {
  PAGADO: 'pagado',
  PENDIENTE: 'pendiente',
  VENCIDO: 'vencido'
};

const METODOS_PAGO = {
  TARJETA_CREDITO: 'tarjeta_credito',
  TRANSFERENCIA_BANCARIA: 'transferencia_bancaria',
  EFECTIVO: 'efectivo'
};

const ESTADOS_INCIDENCIA = {
  ABIERTA: 'abierta',
  ASIGNADA: 'asignada',
  RESUELTA: 'resuelta'
};

const PRIORIDADES_INCIDENCIA = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAJA: 'baja'
};

const TIPOS_INVENTARIO = {
  MUEBLE: 'mueble',
  ELECTRODOMESTICO: 'electrodomestico',
  OTRO: 'otro'
};

const CONDICIONES_INVENTARIO = {
  NUEVO: 'nuevo',
  USADO: 'usado',
  DANADO: 'danado'
};

const ESTADOS_POSTULANTE = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado'
};

const TIPOS_VEHICULO = {
  AUTO: 'auto',
  MOTOCICLETA: 'motocicleta'
};

const ESTADOS_VEHICULO = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo'
};

const TIPOS_NOTIFICACION = {
  ALERTA: 'alerta',
  ADVERTENCIA: 'advertencia',
  INFO: 'info',
  ERROR: 'error'
};

const TIPOS_REPORTE = {
  FINANCIERO: 'financiero',
  OCUPACION: 'ocupacion',
  OPERACIONAL: 'operacional',
  PERSONALIZADO: 'personalizado'
};

const ESTADOS_PROVEEDOR = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo'
};

// Mensajes de error comunes
const MENSAJES_ERROR = {
  NO_AUTORIZADO: 'No tienes autorización para realizar esta acción',
  TOKEN_REQUERIDO: 'Token de acceso requerido',
  TOKEN_INVALIDO: 'Token inválido',
  TOKEN_EXPIRADO: 'Token expirado',
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',
  EMAIL_EXISTE: 'El email ya está registrado',
  CREDENCIALES_INVALIDAS: 'Credenciales inválidas',
  DATOS_REQUERIDOS: 'Faltan datos requeridos',
  RECURSO_NO_ENCONTRADO: 'Recurso no encontrado',
  ERROR_SERVIDOR: 'Error interno del servidor',
  ACCESO_DENEGADO: 'Acceso denegado'
};

// Mensajes de éxito comunes
const MENSAJES_EXITO = {
  LOGIN_EXITOSO: 'Inicio de sesión exitoso',
  REGISTRO_EXITOSO: 'Registro exitoso',
  CREADO_EXITOSAMENTE: 'Creado exitosamente',
  ACTUALIZADO_EXITOSAMENTE: 'Actualizado exitosamente',
  ELIMINADO_EXITOSAMENTE: 'Eliminado exitosamente',
  DATOS_OBTENIDOS: 'Datos obtenidos exitosamente'
};

// Configuraciones de paginación
const PAGINACION = {
  LIMITE_DEFAULT: 10,
  LIMITE_MAXIMO: 100,
  PAGINA_DEFAULT: 1
};

// Configuraciones de archivos
const ARCHIVOS = {
  TAMANO_MAXIMO: 5 * 1024 * 1024, // 5MB
  TIPOS_PERMITIDOS: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  DIRECTORIO_UPLOADS: './uploads/'
};

module.exports = {
  ROLES,
  ESTADOS_PROPIEDAD,
  TIPOS_PROPIEDAD,
  ESTADOS_INQUILINO,
  ESTADOS_CONTRATO,
  TIPOS_CONTRATO,
  ESTADOS_PAGO,
  METODOS_PAGO,
  ESTADOS_INCIDENCIA,
  PRIORIDADES_INCIDENCIA,
  TIPOS_INVENTARIO,
  CONDICIONES_INVENTARIO,
  ESTADOS_POSTULANTE,
  TIPOS_VEHICULO,
  ESTADOS_VEHICULO,
  TIPOS_NOTIFICACION,
  TIPOS_REPORTE,
  ESTADOS_PROVEEDOR,
  MENSAJES_ERROR,
  MENSAJES_EXITO,
  PAGINACION,
  ARCHIVOS
};