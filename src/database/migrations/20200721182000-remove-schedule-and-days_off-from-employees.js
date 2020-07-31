module.exports = {
  up: (queryInterface) => {
    const migrations = [];

    migrations.push(queryInterface.removeColumn('employees', 'days_off'));

    migrations.push(queryInterface.removeColumn('employees', 'schedule'));
    return Promise.all(migrations);
  },

  down: (queryInterface, Sequelize) => {
    const migrations = [];

    migrations.push(
      queryInterface.addColumn('employees', 'days_off', {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      })
    );

    migrations.push(
      queryInterface.addColumn('employees', 'schedule', {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      })
    );
    return Promise.all(migrations);
  },
};
