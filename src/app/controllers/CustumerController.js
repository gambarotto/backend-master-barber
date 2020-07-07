import Custumer from '../models/Custumer';
import Avatar from '../models/Avatar';

class CustumerController {
  async show(req, res) {
    const custumer = await Custumer.findByPk(req.params.custumer_id, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: Avatar,
          as: 'avatar',
          attributes: ['id', 'name', 'path'],
        },
      ],
    });
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    return res.json(custumer);
  }

  async store(req, res) {
    const custumer = await Custumer.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (custumer) {
      return res.status(404).json({ error: 'Email already exists' });
    }

    const { id, name, email } = await Custumer.create(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const custumer = await Custumer.findByPk(req.params.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    const { email, oldPassword } = req.body;
    if (email !== custumer.email) {
      const emailExists = await Custumer.findOne({
        where: { email },
      });
      if (emailExists) {
        return res.status(401).json({ error: 'Email already exists' });
      }
    }
    if (oldPassword && !(await custumer.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Passwords does not match' });
    }
    const { name } = await custumer.update(req.body);

    return res.json({
      name,
      email,
    });
  }

  async delete(req, res) {
    const custumer = await Custumer.findByPk(req.params.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    await custumer.destroy();
    return res.json({ success: 'Conta excluída com Sucesso!' });
  }
}

export default new CustumerController();
