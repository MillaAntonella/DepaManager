const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pago = sequelize.define('Pago', {
  id_pago: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  id_contrato: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    defaultValue: null
    // Removemos la referencia por ahora hasta tener la tabla contratos
    // references: {
    //   model: 'contratos',
    //   key: 'id_contrato'
    // }
  },
  id_inquilino: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'inquilinos',
      key: 'id_inquilino'
    }
  },
  concepto: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Alquiler mensual',
    validate: {
      len: {
        args: [1, 255],
        msg: 'El concepto debe tener entre 1 y 255 caracteres'
      }
    }
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      }
    }
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'El monto debe ser un número decimal'
      },
      min: {
        args: [0.01],
        msg: 'El monto debe ser mayor a 0'
      }
    }
  },
  fecha_pago: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      }
    }
  },
  estado_pago: {
    type: DataTypes.ENUM('pagado', 'pendiente', 'vencido'),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: {
        args: [['pagado', 'pendiente', 'vencido']],
        msg: 'El estado de pago debe ser pagado, pendiente o vencido'
      }
    }
  },
  metodo_pago: {
    type: DataTypes.ENUM('tarjeta_credito', 'transferencia_bancaria', 'efectivo'),
    allowNull: true,
    validate: {
      isIn: {
        args: [['tarjeta_credito', 'transferencia_bancaria', 'efectivo']],
        msg: 'El método de pago debe ser tarjeta_credito, transferencia_bancaria o efectivo'
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
  tableName: 'pagos',
  timestamps: false,
  hooks: {
    beforeUpdate: (pago) => {
      pago.fecha_actualizacion = new Date();
    }
  }
});

module.exports = Pago;