const { Sequelize } = require('sequelize');
const sequelize = require('../config/sequelize');

// Importar todos los modelos
const Usuario = require('./user');
const Propiedad = require('./property');
const Inquilino = require('./tenant');
const Contrato = require('./contract');
const Pago = require('./payment');
const Proveedor = require('./provider');
const Incidencia = require('./incident');
const Inventario = require('./inventory');
const Postulante = require('./applicant');
const Vehiculo = require('./vehicle');
const Notificacion = require('./notification');
const Reporte = require('./report');

// Definir relaciones entre modelos
const setupAssociations = () => {
  // Usuario - Inquilino (1:1)
  Usuario.hasOne(Inquilino, { 
    foreignKey: 'id_usuario', 
    as: 'inquilino' 
  });
  Inquilino.belongsTo(Usuario, { 
    foreignKey: 'id_usuario', 
    as: 'usuario' 
  });

  // Propiedad - Inquilino (1:N)
  Propiedad.hasMany(Inquilino, { 
    foreignKey: 'id_propiedad', 
    as: 'inquilinos' 
  });
  Inquilino.belongsTo(Propiedad, { 
    foreignKey: 'id_propiedad', 
    as: 'propiedad' 
  });

  // Inquilino - Contrato (1:N)
  Inquilino.hasMany(Contrato, { 
    foreignKey: 'id_inquilino', 
    as: 'contratos' 
  });
  Contrato.belongsTo(Inquilino, { 
    foreignKey: 'id_inquilino', 
    as: 'inquilino' 
  });

  // Propiedad - Contrato (1:N)
  Propiedad.hasMany(Contrato, { 
    foreignKey: 'id_propiedad', 
    as: 'contratos' 
  });
  Contrato.belongsTo(Propiedad, { 
    foreignKey: 'id_propiedad', 
    as: 'propiedad' 
  });

  // Contrato - Pago (1:N)
  Contrato.hasMany(Pago, { 
    foreignKey: 'id_contrato', 
    as: 'pagos' 
  });
  Pago.belongsTo(Contrato, { 
    foreignKey: 'id_contrato', 
    as: 'contrato' 
  });

  // Inquilino - Pago (1:N)
  Inquilino.hasMany(Pago, { 
    foreignKey: 'id_inquilino', 
    as: 'pagos' 
  });
  Pago.belongsTo(Inquilino, { 
    foreignKey: 'id_inquilino', 
    as: 'inquilino' 
  });

  // Inquilino - Incidencia (1:N)
  Inquilino.hasMany(Incidencia, { 
    foreignKey: 'id_inquilino', 
    as: 'incidencias' 
  });
  Incidencia.belongsTo(Inquilino, { 
    foreignKey: 'id_inquilino', 
    as: 'inquilino' 
  });

  // Proveedor - Incidencia (1:N)
  Proveedor.hasMany(Incidencia, { 
    foreignKey: 'id_proveedor', 
    as: 'incidencias' 
  });
  Incidencia.belongsTo(Proveedor, { 
    foreignKey: 'id_proveedor', 
    as: 'proveedor' 
  });

  // Propiedad - Inventario (1:N)
  Propiedad.hasMany(Inventario, { 
    foreignKey: 'id_propiedad', 
    as: 'inventarios' 
  });
  Inventario.belongsTo(Propiedad, { 
    foreignKey: 'id_propiedad', 
    as: 'propiedad' 
  });

  // Inquilino - Inventario (asignado_a) (1:N)
  Inquilino.hasMany(Inventario, { 
    foreignKey: 'asignado_a', 
    as: 'inventarios_asignados' 
  });
  Inventario.belongsTo(Inquilino, { 
    foreignKey: 'asignado_a', 
    as: 'inquilino_asignado' 
  });

  // Propiedad - Postulante (1:N)
  Propiedad.hasMany(Postulante, { 
    foreignKey: 'id_propiedad', 
    as: 'postulantes' 
  });
  Postulante.belongsTo(Propiedad, { 
    foreignKey: 'id_propiedad', 
    as: 'propiedad' 
  });

  // Inquilino - Vehiculo (1:N)
  Inquilino.hasMany(Vehiculo, { 
    foreignKey: 'id_inquilino', 
    as: 'vehiculos' 
  });
  Vehiculo.belongsTo(Inquilino, { 
    foreignKey: 'id_inquilino', 
    as: 'inquilino' 
  });

  // Usuario - Notificacion (1:N)
  Usuario.hasMany(Notificacion, { 
    foreignKey: 'usuario_id', 
    as: 'notificaciones' 
  });
  Notificacion.belongsTo(Usuario, { 
    foreignKey: 'usuario_id', 
    as: 'usuario' 
  });

  // Usuario - Reporte (1:N)
  Usuario.hasMany(Reporte, { 
    foreignKey: 'creado_por', 
    as: 'reportes_creados' 
  });
  Reporte.belongsTo(Usuario, { 
    foreignKey: 'creado_por', 
    as: 'creador' 
  });
};

// Configurar relaciones
setupAssociations();

// Exportar todos los modelos y sequelize
module.exports = {
  sequelize,
  Sequelize,
  Usuario,
  Propiedad,
  Inquilino,
  Contrato,
  Pago,
  Proveedor,
  Incidencia,
  Inventario,
  Postulante,
  Vehiculo,
  Notificacion,
  Reporte
};