module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('employees', 'schedule_id', {
      type: Sequelize.INTEGER,
      references: { model: 'schedules', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('employees', 'schedule_id');
  },
};
