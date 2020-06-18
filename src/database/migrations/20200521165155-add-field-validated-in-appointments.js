module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('appointments', 'validated', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('appointments', 'validated');
  },
};
