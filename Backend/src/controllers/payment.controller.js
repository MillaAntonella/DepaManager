const Pago = require('../models/payment');
const Usuario = require('../models/user');

// Obtener todos los pagos (solo propietarios)
const obtenerPagos = async (req, res) => {
  try {
    if (req.usuario.rol !== 'propietario') {
      return res.status(403).json({ mensaje: 'Solo los propietarios pueden ver los pagos' });
    }

    const pagos = await Pago.findAll({
      where: { fecha_eliminacion: null },
      order: [['fecha_creacion', 'DESC']]
    });

    // Calcular estadísticas
    const fechaActual = new Date();
    const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    
    const pagosPagados = pagos.filter(p => p.estado_pago === 'pagado');
    const pagosPendientes = pagos.filter(p => p.estado_pago === 'pendiente');
    const pagosVencidos = pagos.filter(p => p.estado_pago === 'vencido');
    
    const ingresosMes = pagosPagados
      .filter(p => p.fecha_pago && new Date(p.fecha_pago) >= inicioMes)
      .reduce((total, pago) => total + parseFloat(pago.monto), 0);

    const tasaCobro = pagos.length > 0 
      ? Math.round((pagosPagados.length / pagos.length) * 100) 
      : 0;

    const estadisticas = {
      ingresosMes,
      pagosPendientes: pagosPendientes.length,
      pagosVencidos: pagosVencidos.length,
      tasaCobro
    };

    // Formatear pagos para el frontend
    const pagosFormateados = pagos.map(pago => ({
      id: pago.id_pago,
      inquilino: `Inquilino ${pago.id_contrato}`, // Temporal hasta tener relación con usuario
      concepto: 'Alquiler mensual',
      monto: parseFloat(pago.monto),
      fechaVencimiento: pago.fecha_creacion ? new Date(pago.fecha_creacion).toISOString().split('T')[0] : null,
      estado: pago.estado_pago === 'pagado' ? 'Pagado' : 
              pago.estado_pago === 'pendiente' ? 'Pendiente' : 'Vencido',
      metodoPago: pago.metodo_pago === 'tarjeta_credito' ? 'Tarjeta de Crédito' :
                  pago.metodo_pago === 'transferencia_bancaria' ? 'Transferencia' :
                  pago.metodo_pago === 'efectivo' ? 'Efectivo' : null,
      fechaPago: pago.fecha_pago
    }));

    res.json({
      mensaje: 'Pagos obtenidos exitosamente',
      pagos: pagosFormateados,
      estadisticas
    });

  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Crear nuevo pago
const crearPago = async (req, res) => {
  try {
    if (req.usuario.rol !== 'propietario') {
      return res.status(403).json({ mensaje: 'Solo los propietarios pueden crear pagos' });
    }

    const { id_contrato, monto, concepto, fecha_vencimiento } = req.body;

    if (!id_contrato || !monto) {
      return res.status(400).json({ mensaje: 'El contrato y monto son obligatorios' });
    }

    const nuevoPago = await Pago.create({
      id_contrato: id_contrato || 1, // Temporal
      monto,
      estado_pago: 'pendiente'
    });

    res.status(201).json({
      mensaje: 'Pago creado exitosamente',
      pago: {
        id: nuevoPago.id_pago,
        inquilino: `Inquilino ${nuevoPago.id_contrato}`,
        concepto: concepto || 'Alquiler mensual',
        monto: parseFloat(nuevoPago.monto),
        fechaVencimiento: nuevoPago.fecha_creacion ? new Date(nuevoPago.fecha_creacion).toISOString().split('T')[0] : null,
        estado: 'Pendiente',
        metodoPago: null,
        fechaPago: null
      }
    });

  } catch (error) {
    console.error('Error creando pago:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar pago
const actualizarPago = async (req, res) => {
  try {
    if (req.usuario.rol !== 'propietario') {
      return res.status(403).json({ mensaje: 'Solo los propietarios pueden actualizar pagos' });
    }

    const { id } = req.params;
    const { monto, estado_pago, metodo_pago } = req.body;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }

    const datosActualizar = {};
    if (monto !== undefined) datosActualizar.monto = monto;
    if (estado_pago !== undefined) {
      datosActualizar.estado_pago = estado_pago;
      if (estado_pago === 'pagado' && !pago.fecha_pago) {
        datosActualizar.fecha_pago = new Date();
      }
    }
    if (metodo_pago !== undefined) datosActualizar.metodo_pago = metodo_pago;

    await pago.update(datosActualizar);

    res.json({
      mensaje: 'Pago actualizado exitosamente',
      pago: {
        id: pago.id_pago,
        inquilino: `Inquilino ${pago.id_contrato}`,
        concepto: 'Alquiler mensual',
        monto: parseFloat(pago.monto),
        fechaVencimiento: pago.fecha_creacion ? new Date(pago.fecha_creacion).toISOString().split('T')[0] : null,
        estado: pago.estado_pago === 'pagado' ? 'Pagado' : 
                pago.estado_pago === 'pendiente' ? 'Pendiente' : 'Vencido',
        metodoPago: pago.metodo_pago === 'tarjeta_credito' ? 'Tarjeta de Crédito' :
                    pago.metodo_pago === 'transferencia_bancaria' ? 'Transferencia' :
                    pago.metodo_pago === 'efectivo' ? 'Efectivo' : null,
        fechaPago: pago.fecha_pago
      }
    });

  } catch (error) {
    console.error('Error actualizando pago:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Marcar pago como pagado
const marcarComoPagado = async (req, res) => {
  try {
    if (req.usuario.rol !== 'propietario') {
      return res.status(403).json({ mensaje: 'Solo los propietarios pueden marcar pagos como pagados' });
    }

    const { id } = req.params;
    const { metodo_pago } = req.body;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }

    await pago.update({
      estado_pago: 'pagado',
      fecha_pago: new Date(),
      metodo_pago: metodo_pago || 'efectivo'
    });

    res.json({
      mensaje: 'Pago marcado como pagado exitosamente',
      pago: {
        id: pago.id_pago,
        estado: 'Pagado',
        fechaPago: pago.fecha_pago,
        metodoPago: metodo_pago === 'tarjeta_credito' ? 'Tarjeta de Crédito' :
                    metodo_pago === 'transferencia_bancaria' ? 'Transferencia' :
                    'Efectivo'
      }
    });

  } catch (error) {
    console.error('Error marcando pago como pagado:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar pago (soft delete)
const eliminarPago = async (req, res) => {
  try {
    if (req.usuario.rol !== 'propietario') {
      return res.status(403).json({ mensaje: 'Solo los propietarios pueden eliminar pagos' });
    }

    const { id } = req.params;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }

    await pago.update({
      fecha_eliminacion: new Date()
    });

    res.json({
      mensaje: 'Pago eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando pago:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerPagos,
  crearPago,
  actualizarPago,
  marcarComoPagado,
  eliminarPago
};