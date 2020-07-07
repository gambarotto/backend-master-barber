import Sequelize, { Model } from 'sequelize';

class RatingStores extends Model {
  static init(sequelize) {
    super.init(
      {
        qty: Sequelize.INTEGER,
        rating: Sequelize.DOUBLE,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default RatingStores;
