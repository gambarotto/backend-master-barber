import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import Avatar from '../app/models/Avatar';
import Store from '../app/models/Store';
import Address from '../app/models/Address';
import Image from '../app/models/Image';
import Employee from '../app/models/Employee';

const models = [User, Avatar, Store, Address, Image, Employee];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
