/* eslint-disable camelcase */
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
import FbCustumer from '../app/models/FbCustumer';
import Schedule from '../app/models/Schedule';
import Holiday from '../app/models/Holiday';
import Favorite from '../app/models/Favorite';
import CouponCustumer from '../app/models/CouponCustumer';
import RatingStores from '../app/models/RatingStores';
import Avaliation from '../app/models/Avaliation';
import Service from '../app/models/Service';

const models = [
  User,
  Avatar,
  Store,
  Address,
  Image,
  Employee,
  Appointment,
  Custumer,
  FbCustumer,
  Schedule,
  Holiday,
  Favorite,
  CouponCustumer,
  RatingStores,
  Avaliation,
  Service,
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
