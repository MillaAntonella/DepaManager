const { Usuario, Pago, Incidencia, Notificacion, Propiedad, Inquilino } = require('../models');
const { Op } = require('sequelize');

// Función auxiliar para buscar inquilino por usuario ID (maneja ambos campos)
const findInquilinoByUsuarioId = async (usuarioId, includeOptions = []) => {
  console.log('🔍 TenantController: Buscando inquilino para usuario ID:', usuarioId);
  
  const inquilino = await Inquilino.findOne({
    where: { 
      [Op.or]: [
        { id_usuario: usuarioId },
        { usuario_id: usuarioId }
      ]
    },
    include: includeOptions
  });
  
  console.log('📋 TenantController: Inquilino encontrado:', inquilino ? 'SÍ' : 'NO');
  if (inquilino) {
    console.log('📊 TenantController: Datos del inquilino:', {
      id_inquilino: inquilino.id_inquilino,
      id_usuario: inquilino.id_usuario,
      usuario_id: inquilino.usuario_id
    });
  }
  
  return inquilino;
};

class TenantController {
  // Obtener dashboard del inquilino
  async getDashboard(req, res) {
    try {
      const usuarioId = req.usuario.id;
      console.log('🏠 TenantController: getDashboard llamado para usuario:', usuarioId);

      // Primero obtener el registro de inquilino asociado al usuario
      const inquilino = await findInquilinoByUsuarioId(usuarioId, [{ model: Usuario, as: 'usuario' }]);

      if (!inquilino) {
        return res.status(404).json({
          success: false,
          mensaje: 'No se encontró el registro de inquilino para este usuario'
        });
      }

      // Obtener el próximo pago pendiente
      const proximoPagoData = await Pago.findOne({
        where: { 
          id_inquilino: inquilino.id_inquilino,
          estado_pago: 'pendiente'
        },
        order: [['fecha_vencimiento', 'ASC']]
      });

      const proximoPago = proximoPagoData ? {
        monto: parseFloat(proximoPagoData.monto),
        fecha: proximoPagoData.fecha_vencimiento,
        concepto: proximoPagoData.concepto
      } : {
        monto: 0,
        fecha: null,
        concepto: 'No hay pagos pendientes'
      };

      // Obtener información del departamento
      const miDepartamento = {
        numero: inquilino.unidad || '301',
        edificio: 'Edificio Torres del Mar'
      };

      // Datos ficticios para el dashboard (hasta implementar completamente)
      const pagosRealizados = 3; // Pagos realizados este año

      // Contar incidencias abiertas
      const incidencias = await Incidencia.count({
        where: { 
          id_inquilino: inquilino.id_inquilino, 
          estado: 'abierta' 
        }
      });

      // Obtener actividad reciente
      const actividadReciente = [
        {
          tipo: 'pago',
          titulo: 'Pago confirmado',
          fecha: new Date().toLocaleDateString('es-PE'),
          icono: '✅'
        },
        {
          tipo: 'incidencia',
          titulo: 'Incidencia reportada',
          fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE'),
          icono: '🔧'
        }
      ];

      const dashboardData = {
        proximoPago,
        miDepartamento,
        pagosRealizados,
        incidencias,
        actividadReciente
      };

      res.json({
        success: true,
        data: dashboardData,
        mensaje: 'Dashboard obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error en getDashboard:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Obtener pagos del inquilino
  async getMyPayments(req, res) {
    try {
      const usuarioId = req.usuario.id;
      console.log('💰 TenantController: getMyPayments llamado para usuario:', usuarioId);

      // Obtener el inquilino asociado al usuario
      const inquilino = await findInquilinoByUsuarioId(usuarioId);

      if (!inquilino) {
        return res.status(404).json({
          success: false,
          mensaje: 'No se encontró el registro de inquilino para este usuario'
        });
      }

      console.log('💰 TenantController: Buscando pagos para inquilino ID:', inquilino.id_inquilino);

      // Obtener todos los pagos reales del inquilino
      const pagos = await Pago.findAll({
        where: { id_inquilino: inquilino.id_inquilino },
        order: [['fecha_vencimiento', 'DESC']]
      });

      console.log('📊 TenantController: Pagos encontrados para inquilino:', pagos.length);
      
      // Log detallado de los pagos encontrados
      if (pagos.length > 0) {
        console.log('📋 TenantController: Detalle de pagos encontrados:');
        pagos.forEach((pago, index) => {
          console.log(`  ${index + 1}. ID: ${pago.id_pago}, Concepto: ${pago.concepto}, Monto: ${pago.monto}, Estado: ${pago.estado_pago}, Vence: ${pago.fecha_vencimiento}`);
        });
      } else {
        console.log('⚠️ TenantController: No se encontraron pagos para este inquilino');
      }

      // Formatear pagos para el dashboard
      const pagosFormateados = pagos.map(pago => ({
        id: pago.id_pago,
        concepto: pago.concepto,
        monto: parseFloat(pago.monto),
        fechaVencimiento: pago.fecha_vencimiento,
        estado: pago.estado_pago
      }));

      res.json({
        success: true,
        data: pagosFormateados,
        mensaje: 'Pagos obtenidos exitosamente'
      });

    } catch (error) {
      console.error('Error en getMyPayments:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Crear nueva incidencia
  async createIncident(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { titulo, descripcion, prioridad, categoria } = req.body;

      // Primero obtener el inquilino basado en el usuario
      const inquilino = await Inquilino.findOne({
        where: { usuario_id: usuarioId }
      });

      if (!inquilino) {
        return res.status(404).json({
          success: false,
          mensaje: 'Inquilino no encontrado'
        });
      }

      const nuevaIncidencia = await Incidencia.create({
        descripcion: titulo + (descripcion ? ': ' + descripcion : ''), // El modelo solo tiene descripción
        prioridad: prioridad || 'media',
        estado: 'abierta', // El modelo usa 'abierta' en lugar de 'pendiente'
        id_inquilino: inquilino.id_inquilino,
        fecha_creacion: new Date()
      });

      res.status(201).json({
        success: true,
        data: {
          ...nuevaIncidencia.toJSON(),
          titulo: titulo // Agregar título para el frontend
        },
        mensaje: 'Incidencia creada exitosamente'
      });

    } catch (error) {
      console.error('Error en createIncident:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Obtener incidencias del inquilino
  async getMyIncidents(req, res) {
    try {
      const usuarioId = req.usuario.id;

      // Primero obtener el inquilino basado en el usuario
      const inquilino = await Inquilino.findOne({
        where: { usuario_id: usuarioId }
      });

      if (!inquilino) {
        return res.status(404).json({
          success: false,
          mensaje: 'Inquilino no encontrado'
        });
      }

      const incidencias = await Incidencia.findAll({
        where: { id_inquilino: inquilino.id_inquilino },
        order: [['fecha_creacion', 'DESC']]
      });

      res.json({
        success: true,
        data: incidencias,
        mensaje: 'Incidencias obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error en getMyIncidents:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Obtener notificaciones del inquilino
  async getMyNotifications(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const notificaciones = await Notificacion.findAll({
        where: { usuario_id: usuarioId },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: notificaciones,
        mensaje: 'Notificaciones obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error en getMyNotifications:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Marcar notificación como leída
  async markNotificationAsRead(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { id } = req.params;

      const notificacion = await Notificacion.findOne({
        where: { 
          id, 
          usuario_id: usuarioId 
        }
      });

      if (!notificacion) {
        return res.status(404).json({
          success: false,
          mensaje: 'Notificación no encontrada'
        });
      }

      await notificacion.update({ leida: true });

      res.json({
        success: true,
        data: notificacion,
        mensaje: 'Notificación marcada como leída'
      });

    } catch (error) {
      console.error('Error en markNotificationAsRead:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Marcar todas las notificaciones como leídas
  async markAllNotificationsAsRead(req, res) {
    try {
      const usuarioId = req.usuario.id;

      await Notificacion.update(
        { leida: true },
        { 
          where: { 
            usuario_id: usuarioId,
            leida: false
          }
        }
      );

      res.json({
        success: true,
        mensaje: 'Todas las notificaciones han sido marcadas como leídas'
      });

    } catch (error) {
      console.error('Error en markAllNotificationsAsRead:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Obtener perfil del inquilino
  async getProfile(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const usuario = await Usuario.findByPk(usuarioId, {
        attributes: { exclude: ['password'] }
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          mensaje: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario,
        mensaje: 'Perfil obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error en getProfile:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Actualizar perfil del inquilino
  async updateProfile(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { nombre, email, telefono } = req.body;

      const usuario = await Usuario.findByPk(usuarioId);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          mensaje: 'Usuario no encontrado'
        });
      }

      await usuario.update({
        nombre: nombre || usuario.nombre,
        email: email || usuario.email,
        telefono: telefono || usuario.telefono
      });

      // Retornar usuario sin password
      const usuarioActualizado = await Usuario.findByPk(usuarioId, {
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        data: usuarioActualizado,
        mensaje: 'Perfil actualizado exitosamente'
      });

    } catch (error) {
      console.error('Error en updateProfile:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Procesar pago del inquilino
  async processPayment(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { pago_id, metodo_pago } = req.body;

      // Verificar que el pago pertenece al inquilino
      const pago = await Pago.findOne({
        where: {
          id: pago_id,
          inquilino_id: usuarioId,
          estado_pago: 'pendiente'
        }
      });

      if (!pago) {
        return res.status(404).json({
          success: false,
          mensaje: 'Pago no encontrado o ya fue procesado'
        });
      }

      // Actualizar el pago
      await pago.update({
        estado_pago: 'pagado',
        metodo_pago: metodo_pago,
        fecha_pago: new Date()
      });

      res.json({
        success: true,
        data: pago,
        mensaje: 'Pago procesado exitosamente'
      });

    } catch (error) {
      console.error('Error en processPayment:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Marcar pago como pagado (alternativa más simple)
  async markPaymentAsPaid(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { id } = req.params;
      const { metodo_pago } = req.body;

      // Verificar que el pago pertenece al inquilino
      const pago = await Pago.findOne({
        where: {
          id,
          inquilino_id: usuarioId,
          estado_pago: 'pendiente'
        }
      });

      if (!pago) {
        return res.status(404).json({
          success: false,
          mensaje: 'Pago no encontrado o ya fue procesado'
        });
      }

      // Actualizar el pago
      await pago.update({
        estado_pago: 'pagado',
        metodo_pago: metodo_pago,
        fecha_pago: new Date()
      });

      res.json({
        success: true,
        data: pago,
        mensaje: 'Pago marcado como pagado exitosamente'
      });

    } catch (error) {
      console.error('Error en markPaymentAsPaid:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }

  // Obtener información del departamento
  async getMyApartment(req, res) {
    try {
      const usuarioId = req.usuario.id;

      // Aquí deberías obtener la información real del departamento
      // Por ahora retornamos datos de ejemplo
      const apartmentInfo = {
        numero: '301',
        edificio: 'Edificio Torres del Mar',
        direccion: 'Av. Principal 123',
        area: '80 m²',
        habitaciones: 3,
        baños: 2,
        piso: 3
      };

      res.json({
        success: true,
        data: apartmentInfo,
        mensaje: 'Información del departamento obtenida exitosamente'
      });

    } catch (error) {
      console.error('Error en getMyApartment:', error);
      res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new TenantController();