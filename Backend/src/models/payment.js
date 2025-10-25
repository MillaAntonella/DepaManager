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
    allowNull: false,
    references: {
      model: 'contratos',
      key: 'id_contrato'
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