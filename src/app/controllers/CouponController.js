import CouponCustumer from '../models/CouponCustumer';
import Store from '../models/Store';
import Image from '../models/Image';
import RatingStores from '../models/RatingStores';
import Address from '../models/Address';

class CouponController {
  async show(req, res) {
    const coupons = await CouponCustumer.findAll({
      where: {
        custumer_id: req.params.custumer_id,
      },
      attributes: ['id', 'coupons', 'tickets', 'store_id', 'custumer_id'],
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
              model: RatingStores,
              as: 'rating',
              attributes: ['id', 'qty', 'rating'],
            },
          ],
        },
      ],
    });
    return res.json(coupons);
  }

  async store(req, res) {
    const { store_id: storeId, custumer_id: custumerId, tickets } = req.body;
    const coupon = await CouponCustumer.create({
      store_id: storeId,
      custumer_id: custumerId,
      tickets,
      coupons: 0,
    });

    return res.json(coupon);
  }

  async update(req, res) {
    const coupon = await CouponCustumer.findByPk(req.params.coupon_id);

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    coupon.tickets = req.body.tickets;

    if (coupon.tickets === 10) {
      coupon.coupons += 1;
      coupon.tickets = 0;
    }

    await coupon.save();
    const {
      id,
      coupons,
      tickets,
      store_id: storeId,
      custumer_id: custumerId,
    } = coupon;
    return res.json({
      id,
      coupons,
      tickets,
      storeId,
      custumerId,
    });
  }
}
export default new CouponController();
