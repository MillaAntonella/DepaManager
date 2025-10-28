'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pagos', 'id_inquilino', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true, // Permitir null temporalmente para datos existentes
      references: {
        model: 'inquilinos',
        key: 'id_inquilino'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pagos', 'id_inquilino');
  }
};