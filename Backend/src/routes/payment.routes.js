const express = require('express');
const router = express.Router();
const { 
  obtenerPagos,
  crearPago,
  actualizarPago,
  marcarComoPagado,
  eliminarPago
} = require('../controllers/payment.controller');
const { 
  verificarToken, 
  soloPropietarios 
} = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación y ser propietario
router.use(verificarToken, soloPropietarios);

// GET /api/pagos - Obtener todos los pagos
router.get('/', obtenerPagos);

// POST /api/pagos - Crear nuevo pago
router.post('/', crearPago);

// PUT /api/pagos/:id - Actualizar pago
router.put('/:id', actualizarPago);

// PATCH /api/pagos/:id/marcar-pagado - Marcar pago como pagado
router.patch('/:id/marcar-pagado', marcarComoPagado);

// DELETE /api/pagos/:id - Eliminar pago (soft delete)
router.delete('/:id', eliminarPago);

module.exports = router;