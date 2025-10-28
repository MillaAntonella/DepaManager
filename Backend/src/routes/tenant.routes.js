const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
const { verificarToken, soloInquilinos } = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación y ser inquilino
router.use(verificarToken);
router.use(soloInquilinos);

// Dashboard del inquilino
router.get('/dashboard', tenantController.getDashboard);

// Pagos del inquilino
router.get('/payments', tenantController.getMyPayments);
router.post('/payments/process', tenantController.processPayment);
router.patch('/payments/:id/pay', tenantController.markPaymentAsPaid);

// Incidencias del inquilino
router.get('/incidents', tenantController.getMyIncidents);
router.post('/incidents', tenantController.createIncident);

// Notificaciones del inquilino
router.get('/notifications', tenantController.getMyNotifications);
router.patch('/notifications/:id/read', tenantController.markNotificationAsRead);
router.patch('/notifications/read-all', tenantController.markAllNotificationsAsRead);

// Perfil del inquilino
router.get('/profile', tenantController.getProfile);
router.put('/profile', tenantController.updateProfile);

// Información del departamento
router.get('/apartment', tenantController.getMyApartment);

module.exports = router;