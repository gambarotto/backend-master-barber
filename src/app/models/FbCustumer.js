import Sequelize, { Model } from 'sequelize';

class FbCustumer extends Model {
  static init(sequelize) {
    super.init(
      {
        id_facebook: Sequelize.STRING,
        token: Sequelize.STRING,
        avatar_url: Sequelize.STRING,
        // name: Sequelize.VIRTUAL,
        // email: Sequelize.VIRTUAL,
        // profile: {
        //   type: Sequelize.VIRTUAL,
        //   get() {
        //     return { name: this.name, email: this.email };
        //   },
        // },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default FbCustumer;
