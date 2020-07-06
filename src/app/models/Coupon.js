import Sequelize, { Model } from 'sequelize';

class Coupon extends Model {
  static init(sequelize) {
    super.init(
      {
        tikets: Sequelize.NUMBER,
        coupon: Sequelize.NUMBER,
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
export default Coupon;
