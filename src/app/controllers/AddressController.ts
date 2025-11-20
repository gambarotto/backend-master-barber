import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { addresses, stores } from '../../database/schema';

class AddressController {
  async store(req: Request, res: Response): Promise<Response> {
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(req.params.store_id)))
      .limit(1);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const [address] = await db
      .insert(addresses)
      .values({
        name: req.body.name,
        street: req.body.street,
        number: req.body.number,
        complement: req.body.complement,
        state: req.body.state,
        city: req.body.city,
        zipcode: req.body.zipcode,
      })
      .returning();
    
    if (!address) {
      return res.status(400).json({ error: 'Error on Save' });
    }
    
    await db
      .update(stores)
      .set({ addressId: address.id })
      .where(eq(stores.id, Number(req.params.store_id)));
    
    return res.json(address);
  }
}

export default new AddressController();
