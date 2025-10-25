const { body, param, query, validationResult } = require('express-validator');
const { MENSAJES_ERROR } = require('../utils/constants');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      mensaje: 'Errores de validación',
      errores: errors.array()
    });
  }
  next();
};

// Validaciones para autenticación
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

const validateRegister = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  handleValidationErrors
];

// Validaciones para propiedades
const validatePropiedad = [
  body('direccion')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('La dirección debe tener entre 5 y 255 caracteres'),
  body('tipo')
    .isIn(['residencial', 'comercial'])
    .withMessage('El tipo debe ser residencial o comercial'),
  body('tamano')
    .isFloat({ min: 0.01 })
    .withMessage('El tamaño debe ser un número mayor a 0'),
  body('monto_alquiler')
    .isFloat({ min: 0.01 })
    .withMessage('El monto de alquiler debe ser un número mayor a 0'),
  body('estado')
    .optional()
    .isIn(['disponible', 'ocupada', 'mantenimiento'])
    .withMessage('El estado debe ser disponible, ocupada o mantenimiento'),
  handleValidationErrors
];

// Validaciones para inquilinos
const validateInquilino = [
  body('id_usuario')
    .isInt({ min: 1 })
    .withMessage('El ID de usuario debe ser un número entero válido'),
  body('id_propiedad')
    .isInt({ min: 1 })
    .withMessage('El ID de propiedad debe ser un número entero válido'),
  body('unidad')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La unidad no puede exceder 255 caracteres'),
  body('fecha_inicio_contrato')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe ser una fecha válida'),
  body('fecha_fin_contrato')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe ser una fecha válida'),
  body('estado')
    .optional()
    .isIn(['activo', 'inactivo', 'pendiente'])
    .withMessage('El estado debe ser activo, inactivo o pendiente'),
  handleValidationErrors
];

// Validaciones para contratos
const validateContrato = [
  body('id_inquilino')
    .isInt({ min: 1 })
    .withMessage('El ID de inquilino debe ser un número entero válido'),
  body('id_propiedad')
    .isInt({ min: 1 })
    .withMessage('El ID de propiedad debe ser un número entero válido'),
  body('tipo_contrato')
    .optional()
    .isIn(['residencial', 'comercial'])
    .withMessage('El tipo de contrato debe ser residencial o comercial'),
  body('fecha_inicio')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe ser una fecha válida'),
  body('fecha_fin')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe ser una fecha válida'),
  body('monto_alquiler')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El monto de alquiler debe ser un número mayor a 0'),
  handleValidationErrors
];

// Validaciones para pagos
const validatePago = [
  body('id_contrato')
    .isInt({ min: 1 })
    .withMessage('El ID de contrato debe ser un número entero válido'),
  body('monto')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número mayor a 0'),
  body('fecha_pago')
    .optional()
    .isISO8601()
    .withMessage('La fecha de pago debe ser una fecha válida'),
  body('estado_pago')
    .optional()
    .isIn(['pagado', 'pendiente', 'vencido'])
    .withMessage('El estado de pago debe ser pagado, pendiente o vencido'),
  body('metodo_pago')
    .optional()
    .isIn(['tarjeta_credito', 'transferencia_bancaria', 'efectivo'])
    .withMessage('El método de pago debe ser tarjeta_credito, transferencia_bancaria o efectivo'),
  handleValidationErrors
];

// Validaciones para incidencias
const validateIncidencia = [
  body('id_inquilino')
    .isInt({ min: 1 })
    .withMessage('El ID de inquilino debe ser un número entero válido'),
  body('descripcion')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('prioridad')
    .optional()
    .isIn(['alta', 'media', 'baja'])
    .withMessage('La prioridad debe ser alta, media o baja'),
  handleValidationErrors
];

// Validaciones para IDs en parámetros
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero válido'),
  handleValidationErrors
];

// Validaciones para paginación
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateRegister,
  validatePropiedad,
  validateInquilino,
  validateContrato,
  validatePago,
  validateIncidencia,
  validateId,
  validatePagination,
  handleValidationErrors
};