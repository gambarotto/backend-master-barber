import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { ratingStores, custumers, stores } from '../../db/schema';

class RatingController {
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
    
    const [rating] = await db
      .insert(ratingStores)
      .values({
        qty: 1,
        rating: req.body.rating,
      })
      .returning();
    
    return res.json(rating);
  }
}

export default new RatingController();
