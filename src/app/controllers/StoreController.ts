import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import {
  users,
  stores,
  addresses,
  schedules,
  images,
  ratingStores,
  services,
} from '../../db/schema';

class StoreController {
  async index(req: Request, res: Response): Promise<Response> {
    const storesList = await db.query.stores.findMany({
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
        schedule: {
          columns: {
            holiday: true,
            special: true,
            daysWeek: true,
          },
        },
        image: {
          columns: {
            id: true,
            path: true,
          },
        },
        services: {
          columns: {
            id: true,
            name: true,
            price: true,
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
    });

    // Transformar para o formato esperado (snake_case)
    const formattedStores = storesList.map((store) => ({
      ...store,
      facebook_url: store.facebookUrl,
      instagram_url: store.instagramUrl,
      address: store.address,
      schedule: store.schedule,
      image: store.image
        ? {
            ...store.image,
            url: `http://192.168.15.22:3333/images/${store.image.path}`,
          }
        : null,
      services: store.services,
      rating: store.rating,
    }));

    return res.json(formattedStores);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(req.params.user_id)))
      .limit(1);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const [storeExists] = await db
      .select()
      .from(stores)
      .where(eq(stores.cnpj, req.body.cnpj))
      .limit(1);
    
    if (storeExists) {
      return res.status(401).json({ error: 'CNPJ already exists' });
    }
    
    const [newStore] = await db
      .insert(stores)
      .values({
        name: req.body.name,
        email: req.body.email,
        cnpj: req.body.cnpj,
        tel: req.body.tel,
        facebookUrl: req.body.facebook_url,
        instagramUrl: req.body.instagram_url,
      })
      .returning();
    
    if (!newStore) {
      return res.status(400).json({ error: 'Error on Save' });
    }

    const [rating] = await db
      .insert(ratingStores)
      .values({
        qty: 0,
        rating: 0,
      })
      .returning();
    
    await db
      .update(stores)
      .set({ ratingId: rating.id })
      .where(eq(stores.id, newStore.id));
    
    await db
      .update(users)
      .set({ storeId: newStore.id })
      .where(eq(users.id, Number(req.params.user_id)));
    
    return res.json(newStore);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(req.params.user_id)))
      .limit(1);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const { cnpj } = req.body;
    if (cnpj !== store.cnpj) {
      const [cnpjExists] = await db
        .select()
        .from(stores)
        .where(eq(stores.cnpj, cnpj))
        .limit(1);
      if (cnpjExists) {
        return res.status(400).json({ error: 'CNPJ already exists' });
      }
    }
    
    const updateData: any = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.cnpj) updateData.cnpj = req.body.cnpj;
    if (req.body.tel) updateData.tel = req.body.tel;
    if (req.body.facebook_url) updateData.facebookUrl = req.body.facebook_url;
    if (req.body.instagram_url) updateData.instagramUrl = req.body.instagram_url;

    const [updated] = await db
      .update(stores)
      .set(updateData)
      .where(eq(stores.id, Number(req.params.user_id)))
      .returning();

    return res.json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const [deleted] = await db
      .delete(stores)
      .where(eq(stores.id, Number(req.params.store_id)))
      .returning();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Store not found' });
    }

    return res.json({ ok: 'ok' });
  }
}

export default new StoreController();
