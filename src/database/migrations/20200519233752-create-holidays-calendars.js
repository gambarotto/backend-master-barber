module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('holidays', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ibge_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      holidays: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        allowNull: false,
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
    return queryInterface.dropTable('holidays');
  },
};
