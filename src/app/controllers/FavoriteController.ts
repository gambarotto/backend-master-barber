import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';

import db from '../../config/database';
import {
  favorites,
  custumers,
  stores,
  employees,
  services,
  images,
  avatars,
  addresses,
  ratingStores,
  schedules,
} from '../../database/schema';

class FavoriteController {
  async show(req: Request, res: Response): Promise<Response> {
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    const favoritesList = await db.query.favorites.findMany({
      where: and(
        eq(favorites.custumerId, custumer.id),
        eq(favorites.favorite, true)
      ),
      columns: {
        id: true,
        favorite: true,
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
            schedule: {
              columns: {
                holiday: true,
                special: true,
                daysWeek: true,
              },
            },
            employees: {
              columns: {
                id: true,
                name: true,
                email: true,
                responsibility: true,
                scheduleId: true,
              },
              with: {
                avatar: {
                  columns: {
                    id: true,
                    path: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Transformar para o formato esperado
    const formatted = favoritesList.map((fav) => ({
      ...fav,
      store: fav.store
        ? {
            ...fav.store,
            facebook_url: fav.store.facebookUrl,
            instagram_url: fav.store.instagramUrl,
            image: fav.store.image
              ? {
                  ...fav.store.image,
                  url: `http://192.168.15.22:3333/images/${fav.store.image.path}`,
                }
              : null,
            days_week: fav.store.schedule?.daysWeek,
            employees: fav.store.employees?.map((emp) => ({
              ...emp,
              schedule_id: emp.scheduleId,
              avatar: emp.avatar
                ? {
                    ...emp.avatar,
                    url: `http://192.168.15.22:3333/avatars/${emp.avatar.path}`,
                  }
                : null,
            })),
          }
        : null,
    }));

    return res.json(formatted);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, req.body.store_id))
      .limit(1);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, req.body.custumer_id))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    const [favorite] = await db
      .insert(favorites)
      .values({
        favorite: req.body.favorite ?? true,
        storeId: req.body.store_id,
        custumerId: req.body.custumer_id,
      })
      .returning();
    
    return res.json(favorite);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(eq(favorites.id, Number(req.params.favorite_id)))
      .limit(1);
    
    if (!favorite) {
      return res.status(404).json({ error: 'favorite not found' });
    }
    
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.query.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    if (custumer.id !== favorite.custumerId) {
      return res.status(400).json({ error: 'You do not permission for this' });
    }

    await db
      .delete(favorites)
      .where(eq(favorites.id, Number(req.params.favorite_id)));
    
    return res.json({ success: 'ok' });
  }
}

export default new FavoriteController();
