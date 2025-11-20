module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rating_stores', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rating: {
        type: Sequelize.DOUBLE,
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
    return queryInterface.dropTable('rating_stores');
  },
};
