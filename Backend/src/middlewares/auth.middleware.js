const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// Middleware para verificar token JWT
const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        mensaje: 'Token de acceso requerido' 
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        mensaje: 'Formato de token inválido' 
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
    
    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Token inválido - usuario no encontrado' 
      });
    }

    // Agregar información del usuario a la request
    req.usuario = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol
    };

    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        mensaje: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        mensaje: 'Token expirado' 
      });
    }
    
    return res.status(500).json({ 
      mensaje: 'Error interno del servidor' 
    });
  }
};

// Middleware para verificar roles específicos
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          mensaje: 'Usuario no autenticado'
        });
      }

      if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({
          mensaje: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Error en verificarRol:', error);
      return res.status(500).json({
        mensaje: 'Error interno del servidor'
      });
    }
  };
};

// Middleware específico solo para propietarios
const soloPropietarios = verificarRol('propietario');

// Middleware específico solo para inquilinos
const soloInquilinos = verificarRol('inquilino');

// Middleware que permite ambos roles (usuarios autenticados)
const usuariosAutenticados = verificarRol('propietario', 'inquilino');

module.exports = {
  verificarToken,
  verificarRol,
  soloPropietarios,
  soloInquilinos,
  usuariosAutenticados
};