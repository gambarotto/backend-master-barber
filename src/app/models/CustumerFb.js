import Sequelize, { Model } from 'sequelize';

class CustumerFb extends Model {
  static init(sequelize) {
    super.init(
      {
        id_facebook: Sequelize.STRING,
        token: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default CustumerFb;
