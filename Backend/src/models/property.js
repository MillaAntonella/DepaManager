const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Propiedad = sequelize.define('Propiedad', {
  id_propiedad: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La dirección no puede estar vacía'
      },
      len: {
        args: [5, 255],
        msg: 'La dirección debe tener entre 5 y 255 caracteres'
      }
    }
  },
  tipo: {
    type: DataTypes.ENUM('residencial', 'comercial'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['residencial', 'comercial']],
        msg: 'El tipo debe ser residencial o comercial'
      }
    }
  },
  tamano: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'El tamaño debe ser un número decimal'
      },
      min: {
        args: [0.01],
        msg: 'El tamaño debe ser mayor a 0'
      }
    }
  },
  monto_alquiler: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
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
  estado: {
    type: DataTypes.ENUM('disponible', 'ocupada', 'mantenimiento'),
    allowNull: false,
    defaultValue: 'disponible',
    validate: {
      isIn: {
        args: [['disponible', 'ocupada', 'mantenimiento']],
        msg: 'El estado debe ser disponible, ocupada o mantenimiento'
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
  tableName: 'propiedades',
  timestamps: false,
  hooks: {
    beforeUpdate: (propiedad) => {
      propiedad.fecha_actualizacion = new Date();
    }
  }
});

module.exports = Propiedad;