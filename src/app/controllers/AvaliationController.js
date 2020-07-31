import Avaliation from '../models/Avaliation';
import Custumer from '../models/Custumer';
import Store from '../models/Store';
import RatingStores from '../models/RatingStores';

class AvaliationController {
  async show(req, res) {
    const custumer = await Custumer.findByPk(req.params.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    const store = await Store.findByPk(req.params.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const avaliation = await Avaliation.findOne({
      where: {
        custumer_id: req.params.custumer_id,
        store_id: req.params.store_id,
      },
      attributes: ['id', 'rating'],
    });
    return res.json(avaliation);
  }

  async store(req, res) {
    const custumer = await Custumer.findByPk(req.body.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    const store = await Store.findByPk(req.body.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    const avaliation = await Avaliation.create(req.body);
    const ratingStore = await RatingStores.findByPk(store.rating_id);
    ratingStore.qty += 1;
    ratingStore.rating =
      (ratingStore.rating + avaliation.rating) / ratingStore.qty;
    await ratingStore.save();
    return res.json(avaliation);
  }

  async update(req, res) {
    const custumer = await Custumer.findByPk(req.body.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    const store = await Store.findByPk(req.body.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const avaliation = await Avaliation.findOne({
      where: {
        custumer_id: req.body.custumer_id,
        store_id: req.body.store_id,
      },
    });
    if (!avaliation) {
      return res.json({ error: 'Avaliation not found' });
    }
    const ratingOld = avaliation.rating;
    avaliation.rating = req.body.rating;
    await avaliation.save();

    const ratingStore = await RatingStores.findByPk(store.rating_id);
    ratingStore.rating -= ratingOld;
    ratingStore.rating =
      (ratingStore.rating + avaliation.rating) / ratingStore.qty;

    await ratingStore.save();

    return res.json(avaliation);
  }
}

export default new AvaliationController();
