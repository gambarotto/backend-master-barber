import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { services, users } from '../../database/schema';

class ServiceController {
  async index(req: Request, res: Response): Promise<Response> {
    const servicesList = await db
      .select({
        id: services.id,
        name: services.name,
        price: services.price,
      })
      .from(services)
      .where(eq(services.storeId, Number(req.query.store)));
    
    return res.json(servicesList);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.storeId !== req.body.store_id) {
      return res
        .status(404)
        .json({ error: 'you cannot create a different store service' });
    }
    
    const [newService] = await db
      .insert(services)
      .values({
        name: req.body.name,
        price: req.body.price,
        storeId: req.body.store_id,
      })
      .returning();
    
    return res.json(newService);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, Number(req.params.service_id)))
      .limit(1);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.storeId !== req.body.store_id) {
      return res
        .status(404)
        .json({ error: 'you cannot add a different store service' });
    }
    
    const updateData: any = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.price) updateData.price = req.body.price;
    if (req.body.store_id) updateData.storeId = req.body.store_id;

    const [updated] = await db
      .update(services)
      .set(updateData)
      .where(eq(services.id, Number(req.params.service_id)))
      .returning();
    
    return res.json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, Number(req.params.service_id)))
      .limit(1);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.storeId !== req.body.store_id) {
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
