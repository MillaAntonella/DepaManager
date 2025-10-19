const express = require('express');
const router = express.Router();
const { login, registro } = require('../controllers/auth.controller');

// Rutas de autenticación
router.post('/login', login);
router.post('/registro', registro);

module.exports = router;