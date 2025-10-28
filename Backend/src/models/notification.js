const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Notificacion = sequelize.define('Notificacion', {
  id_notificacion: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El título no puede estar vacío'
      },
      len: {
        args: [5, 255],
        msg: 'El título debe tener entre 5 y 255 caracteres'
      }
    }
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El mensaje no puede estar vacío'
      },
      len: {
        args: [10, 2000],
        msg: 'El mensaje debe tener entre 10 y 2000 caracteres'
      }
    }
  },
  tipo: {
    type: DataTypes.ENUM('pago', 'mantenimiento', 'incidencia', 'general', 'postulacion', 'contrato'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['pago', 'mantenimiento', 'incidencia', 'general', 'postulacion', 'contrato']],
        msg: 'El tipo debe ser uno de: pago, mantenimiento, incidencia, general, postulacion, contrato'
      }
    }
  },
  prioridad: {
    type: DataTypes.ENUM('baja', 'media', 'alta', 'urgente'),
    allowNull: false,
    defaultValue: 'media',
    validate: {
      isIn: {
        args: [['baja', 'media', 'alta', 'urgente']],
        msg: 'La prioridad debe ser: baja, media, alta o urgente'
      }
    }
  },
  fecha_envio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_lectura: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  estado: {
    type: DataTypes.ENUM('no_leida', 'leida', 'archivada'),
    allowNull: false,
    defaultValue: 'no_leida',
    validate: {
      isIn: {
        args: [['no_leida', 'leida', 'archivada']],
        msg: 'El estado debe ser: no_leida, leida o archivada'
      }
    }
  },
  url_accion: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'La URL de acción no puede exceder los 500 caracteres'
      }
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_eliminacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'notificaciones',
  timestamps: false,
  hooks: {
    beforeUpdate: (notificacion) => {
      notificacion.fecha_actualizacion = new Date();
      
      // Si se está marcando como leída y no tiene fecha de lectura, establecerla
      if (notificacion.estado === 'leida' && !notificacion.fecha_lectura) {
        notificacion.fecha_lectura = new Date();
      }
    }
  }
});

module.exports = Notificacion;