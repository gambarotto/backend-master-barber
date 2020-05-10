import Sequelize, { Model } from 'sequelize';

class Store extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        tel: Sequelize.STRING,
        facebook_url: Sequelize.STRING,
        instagram_url: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Address, { foreignKey: 'address_id', as: 'address' });
    this.belongsTo(models.Image, { foreignKey: 'image_id', as: 'image' });
  }
}

export default Store;
