module.exports = {
  up: (queryInterface) => {
    return queryInterface.renameColumn('coupon_custumers', 'tikets', 'tickets');
  },

  down: (queryInterface) => {
    return queryInterface.renameColumn('coupon_custumers', 'tickets', 'tikets');
  },
};
