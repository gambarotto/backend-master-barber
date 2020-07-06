import Avatar from '../models/Avatar';
import Custumer from '../models/Custumer';

class AvatarUserController {
  async index(req, res) {
    const custumer = await Custumer.findByPk(req.params.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    const avatar = Avatar.findByPk(custumer.avatar_id);

    return res.json(avatar);
  }

  async update(req, res) {
    const custumer = await Custumer.findByPk(req.params.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    const { originalname: name, filename: path } = req.file;

    const file = await Avatar.update(custumer.avatar_id, {
      name,
      path,
    });
    if (!file) {
      return res.status(400).json({ error: 'Error on Save' });
    }
    custumer.avatar_id = file.id;
    await custumer.save();
    return res.json(file);
  }

  async store(req, res) {
    const custumer = await Custumer.findByPk(req.params.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    const { originalname: name, filename: path } = req.file;

    const file = await Avatar.create({
      name,
      path,
    });
    if (!file) {
      return res.status(400).json({ error: 'Error on Save' });
    }
    custumer.avatar_id = file.id;
    await custumer.save();
    return res.json(file);
  }
}
export default new AvatarUserController();
