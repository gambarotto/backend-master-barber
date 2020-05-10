import Avatar from '../models/Avatar';
import User from '../models/User';

class AvatarController {
  async store(req, res) {
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
}
export default new AvatarController();
