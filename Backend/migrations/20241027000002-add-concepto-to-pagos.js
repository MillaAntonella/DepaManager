'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pagos', 'concepto', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: 'Alquiler mensual'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pagos', 'concepto');
  }
};