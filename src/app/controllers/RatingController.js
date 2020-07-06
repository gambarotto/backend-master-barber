import Rating from '../models/Rating';
import Custumer from '../models/Custumer';
import Store from '../models/Store';

class RatingController {
  async store(req, res) {
    const custumer = await Custumer.findByPk(req.body.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    const store = await Store.findByPk(req.body.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    const rating = await Rating.create({
      store_id: store.id,
      custumer_id: custumer.id,
      rating: req.body.rating,
    });
    return res.json(rating);
  }
}
export default new RatingController();
