import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { couponCustumers, stores, images, ratingStores, addresses } from '../../db/schema';

class CouponController {
  async show(req: Request, res: Response): Promise<Response> {
    const coupons = await db.query.couponCustumers.findMany({
      where: eq(couponCustumers.custumerId, Number(req.params.custumer_id)),
      columns: {
        id: true,
        coupons: true,
        tickets: true,
        storeId: true,
        custumerId: true,
      },
      with: {
        store: {
          columns: {
            id: true,
            name: true,
            email: true,
            tel: true,
            facebookUrl: true,
            instagramUrl: true,
          },
          with: {
            address: {
              columns: {
                street: true,
                number: true,
                complement: true,
                state: true,
                city: true,
                zipcode: true,
              },
            },
            image: {
              columns: {
                id: true,
                path: true,
              },
            },
            rating: {
              columns: {
                id: true,
                qty: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    // Transformar para o formato esperado
    const formatted = coupons.map((coupon) => ({
      ...coupon,
      store_id: coupon.storeId,
      custumer_id: coupon.custumerId,
      store: coupon.store
        ? {
            ...coupon.store,
            facebook_url: coupon.store.facebookUrl,
            instagram_url: coupon.store.instagramUrl,
            image: coupon.store.image
              ? {
                  ...coupon.store.image,
                  url: `http://192.168.15.22:3333/images/${coupon.store.image.path}`,
                }
              : null,
          }
        : null,
    }));

    return res.json(formatted);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const { store_id: storeId, custumer_id: custumerId, tickets } = req.body;
    
    const [coupon] = await db
      .insert(couponCustumers)
      .values({
        storeId,
        custumerId,
        tickets,
        coupons: 0,
      })
      .returning();

    return res.json(coupon);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const [coupon] = await db
      .select()
      .from(couponCustumers)
      .where(eq(couponCustumers.id, Number(req.params.coupon_id)))
      .limit(1);

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    const newTickets = req.body.tickets;
    let newCoupons = coupon.coupons;

    if (newTickets === 10) {
      newCoupons += 1;
      const [updated] = await db
        .update(couponCustumers)
        .set({ tickets: 0, coupons: newCoupons })
        .where(eq(couponCustumers.id, Number(req.params.coupon_id)))
        .returning();
      
      return res.json({
        id: updated.id,
        coupons: updated.coupons,
        tickets: updated.tickets,
        storeId: updated.storeId,
        custumerId: updated.custumerId,
      });
    }

    const [updated] = await db
      .update(couponCustumers)
      .set({ tickets: newTickets })
      .where(eq(couponCustumers.id, Number(req.params.coupon_id)))
      .returning();
    
    return res.json({
      id: updated.id,
      coupons: updated.coupons,
      tickets: updated.tickets,
      storeId: updated.storeId,
      custumerId: updated.custumerId,
    });
  }
}

export default new CouponController();
