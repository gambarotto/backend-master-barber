import Sequelize, { Model } from 'sequelize';

class CouponCustumer extends Model {
  static init(sequelize) {
    super.init(
      {
        coupons: Sequelize.INTEGER,
        tickets: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Store, {
      foreignKey: 'store_id',
      as: 'store',
    });
    this.belongsTo(models.Custumer, {
      foreignKey: 'custumer_id',
      as: 'custumer',
    });
  }
}
export default CouponCustumer;
