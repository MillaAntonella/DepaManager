const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío'
      },
      len: {
        args: [2, 255],
        msg: 'El nombre debe tener entre 2 y 255 caracteres'
      }
    }
  },
  especialidad: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'La especialidad no puede exceder 255 caracteres'
      }
    }
  },
  numero_telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: {
        args: [0, 20],
        msg: 'El número de teléfono no puede exceder 20 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Debe ser un email válido'
      },
      len: {
        args: [0, 100],
        msg: 'El email no puede exceder 100 caracteres'
      }
    }
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'La calificación debe ser un número entero'
      },
      min: {
        args: [0],
        msg: 'La calificación debe ser mayor o igual a 0'
      },
      max: {
        args: [5],
        msg: 'La calificación debe ser menor o igual a 5'
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
  tableName: 'proveedores',
  timestamps: false,
  hooks: {
    beforeUpdate: (proveedor) => {
      proveedor.fecha_actualizacion = new Date();
    }
  }
});

module.exports = Proveedor;