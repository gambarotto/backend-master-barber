import Favorite from '../models/Favorite';
import Custumer from '../models/Custumer';
import Store from '../models/Store';
import Employee from '../models/Employee';
import Service from '../models/Service';
import Image from '../models/Image';
import Avatar from '../models/Avatar';
import Address from '../models/Address';
import RatingStores from '../models/RatingStores';
import Schedule from '../models/Schedule';

class FavoriteController {
  async show(req, res) {
    const custumer = await Custumer.findByPk(req.params.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    const favorites = await Favorite.findAll({
      where: {
        custumer_id: custumer.id,
        favorite: true,
      },
      attributes: ['id', 'favorite'],
      include: [
        {
          model: Store,
          as: 'store',
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
            {
              model: Schedule,
              as: 'schedule',
              attributes: ['holiday', 'special', 'days_week'],
            },
            {
              model: Employee,
              as: 'employees',
              attributes: [
                'id',
                'name',
                'email',
                'responsibility',
                'schedule_id',
              ],
              include: [
                {
                  model: Avatar,
                  as: 'avatar',
                  attributes: ['id', 'url', 'path'],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json(favorites);
  }

  async store(req, res) {
    const store = await Store.findByPk(req.body.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    const custumer = await Custumer.findByPk(req.body.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    const favorite = await Favorite.create(req.body);
    return res.json(favorite);
  }

  // TODO criptografar dados da query
  async delete(req, res) {
    const favorite = await Favorite.findByPk(req.params.favorite_id);
    if (!favorite) {
      return res.status(404).json({ error: 'favorite not found' });
    }
    const custumer = await Custumer.findByPk(req.query.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    if (!custumer.id === favorite.custumer_id) {
      return res.status(400).json({ error: 'You do not permission for this' });
    }

    await favorite.destroy();
    return res.json({ success: 'ok' });
  }
}
export default new FavoriteController();
