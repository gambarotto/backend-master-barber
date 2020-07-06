module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('custumers', 'avatar_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('custumers', 'avatar_id');
  },
};
