import User from '../models/User';
import Store from '../models/Store';
import Address from '../models/Address';
import Schedule from '../models/Schedule';
import Image from '../models/Image';
import RatingStores from '../models/RatingStores';
import Service from '../models/Service';

class StoreController {
  async index(req, res) {
    const stores = await Store.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'tel',
        'facebook_url',
        'instagram_url',
      ],
      include: [
        {
          model: Address,
          as: 'address',
          attributes: [
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zipcode',
          ],
        },
        {
          model: Schedule,
          as: 'schedule',
          attributes: ['holiday', 'special', 'days_week'],
        },
        {
          model: Image,
          as: 'image',
          attributes: ['id', 'url', 'path'],
        },
        {
          model: Service,
          as: 'services',
          attributes: ['id', 'name', 'price'],
        },
        {
          model: RatingStores,
          as: 'rating',
          attributes: ['id', 'qty', 'rating'],
        },
      ],
    });
    return res.json(stores);
  }

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

    const rating = await RatingStores.create({
      qty: 0,
      rating: 0,
    });
    store.rating_id = rating.id;
    await store.save();
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
