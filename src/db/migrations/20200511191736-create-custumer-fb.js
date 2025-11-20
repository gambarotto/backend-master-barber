module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fbcustumers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_facebook: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    return queryInterface.dropTable('fbcustumers');
  },
};
