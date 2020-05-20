import Sequelize, { Model } from 'sequelize';

class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        holiday: Sequelize.ARRAY(Sequelize.STRING),
        special: Sequelize.ARRAY(Sequelize.STRING),
        owner_id: Sequelize.INTEGER,
        owner_type: Sequelize.STRING,
        days_week: Sequelize.ARRAY(Sequelize.JSON),
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default Schedule;
