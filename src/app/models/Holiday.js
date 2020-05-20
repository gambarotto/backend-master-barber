import Sequelize, { Model } from 'sequelize';

class Holiday extends Model {
  static init(sequelize) {
    super.init(
      {
        holidays: Sequelize.ARRAY(Sequelize.JSON),
        year: Sequelize.STRING,
        ibge_code: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default Holiday;
