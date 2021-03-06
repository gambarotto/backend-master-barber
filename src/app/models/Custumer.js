import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Custumer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.FbCustumer, { foreignKey: 'id_fb', as: 'facebook' });
    this.belongsTo(models.Avatar, { foreignKey: 'avatar_id', as: 'avatar' });
    // this.belongsTo(models.Coupon, { foreignKey: 'coupon_id', as: 'coupon' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default Custumer;
