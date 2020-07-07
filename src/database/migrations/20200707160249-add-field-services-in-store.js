module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('stores', 'services_ids', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      references: { model: 'services', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('stores', 'services_ids');
  },
};
