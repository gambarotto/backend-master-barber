import Sequelize from 'sequelize';
import databaseConfig from '../../config/database';

import Avatar from '../models/Avatar';
import User from '../models/User';
import Employee from '../models/Employee';

class AvatarController {
  async storeUsers(req, res) {
    const user = await User.findByPk(req.params.user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { originalname: name, filename: path } = req.file;

    const file = await Avatar.create({
      name,
      path,
    });
    if (!file) {
      return res.status(400).json({ error: 'Error on Save' });
    }
    user.avatar_id = file.id;
    await user.save();
    return res.json(file);
  }

  async storeEmployees(req, res) {
    const sequelize = new Sequelize(databaseConfig);
    const { originalname: name, filename: path } = req.file;
    try {
      const result = await sequelize.transaction(async (t) => {
        const employee = await Employee.findByPk(req.params.employee_id, {
          transaction: t,
        });
        const file = await Avatar.create(
          {
            name,
            path,
          },
          {
            transaction: t,
          }
        );
        await employee.update({ avatar_id: file.id }, { transaction: t });

        return file;
      });
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: 'Error on Save, please try again' });
    }
  }
}
export default new AvatarController();
