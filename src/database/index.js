import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import Avatar from '../app/models/Avatar';
import Store from '../app/models/Store';
import Address from '../app/models/Address';
import Image from '../app/models/Image';
import Employee from '../app/models/Employee';
import Appointment from '../app/models/Appointment';
import Custumer from '../app/models/Custumer';
import CustumerFb from '../app/models/CustumerFb';
import Schedule from '../app/models/Schedule';
import Holiday from '../app/models/Holiday';

const models = [
  User,
  Avatar,
  Store,
  Address,
  Image,
  Employee,
  Appointment,
  Custumer,
  CustumerFb,
  Schedule,
  Holiday,
];

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
