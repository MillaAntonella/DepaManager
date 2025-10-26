const express = require('express');
const router = express.Router();
const { 
  login, 
  registro, 
  crearInquilino, 
  obtenerPerfil, 
  obtenerInquilinos, 
  obtenerDashboard,
  actualizarPerfil 
} = require('../controllers/auth.controller');
const { 
  verificarToken, 
  soloPropietarios, 
  usuariosAutenticados 
} = require('../middlewares/auth.middleware');

// Rutas públicas (no requieren autenticación)
router.post('/login', login);
router.post('/registro', registro);

// Rutas protegidas para usuarios autenticados (cualquier rol)
router.get('/perfil', verificarToken, usuariosAutenticados, obtenerPerfil);
router.put('/perfil', verificarToken, usuariosAutenticados, actualizarPerfil);
router.get('/dashboard', verificarToken, usuariosAutenticados, obtenerDashboard);

// Rutas protegidas solo para propietarios
router.post('/crear-inquilino', verificarToken, soloPropietarios, crearInquilino);
router.get('/inquilinos', verificarToken, soloPropietarios, obtenerInquilinos);

module.exports = router;