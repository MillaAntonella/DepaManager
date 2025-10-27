const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/user');

const login = async (req, res) => {
  try {
    const { email, password, rolEsperado } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    
    // Validar que el rol del usuario coincida con el esperado
    if (rolEsperado && usuario.rol !== rolEsperado) {
      return res.status(403).json({ 
        mensaje: rolEsperado === 'propietario' 
          ? 'Solo los propietarios pueden acceder aquí' 
          : 'Solo los inquilinos pueden acceder aquí' 
      });
    }
    
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'tu_clave_secreta',
      { expiresIn: '1h' }
    );
    res.json({
      mensaje: '¡Inicio de sesión exitoso!',
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol = 'propietario' } = req.body;
    
    // Solo permitir registro directo para propietarios
    if (rol !== 'propietario') {
      return res.status(403).json({ mensaje: 'Solo los propietarios pueden registrarse directamente' });
    }
    
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordEncriptada,
      rol: 'propietario'
    });
    const token = jwt.sign(
      { id: nuevoUsuario.id, email, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET || 'tu_clave_secreta',
      { expiresIn: '1h' }
    );
    res.status(201).json({
      mensaje: '¡Propietario registrado exitosamente!',
      usuario: {
        id: nuevoUsuario.id,
        email,
        nombre,
        rol: nuevoUsuario.rol
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Función para que propietarios creen inquilinos
const crearInquilino = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    // El middleware ya verificó que es propietario, usamos req.usuario
    const propietarioId = req.usuario.id;
    
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);
    
    const nuevoInquilino = await Usuario.create({
      nombre,
      email,
      password: passwordEncriptada,
      rol: 'inquilino'
    });
    
    res.status(201).json({
      mensaje: '¡Inquilino creado exitosamente!',
      inquilino: {
        id: nuevoInquilino.id,
        email,
        nombre,
        rol: nuevoInquilino.rol
      },
      creadoPor: {
        id: req.usuario.id,
        nombre: req.usuario.nombre,
        email: req.usuario.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener perfil del usuario autenticado
const obtenerPerfil = async (req, res) => {
  try {
    // El middleware ya verificó el token y agregó req.usuario
    res.json({
      mensaje: 'Perfil obtenido exitosamente',
      usuario: req.usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener todos los inquilinos (solo propietarios)
const obtenerInquilinos = async (req, res) => {
  try {
    const inquilinos = await Usuario.findAll({
      where: { rol: 'inquilino' },
      attributes: ['id', 'nombre', 'email', 'created_at'] // No incluir password
    });
    
    res.json({
      mensaje: 'Inquilinos obtenidos exitosamente',
      inquilinos,
      total: inquilinos.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Dashboard específico por rol
const obtenerDashboard = async (req, res) => {
  try {
    const { rol } = req.usuario;
    
    if (rol === 'propietario') {
      // Obtener estadísticas para propietarios
      const totalInquilinos = await Usuario.count({ where: { rol: 'inquilino' } });
      
      // Simulación de datos hasta implementar modelos completos
      const ingresosMes = Math.floor(Math.random() * 50000) + 20000; // Entre 20k-70k
      const incidenciasAbiertas = Math.floor(Math.random() * 30) + 5; // Entre 5-35
      const ocupacionPorcentaje = Math.floor(Math.random() * 40) + 60; // Entre 60%-100%
      
      // Pagos recientes simulados
      const pagosRecientes = [
        {
          inquilino: 'María González',
          apartamento: '15 Ena',
          monto: '$1200',
          estado: 'Pagado',
          fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        },
        {
          inquilino: 'Carlos Ruiz',
          apartamento: '14 Ena',
          monto: '$950',
          estado: 'Pendiente',
          fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        },
        {
          inquilino: 'Ana López',
          apartamento: '13 Ena',
          monto: '$1100',
          estado: 'Pagado',
          fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        },
        {
          inquilino: 'Pedro Martín',
          apartamento: '10 Ena',
          monto: '$800',
          estado: 'Vencido',
          fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      ];

      // Próximas tareas simuladas
      const proximasTareas = [
        {
          titulo: 'Revisión contrato - Apt 205',
          tipo: 'Alta',
          fecha: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        },
        {
          titulo: 'Mantenimiento aires acondicionados',
          tipo: 'Media',
          fecha: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        },
        {
          titulo: 'Inspección de seguridad',
          tipo: 'Baja',
          fecha: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      ];

      // Estado de ocupación
      const ocupados = Math.floor((ocupacionPorcentaje / 100) * 160); // Asumiendo 160 apartamentos totales
      const disponibles = 160 - ocupados - 5; // -5 para mantenimiento
      const mantenimiento = 5;

      res.json({
        mensaje: 'Dashboard de propietario',
        usuario: req.usuario,
        estadisticas: {
          totalInquilinos,
          ingresosMes,
          incidenciasAbiertas,
          ocupacionPorcentaje,
          pagosRecientes,
          proximasTareas,
          estadoOcupacion: {
            ocupados,
            disponibles,
            mantenimiento,
            total: 160
          }
        }
      });
    } else if (rol === 'inquilino') {
      // Dashboard para inquilinos
      res.json({
        mensaje: 'Dashboard de inquilino',
        usuario: req.usuario,
        info: {
          mensaje: 'Bienvenido a tu portal de inquilino'
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar perfil de usuario (email y contraseña)
const actualizarPerfil = async (req, res) => {
  try {
    const { email, password, passwordActual } = req.body;
    const usuarioId = req.usuario.id;

    // Buscar el usuario actual
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Si se quiere cambiar la contraseña, verificar la contraseña actual
    if (password && passwordActual) {
      const passwordValida = await bcrypt.compare(passwordActual, usuario.password);
      if (!passwordValida) {
        return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
      }
    }

    // Preparar datos para actualizar
    const datosActualizar = {};
    
    if (email && email !== usuario.email) {
      // Verificar que el nuevo email no esté en uso
      const emailExiste = await Usuario.findOne({ 
        where: { email, id: { [require('sequelize').Op.ne]: usuarioId } } 
      });
      if (emailExiste) {
        return res.status(400).json({ mensaje: 'El email ya está en uso' });
      }
      datosActualizar.email = email;
    }

    if (password) {
      datosActualizar.password = await bcrypt.hash(password, 10);
    }

    // Actualizar usuario
    await usuario.update(datosActualizar);

    // Devolver usuario actualizado (sin contraseña)
    const usuarioActualizado = await Usuario.findByPk(usuarioId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      mensaje: 'Perfil actualizado exitosamente',
      usuario: usuarioActualizado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};



module.exports = {
  login,
  registro,
  crearInquilino,
  obtenerPerfil,
  obtenerInquilinos,
  obtenerDashboard,
  actualizarPerfil
};