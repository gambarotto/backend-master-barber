import User from '../models/User';
import Store from '../models/Store';

class StoreController {
  async store(req, res) {
    const user = await User.findByPk(req.params.user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const storeExists = await Store.findOne({ where: { cnpj: req.body.cnpj } });
    if (storeExists) {
      return res.status(401).json({ error: 'CNPJ already exists' });
    }

    const store = await Store.create(req.body);
    if (!store) {
      return res.status(400).json({ error: 'Error on Save' });
    }
    user.store_id = store.id;
    await user.save();
    return res.json(store);
  }

  async update(req, res) {
    const store = await Store.findByPk(req.params.user_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const { cnpj } = req.body;
    if (cnpj !== store.cnpj) {
      const cnpjExists = await Store.findOne({ where: { cnpj } });
      if (cnpjExists) {
        return res.status(400).json({ error: 'CNPJ already exists' });
      }
    }
    await store.update(req.body);

    return res.json(store);
  }

  async delete(req, res) {
    const store = await Store.findByPk(req.params.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    await store.destroy();
    return res.json({ ok: 'ok' });
  }
}

export default new StoreController();
