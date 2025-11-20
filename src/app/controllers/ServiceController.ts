import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

import { db } from '../../config/database';
import { services, users } from '../../db/schemas';

type User = InferSelectModel<typeof users>;
type Service = InferSelectModel<typeof services>;

class ServiceController {
  async index(req: Request, res: Response): Promise<Response> {
    const servicesList = await db
      .select({
        id: services.id,
        name: services.name,
        price: services.price,
      })
      .from(services)
      .where(eq(services.store_id, Number(req.query.store)));

    return res.json(servicesList);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    const user: User | undefined = result[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, price, store_id } = req.body as {
      name: string;
      price: string;
      store_id: number;
    };
    if (user.store_id !== store_id) {
      return res
        .status(404)
        .json({ error: 'you cannot create a different store service' });
    }

    const [newService] = await db
      .insert(services)
      .values({
        name,
        price,
        store_id,
      })
      .returning();

    return res.json(newService);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const serviceResult = await db
      .select()
      .from(services)
      .where(eq(services.id, Number(req.params.service_id)))
      .limit(1);
    const service: Service | undefined = serviceResult[0];

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    const user: User | undefined = userResult[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { store_id } = req.body as { store_id?: number };
    if (store_id && user.store_id !== store_id) {
      return res
        .status(404)
        .json({ error: 'you cannot add a different store service' });
    }

    const { name, price } = req.body as {
      name?: string;
      price?: string;
      store_id?: number;
    };
    const updateData: {
      name?: string;
      price?: string;
      store_id?: number;
    } = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (store_id) updateData.store_id = store_id;

    const [updated] = await db
      .update(services)
      .set(updateData)
      .where(eq(services.id, Number(req.params.service_id)))
      .returning();

    return res.json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const serviceResult = await db
      .select()
      .from(services)
      .where(eq(services.id, Number(req.params.service_id)))
      .limit(1);
    const service: Service | undefined = serviceResult[0];

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    const user: User | undefined = userResult[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { store_id } = req.body as { store_id?: number };
    if (store_id && user.store_id !== store_id) {
      return res
        .status(404)
        .json({ error: 'you cannot delete a different store service' });
    }

    await db
      .delete(services)
      .where(eq(services.id, Number(req.params.service_id)));

    return res.json({ success: 'Serviço excluído com Sucesso!' });
  }
}

export default new ServiceController();
