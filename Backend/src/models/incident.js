const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Incidencia = sequelize.define('Incidencia', {
  id_incidencia: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  id_inquilino: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'inquilinos',
      key: 'id_inquilino'
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La descripción no puede estar vacía'
      },
      len: {
        args: [10, 2000],
        msg: 'La descripción debe tener entre 10 y 2000 caracteres'
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('abierta', 'asignada', 'resuelta'),
    allowNull: false,
    defaultValue: 'abierta',
    validate: {
      isIn: {
        args: [['abierta', 'asignada', 'resuelta']],
        msg: 'El estado debe ser abierta, asignada o resuelta'
      }
    }
  },
  prioridad: {
    type: DataTypes.ENUM('alta', 'media', 'baja'),
    allowNull: false,
    defaultValue: 'media',
    validate: {
      isIn: {
        args: [['alta', 'media', 'baja']],
        msg: 'La prioridad debe ser alta, media o baja'
      }
    }
  },
  id_proveedor: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    references: {
      model: 'proveedores',
      key: 'id_proveedor'
    }
  },
  fecha_resuelta: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isAfterCreation(value) {
        if (value && this.fecha_creacion && value < this.fecha_creacion) {
          throw new Error('La fecha de resolución debe ser posterior a la fecha de creación');
        }
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
  tableName: 'incidencias',
  timestamps: false,
  hooks: {
    beforeUpdate: (incidencia) => {
      incidencia.fecha_actualizacion = new Date();
      
      // Si el estado cambia a 'resuelta' y no tiene fecha_resuelta, asignarla
      if (incidencia.estado === 'resuelta' && !incidencia.fecha_resuelta) {
        incidencia.fecha_resuelta = new Date();
      }
    }
  }
});

module.exports = Incidencia;