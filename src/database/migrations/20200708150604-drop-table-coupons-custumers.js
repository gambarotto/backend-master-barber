module.exports = {
  up: (queryInterface) => {
    return queryInterface.dropTable('coupons_custumers');
  },

  down: (queryInterface) => {
    return queryInterface.createTable('coupons_custumers');
  },
};
