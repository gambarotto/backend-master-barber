module.exports = {
  up: (queryInterface) => {
    return queryInterface.renameTable('coupons_custumers', 'coupon_custumers');
  },

  down: (queryInterface) => {
    return queryInterface.renameTable('coupon_custumers', 'coupons_custumers');
  },
};
