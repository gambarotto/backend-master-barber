import jwt from 'jsonwebtoken';

import User from '../models/User';
import Employee from '../models/Employee';
import Custumer from '../models/Custumer';
import authConfig from '../../config/auth';

class SessionController {
  async adminStore(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Password invalid' });
    }
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async employeeStore(req, res) {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ where: { email } });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    if (!(await employee.checkPassword(password))) {
      return res.status(400).json({ error: 'Password invalid' });
    }

    const { id, name } = employee;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async custumerStore(req, res) {
    const { email, password } = req.body;
    const custumer = await Custumer.findOne({ where: { email } });
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    if (!(await custumer.checkPassword(password))) {
      return res.status(400).json({ error: 'Password invalid' });
    }
    const { id, name } = custumer;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
