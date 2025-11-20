import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

import { db } from '../../config/database';
import { addresses, stores } from '../../db/schemas';

type Store = InferSelectModel<typeof stores>;

class AddressController {
  async store(req: Request, res: Response): Promise<Response> {
    const result = await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(req.params.store_id)))
      .limit(1);
    const store: Store | undefined = result[0];

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const { street, number, complement, state, city, zipcode } = req.body as {
      street: string;
      number: string;
      complement?: string;
      state: string;
      city: string;
      zipcode: string;
    };
    const [address] = await db
      .insert(addresses)
      .values({
        street,
        number,
        complement,
        state,
        city,
        zipcode,
      })
      .returning();

    if (!address) {
      return res.status(400).json({ error: 'Error on Save' });
    }

    await db
      .update(stores)
      .set({ address_id: address.id })
      .where(eq(stores.id, Number(req.params.store_id)));

    return res.json(address);
  }
}

export default new AddressController();
