const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Contrato = sequelize.define('Contrato', {
  id_contrato: {
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
  id_propiedad: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'propiedades',
      key: 'id_propiedad'
    }
  },
  tipo_contrato: {
    type: DataTypes.ENUM('residencial', 'comercial'),
    allowNull: true,
    validate: {
      isIn: {
        args: [['residencial', 'comercial']],
        msg: 'El tipo de contrato debe ser residencial o comercial'
      }
    }
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      }
    }
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      },
      isAfterStartDate(value) {
        if (value && this.fecha_inicio && value <= this.fecha_inicio) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
    }
  },
  monto_alquiler: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: {
        msg: 'El monto de alquiler debe ser un número decimal'
      },
      min: {
        args: [0.01],
        msg: 'El monto de alquiler debe ser mayor a 0'
      }
    }
  },
  fecha_vencimiento_pago: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('activo', 'vencido', 'terminado'),
    allowNull: false,
    defaultValue: 'activo',
    validate: {
      isIn: {
        args: [['activo', 'vencido', 'terminado']],
        msg: 'El estado debe ser activo, vencido o terminado'
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
  tableName: 'contratos',
  timestamps: false,
  hooks: {
    beforeUpdate: (contrato) => {
      contrato.fecha_actualizacion = new Date();
    }
  }
});

module.exports = Contrato;