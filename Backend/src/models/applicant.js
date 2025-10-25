const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Postulante = sequelize.define('Postulante', {
  id_postulante: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_completo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre completo no puede estar vacío'
      },
      len: {
        args: [2, 255],
        msg: 'El nombre completo debe tener entre 2 y 255 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Debe ser un email válido'
      },
      len: {
        args: [5, 100],
        msg: 'El email debe tener entre 5 y 100 caracteres'
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
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: {
        args: [['pendiente', 'aprobado', 'rechazado']],
        msg: 'El estado debe ser pendiente, aprobado o rechazado'
      }
    }
  },
  id_propiedad: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    references: {
      model: 'propiedades',
      key: 'id_propiedad'
    }
  },
  documentos: {
    type: DataTypes.JSON,
    allowNull: true,
    validate: {
      isValidDocuments(value) {
        if (value) {
          // Validar que sea un objeto con propiedades válidas
          if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('Los documentos deben ser un objeto JSON válido');
          }
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
  tableName: 'postulantes',
  timestamps: false,
  hooks: {
    beforeUpdate: (postulante) => {
      postulante.fecha_actualizacion = new Date();
    }
  }
});

module.exports = Postulante;