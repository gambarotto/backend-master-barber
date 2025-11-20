module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('services', 'store_id', {
      type: Sequelize.INTEGER,
      references: { model: 'stores', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('services', 'store_id');
  },
};
