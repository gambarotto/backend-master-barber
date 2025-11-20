module.exports = {
  up: (queryInterface, Sequelize) => {
    const migrations = [];

    migrations.push(
      queryInterface.addColumn('employees', 'days_off', {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      })
    );

    migrations.push(queryInterface.removeColumn('employees', 'busy_schedule'));
    return Promise.all(migrations);
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('employees', 'day_off');
  },
};
