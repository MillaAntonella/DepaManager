const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Vehiculo = sequelize.define('Vehiculo', {
  id_vehiculo: {
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
  tipo_vehiculo: {
    type: DataTypes.ENUM('auto', 'motocicleta'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['auto', 'motocicleta']],
        msg: 'El tipo de vehículo debe ser auto o motocicleta'
      }
    }
  },
  placa_vehiculo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'La placa del vehículo no puede estar vacía'
      },
      len: {
        args: [3, 50],
        msg: 'La placa del vehículo debe tener entre 3 y 50 caracteres'
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
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false,
    defaultValue: 'activo',
    validate: {
      isIn: {
        args: [['activo', 'inactivo']],
        msg: 'El estado debe ser activo o inactivo'
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
  tableName: 'vehiculos',
  timestamps: false,
  hooks: {
    beforeUpdate: (vehiculo) => {
      vehiculo.fecha_actualizacion = new Date();
    },
    beforeCreate: (vehiculo) => {
      // Convertir placa a mayúsculas
      if (vehiculo.placa_vehiculo) {
        vehiculo.placa_vehiculo = vehiculo.placa_vehiculo.toUpperCase();
      }
    },
    beforeUpdate: (vehiculo) => {
      // Convertir placa a mayúsculas
      if (vehiculo.placa_vehiculo) {
        vehiculo.placa_vehiculo = vehiculo.placa_vehiculo.toUpperCase();
      }
    }
  }
});

module.exports = Vehiculo;