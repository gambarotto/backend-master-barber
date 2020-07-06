import Sequelize, { Model } from 'sequelize';

class Rating extends Model {
  static init(sequelize) {
    super.init(
      {
        rating: Sequelize.NUMBER,
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
export default Rating;
