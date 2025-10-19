const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'tu_clave_secreta',
      { expiresIn: '1h' }
    );
    res.json({
      mensaje: '¡Inicio de sesión exitoso!',
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
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
    const { nombre, email, password } = req.body;
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordEncriptada
    });
    const token = jwt.sign(
      { id: nuevoUsuario.id, email },
      process.env.JWT_SECRET || 'tu_clave_secreta',
      { expiresIn: '1h' }
    );
    res.status(201).json({
      mensaje: '¡Usuario registrado exitosamente!',
      usuario: {
        id: nuevoUsuario.id,
        email,
        nombre
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  login,
  registro
};