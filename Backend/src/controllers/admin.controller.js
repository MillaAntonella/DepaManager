const { Usuario, Inquilino, Pago, Incidencia, Notificacion, Propiedad, Contrato } = require('../models');
const { Op } = require('sequelize');

// ===== DASHBOARD ADMIN =====
const getDashboard = async (req, res) => {
  try {
    console.log('📊 AdminController: Devolviendo dashboard temporal con datos vacíos');
    
    // Temporalmente devolvemos estadísticas en cero mientras solucionamos los problemas de DB
    res.json({
      success: true,
      data: {
        stats: {
          totalInquilinos: 0,
          totalPagos: 0,
          incidenciasAbiertas: 0,
          pagosPendientes: 0,
          ingresosMes: 0
        },
        incidenciasRecientes: []
      }
    });

  } catch (error) {
    console.error('Error obteniendo dashboard admin:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// ===== GESTIÓN DE PAGOS =====
const getAllPayments = async (req, res) => {
  try {
    console.log('📋 AdminController: Obteniendo todos los pagos...');
    
    // Primero obtener pagos simples para verificar si existen
    const pagosSimples = await Pago.findAll({
      order: [['fecha_vencimiento', 'DESC']]
    });
    console.log('📊 AdminController: Total pagos en BD:', pagosSimples.length);
    if (pagosSimples.length > 0) {
      console.log('📋 AdminController: Datos del primer pago:', {
        id: pagosSimples[0].id_pago,
        concepto: pagosSimples[0].concepto,
        monto: pagosSimples[0].monto,
        id_inquilino: pagosSimples[0].id_inquilino
      });
    }
    
    // Intentar obtener pagos con manejo de errores robusto usando los alias correctos
    const pagos = await Pago.findAll({
      include: [{
        model: Inquilino,
        as: 'inquilino',
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'email']
        }],
        attributes: ['id_inquilino', 'usuario_id', 'unidad']
      }],
      attributes: [
        'id_pago', 
        'id_inquilino', 
        'concepto', 
        'monto', 
        'fecha_vencimiento', 
        'estado_pago', 
        'fecha_pago', 
        'metodo_pago'
      ],
      order: [['fecha_vencimiento', 'DESC']]
    });

    console.log('� AdminController: Pagos encontrados:', pagos.length);

    // Formatear datos usando los alias correctos
    const pagosFormateados = pagos.map((pago, index) => {
      const pagoFormateado = {
        id: pago.id_pago,
        id_inquilino: pago.id_inquilino,
        inquilino: pago.inquilino?.usuario?.nombre || 'Sin nombre',
        apartamento: pago.inquilino?.unidad || 'Sin unidad',
        tipo: pago.concepto,
        monto: parseFloat(pago.monto),
        vencimiento: pago.fecha_vencimiento,
        estado: pago.estado_pago,
        fechaPago: pago.fecha_pago,
        metodoPago: pago.metodo_pago
      };
      
      if (index < 3) { // Log solo los primeros 3 para no saturar
        console.log(`📋 AdminController: Pago ${index + 1} formateado:`, pagoFormateado);
      }
      
      return pagoFormateado;
    });

    console.log('✅ AdminController: Pagos formateados exitosamente:', pagosFormateados.length);

    res.json({
      success: true,
      data: {
        pagos: pagosFormateados,
        total: pagosFormateados.length
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo pagos:', error.message);
    console.error('🔍 Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      mensaje: `Error interno del servidor: ${error.message}`
    });
  }
};

const createPayment = async (req, res) => {
  try {
    console.log('💰 AdminController: createPayment llamado');
    console.log('📥 AdminController: Datos recibidos:', req.body);
    
    const { id_inquilino, concepto, monto, fecha_vencimiento, tipo_recurrencia, duracion_meses } = req.body;

    // Validar datos requeridos
    if (!id_inquilino || !concepto || !monto || !fecha_vencimiento) {
      console.log('❌ AdminController: Faltan campos requeridos');
      return res.status(400).json({
        success: false,
        mensaje: 'Todos los campos son requeridos'
      });
    }

    // Si no hay registros en inquilinos pero hay usuarios inquilinos, crear registro básico
    let inquilino = await Inquilino.findOne({ 
      where: { 
        [Op.or]: [
          { id_usuario: id_inquilino },
          { usuario_id: id_inquilino }
        ]
      } 
    });
    
    if (!inquilino) {
      console.log('⚠️ AdminController: No se encontró inquilino, verificando usuario...');
      const usuario = await Usuario.findOne({ 
        where: { 
          id: id_inquilino, 
          rol: 'inquilino' 
        } 
      });
      
      if (usuario) {
        console.log('✅ AdminController: Usuario inquilino encontrado, creando registro de inquilino...');
        
        // Buscar si hay alguna propiedad disponible
        const propiedad = await Propiedad.findOne();
        if (!propiedad) {
          console.log('⚠️ AdminController: No hay propiedades registradas, creando propiedad por defecto...');
          const nuevaPropiedad = await Propiedad.create({
            direccion: 'Propiedad por defecto - Sistema',
            tipo: 'residencial',
            tamano: 50.00,
            monto_alquiler: 100.00,
            estado: 'disponible',
            descripcion: 'Propiedad creada automáticamente por el sistema'
          });
          console.log('✅ AdminController: Propiedad por defecto creada:', nuevaPropiedad.id_propiedad);
        }
        
        // Obtener la primera propiedad disponible
        const propiedadParaAsignar = await Propiedad.findOne();
        
        inquilino = await Inquilino.create({
          id_usuario: id_inquilino,
          usuario_id: id_inquilino, // Llenar ambos campos por compatibilidad
          id_propiedad: propiedadParaAsignar.id_propiedad,
          unidad: 'Sin asignar',
          fecha_inicio_contrato: new Date(),
          fecha_fin_contrato: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año desde hoy
        });
        console.log('✅ AdminController: Registro de inquilino creado:', inquilino.id_inquilino);
      } else {
        console.log('❌ AdminController: Usuario no encontrado o no es inquilino');
        return res.status(404).json({
          success: false,
          mensaje: 'Usuario inquilino no encontrado'
        });
      }
    }

    // Buscar o crear un contrato por defecto
    let contrato = await Contrato.findOne({ where: { id_inquilino: inquilino.id_inquilino } });
    
    if (!contrato) {
      console.log('⚠️ AdminController: No se encontró contrato, creando contrato por defecto...');
      contrato = await Contrato.create({
        id_inquilino: inquilino.id_inquilino,
        id_propiedad: inquilino.id_propiedad,
        fecha_inicio: inquilino.fecha_inicio_contrato || new Date(),
        fecha_fin: inquilino.fecha_fin_contrato || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        monto_alquiler: parseFloat(monto),
        deposito: 0,
        estado: 'activo'
      });
      console.log('✅ AdminController: Contrato por defecto creado:', contrato.id_contrato);
    }

    const pagosCreados = [];
    const mesesACrear = tipo_recurrencia === 'mensual' ? (duracion_meses || 12) : 1;

    if (tipo_recurrencia === 'mensual') {
      // Crear pagos mensuales
      const fechaInicio = new Date(fecha_vencimiento);
      
      for (let i = 0; i < mesesACrear; i++) {
        const fechaVencimiento = new Date(fechaInicio);
        fechaVencimiento.setMonth(fechaInicio.getMonth() + i);
        
        const nuevoPago = await Pago.create({
          id_contrato: contrato.id_contrato,
          id_inquilino: inquilino.id_inquilino,
          concepto: `${concepto} - ${fechaVencimiento.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
          monto: parseFloat(monto),
          fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0],
          estado_pago: 'pendiente'
        });
        
        pagosCreados.push(nuevoPago);
      }
    } else {
      // Crear un solo pago
      const nuevoPago = await Pago.create({
        id_contrato: contrato.id_contrato,
        id_inquilino: inquilino.id_inquilino,
        concepto,
        monto: parseFloat(monto),
        fecha_vencimiento,
        estado_pago: 'pendiente'
      });
      
      pagosCreados.push(nuevoPago);
    }

    console.log('✅ AdminController: Pagos creados exitosamente:', pagosCreados.length);

    res.status(201).json({
      success: true,
      mensaje: `${pagosCreados.length} pago(s) creado(s) exitosamente`,
      data: pagosCreados
    });

  } catch (error) {
    console.error('❌ Error creando pago:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { concepto, monto, fecha_vencimiento, descripcion, estado } = req.body;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({
        success: false,
        mensaje: 'Pago no encontrado'
      });
    }

    await pago.update({
      concepto,
      monto,
      fecha_vencimiento,
      descripcion,
      estado
    });

    res.json({
      success: true,
      mensaje: 'Pago actualizado exitosamente',
      data: pago
    });

  } catch (error) {
    console.error('Error actualizando pago:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({
        success: false,
        mensaje: 'Pago no encontrado'
      });
    }

    await pago.destroy();

    res.json({
      success: true,
      mensaje: 'Pago eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando pago:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

const markPaymentAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { metodo_pago } = req.body;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({
        success: false,
        mensaje: 'Pago no encontrado'
      });
    }

    await pago.update({
      estado: 'Pagado',
      fecha_pago: new Date(),
      metodo_pago: metodo_pago || 'Transferencia'
    });

    res.json({
      success: true,
      mensaje: 'Pago marcado como pagado exitosamente',
      data: pago
    });

  } catch (error) {
    console.error('Error marcando pago como pagado:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// ===== GESTIÓN DE INCIDENCIAS =====
const getAllIncidents = async (req, res) => {
  try {
    const incidencias = await Incidencia.findAll({
      include: [
        {
          model: Inquilino,
          as: 'inquilino',
          include: [
            { 
              model: Usuario, 
              as: 'usuario',
              attributes: ['nombre', 'email']
            }
          ],
          attributes: ['id_inquilino', 'unidad', 'usuario_id']
        }
      ],
      order: [['fecha_creacion', 'DESC']],
      attributes: [
        'id_incidencia', 
        'id_inquilino', 
        'descripcion', 
        'estado', 
        'prioridad', 
        'id_proveedor',
        'fecha_creacion',
        'fecha_resuelta'
      ]
    });

    res.json({
      success: true,
      data: incidencias
    });

  } catch (error) {
    console.error('Error obteniendo incidencias:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

const updateIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const incidencia = await Incidencia.findByPk(id);
    if (!incidencia) {
      return res.status(404).json({
        success: false,
        mensaje: 'Incidencia no encontrada'
      });
    }

    await incidencia.update({ estado });

    res.json({
      success: true,
      mensaje: 'Estado de incidencia actualizado exitosamente',
      data: incidencia
    });

  } catch (error) {
    console.error('Error actualizando estado de incidencia:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

const assignProviderToIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_proveedor } = req.body;

    const incidencia = await Incidencia.findByPk(id);
    if (!incidencia) {
      return res.status(404).json({
        success: false,
        mensaje: 'Incidencia no encontrada'
      });
    }

    await incidencia.update({ 
      id_proveedor,
      estado: 'En proceso'
    });

    res.json({
      success: true,
      mensaje: 'Proveedor asignado exitosamente',
      data: incidencia
    });

  } catch (error) {
    console.error('Error asignando proveedor:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// ===== GESTIÓN DE INQUILINOS =====
const getAllTenants = async (req, res) => {
  try {
    const inquilinos = await Inquilino.findAll({
      include: [{ model: Usuario, as: 'usuario' }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: inquilinos
    });

  } catch (error) {
    console.error('Error obteniendo inquilinos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// ===== NOTIFICACIONES =====
const sendNotificationToTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { titulo, mensaje, tipo } = req.body;

    const notificacion = await Notificacion.create({
      id_inquilino: tenantId,
      titulo,
      mensaje,
      tipo: tipo || 'info',
      leida: false
    });

    res.status(201).json({
      success: true,
      mensaje: 'Notificación enviada exitosamente',
      data: notificacion
    });

  } catch (error) {
    console.error('Error enviando notificación:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

const sendBulkNotification = async (req, res) => {
  try {
    const { titulo, mensaje, tipo } = req.body;

    // Obtener todos los inquilinos
    const inquilinos = await Inquilino.findAll();

    // Crear notificaciones para todos
    const notificaciones = await Promise.all(
      inquilinos.map(inquilino => 
        Notificacion.create({
          id_inquilino: inquilino.id,
          titulo,
          mensaje,
          tipo: tipo || 'info',
          leida: false
        })
      )
    );

    res.status(201).json({
      success: true,
      mensaje: `Notificaciones enviadas exitosamente a ${inquilinos.length} inquilinos`,
      data: notificaciones
    });

  } catch (error) {
    console.error('Error enviando notificaciones masivas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

const getTenants = async (req, res) => {
  console.log('🎯 AdminController: getTenants llamado');
  try {
    // Intentar obtener inquilinos con manejo de errores robusto
    console.log('🔍 AdminController: Intentando obtener inquilinos...');
    
    // Primero verificar si existen usuarios con rol inquilino
    const usuariosInquilinos = await Usuario.findAll({
      where: { rol: 'inquilino' },
      attributes: ['id', 'nombre', 'email']
    });
    console.log('👥 AdminController: Usuarios con rol inquilino encontrados:', usuariosInquilinos.length);
    
    if (usuariosInquilinos.length === 0) {
      console.log('⚠️ AdminController: No hay usuarios con rol inquilino');
      return res.json({
        success: true,
        data: [],
        mensaje: 'No hay inquilinos registrados'
      });
    }

    // Primero obtener inquilinos sin relaciones para debug
    const inquilinosSimple = await Inquilino.findAll({
      attributes: ['id_inquilino', 'id_usuario', 'fecha_inicio_contrato', 'fecha_fin_contrato', 'unidad']
    });
    console.log('📊 AdminController: Inquilinos simples encontrados:', inquilinosSimple.length);
    console.log('🔍 AdminController: Primer inquilino simple:', JSON.stringify(inquilinosSimple[0], null, 2));

    // Ahora obtener con relaciones
    const inquilinos = await Inquilino.findAll({
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      attributes: ['id_inquilino', 'id_usuario', 'fecha_inicio_contrato', 'fecha_fin_contrato', 'unidad']
    });

    console.log('📊 AdminController: Inquilinos con relaciones encontrados:', inquilinos.length);
    console.log('🔍 AdminController: Primer inquilino con relación:', JSON.stringify(inquilinos[0], null, 2));

    // Si hay usuarios inquilinos pero no registros en tabla inquilinos
    if (inquilinos.length === 0) {
      console.log('⚠️ AdminController: Hay usuarios inquilinos pero no registros en tabla inquilinos');
      // Devolver los usuarios inquilinos sin datos de inquilino
      const inquilinosSinDatos = usuariosInquilinos.map(usuario => ({
        id_inquilino: null,
        id_usuario: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: 'No disponible', // Campo no existe en el modelo Usuario
        unidad: 'Sin asignar',
        fecha_inicio_contrato: null,
        fecha_fin_contrato: null,
        estado: 'Usuario creado, falta datos de inquilino'
      }));
      
      return res.json({
        success: true,
        data: inquilinosSinDatos,
        mensaje: 'Usuarios inquilinos encontrados, pero faltan datos de inquilino'
      });
    }

    // Formatear datos usando los aliases correctos
    const inquilinosFormateados = inquilinos.map(inquilino => {
      console.log('🔍 AdminController: Procesando inquilino:', {
        id: inquilino.id_inquilino,
        id_usuario: inquilino.id_usuario,
        usuario_data: inquilino.usuario,
        usuario_nombre: inquilino.usuario?.nombre
      });
      
      return {
        id_inquilino: inquilino.id_inquilino,
        id_usuario: inquilino.id_usuario,
        nombre: inquilino.usuario?.nombre || 'Sin nombre',
        email: inquilino.usuario?.email || 'Sin email',
        telefono: 'No disponible', // Campo no existe en el modelo Usuario
        unidad: inquilino.unidad || 'Sin asignar',
        fecha_inicio_contrato: inquilino.fecha_inicio_contrato,
        fecha_fin_contrato: inquilino.fecha_fin_contrato,
        estado: 'Activo'
      };
    });

    console.log('✅ AdminController: Inquilinos formateados exitosamente:', inquilinosFormateados.length);
    console.log('📋 AdminController: Primer inquilino formateado:', inquilinosFormateados[0]);

    res.json({
      success: true,
      data: inquilinosFormateados
    });

  } catch (error) {
    console.error('❌ Error obteniendo inquilinos:', error.message);
    console.error('🔍 Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      mensaje: `Error interno del servidor: ${error.message}`
    });
  }
};

module.exports = {
  getDashboard,
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
  markPaymentAsPaid,
  getAllIncidents,
  updateIncidentStatus,
  assignProviderToIncident,
  getAllTenants,
  sendNotificationToTenant,
  sendBulkNotification,
  getTenants
};