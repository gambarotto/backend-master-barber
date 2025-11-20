module.exports = {
  up: (queryInterface, Sequelize) => {
    const migrations = [];
    migrations.push(
      queryInterface.addColumn('fbcustumers', 'avatar_url', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    );

    return Promise.all(migrations);
  },

  down: (queryInterface) => {
    const migrations = [];

    migrations.push(queryInterface.removeColumn('fbcustumers', 'avatar_url'));

    return Promise.all(migrations);
  },
};
