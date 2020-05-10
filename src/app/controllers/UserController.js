import User from '../models/User';
import Store from '../models/Store';

class UserController {
  async store(req, res) {
    const existsEmail = await User.findOne({
      where: { email: req.body.email },
    });
    if (existsEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { name, email, oldPassword } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User does not exists' });
    }
    if (email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const storeExists = await Store.findByPk(req.body.store_id);
    if (!storeExists) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // eslint-disable-next-line camelcase
    const { id } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const user = await User.destroy({ where: { id: req.params.id } });

    if (!user) {
      return res.status(400).json({ error: 'Error on delete' });
    }

    return res.json({ success: 'ok' });
  }
}

export default new UserController();
