import Image from '../models/Image';
import Store from '../models/Store';

class ImageController {
  async store(req, res) {
    const store = await Store.findByPk(req.params.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    const { originalname: name, filename: path } = req.file;

    const file = await Image.create({
      name,
      path,
    });
    if (!file) {
      return res.status(400).json({ error: 'Error on Save' });
    }
    store.image_id = file.id;
    await store.save();
    return res.json(file);
  }
}
export default new ImageController();
