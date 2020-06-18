import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Employee extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        responsibility: Sequelize.STRING,
        days_off: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async (employee) => {
      if (employee.password) {
        employee.password_hash = await bcrypt.hash(employee.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Store, { foreignKey: 'job_id', as: 'job' });
    this.belongsTo(models.Avatar, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsTo(models.Schedule, {
      foreignKey: 'schedule_id',
      as: 'schedule',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default Employee;
