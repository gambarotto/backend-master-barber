import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';

import db from '../../config/database';
import { avaliations, custumers, stores, ratingStores } from '../../database/schema';

class AvaliationController {
  async show(req: Request, res: Response): Promise<Response> {
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(req.params.store_id)))
      .limit(1);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const [avaliation] = await db
      .select({
        id: avaliations.id,
        rating: avaliations.rating,
      })
      .from(avaliations)
      .where(
        and(
          eq(avaliations.custumerId, Number(req.params.custumer_id)),
          eq(avaliations.storeId, Number(req.params.store_id))
        )
      )
      .limit(1);
    
    return res.json(avaliation);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, req.body.custumer_id))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, req.body.store_id))
      .limit(1);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const [avaliation] = await db
      .insert(avaliations)
      .values({
        rating: req.body.rating,
        custumerId: req.body.custumer_id,
        storeId: req.body.store_id,
      })
      .returning();
    
    if (!store.ratingId) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    const [ratingStore] = await db
      .select()
      .from(ratingStores)
      .where(eq(ratingStores.id, store.ratingId))
      .limit(1);
    
    if (!ratingStore) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    const newQty = ratingStore.qty + 1;
    const newRating = (ratingStore.rating + avaliation.rating) / newQty;
    
    await db
      .update(ratingStores)
      .set({ qty: newQty, rating: newRating })
      .where(eq(ratingStores.id, store.ratingId));
    
    return res.json(avaliation);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, req.body.custumer_id))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, req.body.store_id))
      .limit(1);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const [avaliation] = await db
      .select()
      .from(avaliations)
      .where(
        and(
          eq(avaliations.custumerId, req.body.custumer_id),
          eq(avaliations.storeId, req.body.store_id)
        )
      )
      .limit(1);
    
    if (!avaliation) {
      return res.json({ error: 'Avaliation not found' });
    }
    
    const ratingOld = avaliation.rating;
    
    const [updated] = await db
      .update(avaliations)
      .set({ rating: req.body.rating })
      .where(eq(avaliations.id, avaliation.id))
      .returning();

    if (!store.ratingId) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    const [ratingStore] = await db
      .select()
      .from(ratingStores)
      .where(eq(ratingStores.id, store.ratingId))
      .limit(1);
    
    if (!ratingStore) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    const newRating = (ratingStore.rating - ratingOld + updated.rating) / ratingStore.qty;

    await db
      .update(ratingStores)
      .set({ rating: newRating })
      .where(eq(ratingStores.id, store.ratingId));

    return res.json(updated);
  }
}

export default new AvaliationController();
