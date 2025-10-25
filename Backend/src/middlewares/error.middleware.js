const { MENSAJES_ERROR } = require('../utils/constants');

// Middleware para manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack);

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errores = err.errors.map(error => ({
      campo: error.path,
      mensaje: error.message,
      valor: error.value
    }));

    return res.status(400).json({
      mensaje: 'Errores de validación',
      errores
    });
  }

  // Error de restricción única de Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const campo = err.errors[0].path;
    return res.status(409).json({
      mensaje: `Ya existe un registro con ese ${campo}`,
      error: 'Violación de restricción única'
    });
  }

  // Error de clave foránea de Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      mensaje: 'Error de referencia: el registro relacionado no existe',
      error: 'Violación de clave foránea'
    });
  }

  // Error de conexión a la base de datos
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      mensaje: 'Error de conexión a la base de datos',
      error: 'Servicio no disponible'
    });
  }

  // Error de timeout de Sequelize
  if (err.name === 'SequelizeTimeoutError') {
    return res.status(504).json({
      mensaje: 'Timeout en la consulta a la base de datos',
      error: 'Tiempo de espera agotado'  
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      mensaje: MENSAJES_ERROR.TOKEN_INVALIDO,
      error: 'Token JWT inválido'
    });
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      mensaje: MENSAJES_ERROR.TOKEN_EXPIRADO,
      error: 'Token JWT expirado'
    });
  }

  // Error de sintaxis JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      mensaje: 'JSON malformado',
      error: 'Error de sintaxis en el cuerpo de la petición'
    });
  }

  // Error de límite de payload
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      mensaje: 'Payload demasiado grande',
      error: 'El tamaño de la petición excede el límite permitido'
    });
  }

  // Error de multer (upload de archivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      mensaje: 'Archivo demasiado grande',
      error: 'El archivo excede el tamaño máximo permitido'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      mensaje: 'Tipo de archivo no permitido',
      error: 'El archivo no es del tipo esperado'
    });
  }

  // Error personalizado con status
  if (err.status) {
    return res.status(err.status).json({
      mensaje: err.message || MENSAJES_ERROR.ERROR_SERVIDOR,
      error: err.error || 'Error personalizado'
    });
  }

  // Error interno del servidor (por defecto)
  return res.status(500).json({
    mensaje: MENSAJES_ERROR.ERROR_SERVIDOR,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
};

// Middleware para rutas no encontradas (404)
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Función para crear errores personalizados
const createError = (message, status = 500, error = null) => {
  const err = new Error(message);
  err.status = status;
  if (error) err.error = error;
  return err;
};

// Wrapper para async functions
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  createError,
  asyncHandler
};