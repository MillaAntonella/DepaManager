-- =====================================================
-- SCRIPT COMPLETO DE BASE DE DATOS DEPAMANAGER
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS depamanager;
USE depamanager;

-- 1. Tabla de Propiedades (PRIMERO por dependencias)
CREATE TABLE propiedades (
  id_propiedad BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  direccion VARCHAR(255) NOT NULL,
  tipo ENUM('residencial', 'comercial') NOT NULL,
  tamano DECIMAL(10, 2) NOT NULL,
  monto_alquiler DECIMAL(10, 2) NOT NULL,
  estado ENUM('disponible', 'ocupada', 'mantenimiento') NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla de Usuarios (TU ESTRUCTURA EXACTA)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL COMMENT 'Nombre completo del usuario',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email único para login',
  password VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada con bcrypt',
  rol ENUM('propietario', 'inquilino') NOT NULL DEFAULT 'inquilino' COMMENT 'Rol del usuario en el sistema',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Inquilinos (AJUSTADA para usar tu estructura de usuarios)
CREATE TABLE inquilinos (
  id_inquilino BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,  -- Cambiado a INT para coincidir con tu tabla usuarios
  id_propiedad BIGINT UNSIGNED NOT NULL,
  unidad VARCHAR(255),
  fecha_inicio_contrato DATE,
  fecha_fin_contrato DATE,
  estado ENUM('activo', 'inactivo', 'pendiente') DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,  -- Referencia a tu tabla
  FOREIGN KEY (id_propiedad) REFERENCES propiedades(id_propiedad) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabla de Contratos
CREATE TABLE contratos (
  id_contrato BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_inquilino BIGINT UNSIGNED NOT NULL,
  id_propiedad BIGINT UNSIGNED NOT NULL,
  tipo_contrato ENUM('residencial', 'comercial'),
  fecha_inicio DATE,
  fecha_fin DATE,
  monto_alquiler DECIMAL(10, 2),
  fecha_vencimiento_pago DATE,
  estado ENUM('activo', 'vencido', 'terminado') DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (id_inquilino) REFERENCES inquilinos(id_inquilino) ON DELETE CASCADE,
  FOREIGN KEY (id_propiedad) REFERENCES propiedades(id_propiedad) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabla de Pagos
CREATE TABLE pagos (
  id_pago BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_contrato BIGINT UNSIGNED NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  fecha_pago DATE,
  estado_pago ENUM('pagado', 'pendiente', 'vencido') DEFAULT 'pendiente',
  metodo_pago ENUM('tarjeta_credito', 'transferencia_bancaria', 'efectivo'),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabla de Proveedores
CREATE TABLE proveedores (
  id_proveedor BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  especialidad VARCHAR(255),
  numero_telefono VARCHAR(20),
  email VARCHAR(100),
  calificacion INT DEFAULT 0,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabla de Incidencias
CREATE TABLE incidencias (
  id_incidencia BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_inquilino BIGINT UNSIGNED NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('abierta', 'asignada', 'resuelta') DEFAULT 'abierta',
  prioridad ENUM('alta', 'media', 'baja') DEFAULT 'media',
  id_proveedor BIGINT UNSIGNED,
  fecha_resuelta TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (id_inquilino) REFERENCES inquilinos(id_inquilino) ON DELETE CASCADE,
  FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Tabla de Inventario
CREATE TABLE inventario (
  id_inventario BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_propiedad BIGINT UNSIGNED NOT NULL,
  nombre_item VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo_item ENUM('mueble', 'electrodomestico', 'otro') NOT NULL,
  condicion ENUM('nuevo', 'usado', 'danado') DEFAULT 'nuevo',
  asignado_a BIGINT UNSIGNED,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (id_propiedad) REFERENCES propiedades(id_propiedad) ON DELETE CASCADE,
  FOREIGN KEY (asignado_a) REFERENCES inquilinos(id_inquilino) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Tabla de Notificaciones (AJUSTADA para usar tu estructura)
CREATE TABLE notificaciones (
  id_notificacion BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,  -- Cambiado a INT para coincidir con tu tabla
  mensaje TEXT NOT NULL,
  tipo ENUM('alerta', 'advertencia', 'info', 'error') DEFAULT 'info',
  leida BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE  -- Referencia a tu tabla
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Tabla de Postulantes
CREATE TABLE postulantes (
  id_postulante BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  numero_telefono VARCHAR(20),
  estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
  id_propiedad BIGINT UNSIGNED,
  documentos JSON,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (id_propiedad) REFERENCES propiedades(id_propiedad) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Tabla de Vehículos
CREATE TABLE vehiculos (
  id_vehiculo BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_inquilino BIGINT UNSIGNED NOT NULL,
  tipo_vehiculo ENUM('auto', 'motocicleta') NOT NULL,
  placa_vehiculo VARCHAR(50) UNIQUE NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (id_inquilino) REFERENCES inquilinos(id_inquilino) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Tabla de Reportes (AJUSTADA para usar tu estructura)
CREATE TABLE reportes (
  id_reporte BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo_reporte ENUM('financiero', 'ocupacion', 'operacional', 'personalizado') NOT NULL,
  fecha_generado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  datos JSON,
  creado_por INT,  -- Cambiado a INT para coincidir con tu tabla
  fecha_eliminacion TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE CASCADE  -- Referencia a tu tabla
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para tu tabla usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- Índices para las demás tablas
CREATE INDEX idx_contratos_inquilino ON contratos(id_inquilino);
CREATE INDEX idx_contratos_propiedad ON contratos(id_propiedad);
CREATE INDEX idx_pagos_contrato_fecha ON pagos(id_contrato, fecha_pago);
CREATE INDEX idx_incidencias_inquilino_estado ON incidencias(id_inquilino, estado);
CREATE INDEX idx_incidencias_proveedor ON incidencias(id_proveedor);
CREATE INDEX idx_inquilinos_usuario ON inquilinos(id_usuario);
CREATE INDEX idx_inquilinos_propiedad ON inquilinos(id_propiedad);
CREATE INDEX idx_inventario_propiedad ON inventario(id_propiedad);
CREATE INDEX idx_inventario_asignado ON inventario(asignado_a);
CREATE INDEX idx_postulantes_propiedad ON postulantes(id_propiedad);
CREATE INDEX idx_vehiculos_placa ON vehiculos(placa_vehiculo);
CREATE INDEX idx_notificaciones_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_reportes_tipo_generado ON reportes(tipo_reporte, fecha_generado);
CREATE INDEX idx_propiedades_estado ON propiedades(estado);
CREATE INDEX idx_contratos_estado ON contratos(estado);
CREATE INDEX idx_pagos_estado ON pagos(estado_pago);