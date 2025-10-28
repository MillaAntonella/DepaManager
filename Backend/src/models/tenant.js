const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Inquilino = sequelize.define('Inquilino', {
  id_inquilino: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permitir null temporalmente
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  id_propiedad: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'propiedades',
      key: 'id_propiedad'
    }
  },
  unidad: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'La unidad no puede exceder 255 caracteres'
      }
    }
  },
  fecha_inicio_contrato: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      }
    }
  },
  fecha_fin_contrato: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      },
      isAfterStartDate(value) {
        if (value && this.fecha_inicio_contrato && value <= this.fecha_inicio_contrato) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'pendiente'),
    allowNull: false,
    defaultValue: 'activo',
    validate: {
      isIn: {
        args: [['activo', 'inactivo', 'pendiente']],
        msg: 'El estado debe ser activo, inactivo o pendiente'
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
  tableName: 'inquilinos',
  timestamps: false,
  hooks: {
    beforeUpdate: (inquilino) => {
      inquilino.fecha_actualizacion = new Date();
    }
  }
});

module.exports = Inquilino;