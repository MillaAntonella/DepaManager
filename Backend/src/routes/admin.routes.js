const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verificarToken, soloPropietarios } = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación de propietario
router.use(verificarToken, soloPropietarios);

// ===== DASHBOARD =====
router.get('/dashboard', adminController.getDashboard);

// ===== PAGOS =====
router.get('/payments', adminController.getAllPayments);
router.post('/payments', adminController.createPayment);
router.put('/payments/:id', adminController.updatePayment);
router.delete('/payments/:id', adminController.deletePayment);
router.patch('/payments/:id/mark-paid', adminController.markPaymentAsPaid);

// ===== INQUILINOS =====
router.get('/tenants', adminController.getTenants);

// ===== INCIDENCIAS =====
router.get('/incidents', adminController.getAllIncidents);
router.patch('/incidents/:id/status', adminController.updateIncidentStatus);
router.patch('/incidents/:id/assign', adminController.assignProviderToIncident);

// ===== NOTIFICACIONES =====
router.post('/tenants/:tenantId/notifications', adminController.sendNotificationToTenant);
router.post('/notifications/bulk', adminController.sendBulkNotification);

module.exports = router;