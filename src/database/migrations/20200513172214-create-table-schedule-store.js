module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('schedules', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      saturday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      sunday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      holiday: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      special: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('schedules');
  },
};
