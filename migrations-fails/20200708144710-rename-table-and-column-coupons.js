module.exports = {
  up: (queryInterface) => {
    const migrations = [];
    migrations.push(
      queryInterface.renameColumn('coupons', 'coupon', 'coupons')
    );
    migrations.push(queryInterface.renameTable('coupons', 'coupons_custumers'));

    return Promise.all(migrations);
  },

  down: (queryInterface) => {
    const migrations = [];
    migrations.push(
      queryInterface.renameColumn('coupons_custumers', 'coupons', 'coupon')
    );
    migrations.push(queryInterface.renameTable('coupons_custumers', 'coupons'));
    return Promise.all(migrations);
  },
};
