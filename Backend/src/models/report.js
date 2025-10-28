const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Reporte = sequelize.define('Reporte', {
  id_reporte: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario_creador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  nombre_reporte: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del reporte no puede estar vacío'
      },
      len: {
        args: [5, 255],
        msg: 'El nombre del reporte debe tener entre 5 y 255 caracteres'
      }
    }
  },
  tipo_reporte: {
    type: DataTypes.ENUM('pagos', 'incidencias', 'contratos', 'propiedades', 'inquilinos', 'financiero', 'operativo'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['pagos', 'incidencias', 'contratos', 'propiedades', 'inquilinos', 'financiero', 'operativo']],
        msg: 'El tipo de reporte debe ser uno de: pagos, incidencias, contratos, propiedades, inquilinos, financiero, operativo'
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'La descripción no puede exceder los 1000 caracteres'
      }
    }
  },
  parametros_filtro: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Parámetros de filtro en formato JSON (fechas, ids, estados, etc.)'
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
  formato_salida: {
    type: DataTypes.ENUM('pdf', 'excel', 'csv', 'json'),
    allowNull: false,
    defaultValue: 'pdf',
    validate: {
      isIn: {
        args: [['pdf', 'excel', 'csv', 'json']],
        msg: 'El formato de salida debe ser: pdf, excel, csv o json'
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('generando', 'completado', 'error', 'cancelado'),
    allowNull: false,
    defaultValue: 'generando',
    validate: {
      isIn: {
        args: [['generando', 'completado', 'error', 'cancelado']],
        msg: 'El estado debe ser: generando, completado, error o cancelado'
      }
    }
  },
  ruta_archivo: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'La ruta del archivo no puede exceder los 500 caracteres'
      }
    }
  },
  tamaño_archivo: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: 'Tamaño del archivo en bytes'
  },
  fecha_generacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_completado: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  fecha_expiracion: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha después de la cual el archivo se considera expirado'
  },
  numero_registros: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    defaultValue: 0,
    comment: 'Número de registros incluidos en el reporte'
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
  tableName: 'reportes',
  timestamps: false,
  hooks: {
    beforeUpdate: (reporte) => {
      reporte.fecha_actualizacion = new Date();
      
      // Si se está marcando como completado y no tiene fecha de completado, establecerla
      if (reporte.estado === 'completado' && !reporte.fecha_completado) {
        reporte.fecha_completado = new Date();
      }
    },
    beforeCreate: (reporte) => {
      // Establecer fecha de expiración por defecto (30 días desde la generación)
      if (!reporte.fecha_expiracion) {
        const fechaExpiracion = new Date();
        fechaExpiracion.setDate(fechaExpiracion.getDate() + 30);
        reporte.fecha_expiracion = fechaExpiracion;
      }
    }
  }
});

module.exports = Reporte;