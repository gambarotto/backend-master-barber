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
        schedule: Sequelize.ARRAY(Sequelize.STRING),
        busy_schedule: Sequelize.ARRAY(Sequelize.STRING),
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
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default Employee;
