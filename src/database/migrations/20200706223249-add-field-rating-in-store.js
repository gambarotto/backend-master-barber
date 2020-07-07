module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('stores', 'rating_id', {
      type: Sequelize.INTEGER,
      references: { model: 'rating_stores', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('stores', 'rating_id');
  },
};
