module.exports = {
  up: (queryInterface, Sequelize) => {
    const migrations = [];

    migrations.push(
      queryInterface.addColumn('schedules', 'owner_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      })
    );
    migrations.push(
      queryInterface.addColumn('schedules', 'owner_type', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    );
    migrations.push(
      queryInterface.addColumn('schedules', 'days_week', {
        type: Sequelize.ARRAY(Sequelize.JSON),
        allowNull: true,
      })
    );
    migrations.push(queryInterface.removeColumn('schedules', 'saturday'));
    migrations.push(queryInterface.removeColumn('schedules', 'sunday'));

    return Promise.all(migrations);
  },

  down: (queryInterface) => {
    const migrations = [];

    migrations.push(queryInterface.removeColumn('schedules', 'owner_type'));
    migrations.push(queryInterface.removeColumn('schedules', 'owner_id'));
    migrations.push(queryInterface.removeColumn('schedules', 'days_week'));

    return Promise.all(migrations);
  },
};
