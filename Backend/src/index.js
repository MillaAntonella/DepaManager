const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const sequelize = require('./config/sequelize');
const Usuario = require('./models/user');
const Pago = require('./models/payment');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
const authRoutes = require('./routes/auth.routes');
const paymentRoutes = require('./routes/payment.routes');

app.use('/api/auth', authRoutes);
app.use('/api/pagos', paymentRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API de Gestión de Alquileres!' });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Sincronizar modelos y arrancar el servidor
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch((err) => {
  console.error('Error al sincronizar la base de datos:', err);
});