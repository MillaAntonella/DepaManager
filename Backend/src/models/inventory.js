const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Inventario = sequelize.define('Inventario', {
  id_inventario: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  id_propiedad: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'propiedades',
      key: 'id_propiedad'
    }
  },
  nombre_item: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del item no puede estar vacío'
      },
      len: {
        args: [2, 255],
        msg: 'El nombre del item debe tener entre 2 y 255 caracteres'
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'La descripción no puede exceder 1000 caracteres'
      }
    }
  },
  tipo_item: {
    type: DataTypes.ENUM('mueble', 'electrodomestico', 'otro'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['mueble', 'electrodomestico', 'otro']],
        msg: 'El tipo de item debe ser mueble, electrodomestico u otro'
      }
    }
  },
  condicion: {
    type: DataTypes.ENUM('nuevo', 'usado', 'danado'),
    allowNull: false,
    defaultValue: 'nuevo',
    validate: {
      isIn: {
        args: [['nuevo', 'usado', 'danado']],
        msg: 'La condición debe ser nuevo, usado o danado'
      }
    }
  },
  asignado_a: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    references: {
      model: 'inquilinos',
      key: 'id_inquilino'
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
  tableName: 'inventario',
  timestamps: false,
  hooks: {
    beforeUpdate: (inventario) => {
      inventario.fecha_actualizacion = new Date();
    }
  }
});

module.exports = Inventario;