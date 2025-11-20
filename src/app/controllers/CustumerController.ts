import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { custumers, avatars } from '../../database/schema';
import { hashPassword, checkPassword } from '../../utils/password';

class CustumerController {
  async show(req: Request, res: Response): Promise<Response> {
    const [custumer] = await db
      .select({
        id: custumers.id,
        name: custumers.name,
        email: custumers.email,
        avatar: {
          id: avatars.id,
          name: avatars.name,
          path: avatars.path,
        },
      })
      .from(custumers)
      .leftJoin(avatars, eq(custumers.avatarId, avatars.id))
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    return res.json(custumer);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const [existingCustumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.email, email))
      .limit(1);
    
    if (existingCustumer) {
      return res.status(404).json({ error: 'Email already exists' });
    }

    const passwordHash = await hashPassword(req.body.password);
    const [newCustumer] = await db
      .insert(custumers)
      .values({
        name: req.body.name,
        email: req.body.email,
        passwordHash,
      })
      .returning({ id: custumers.id, name: custumers.name, email: custumers.email });

    return res.json(newCustumer);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { email, oldPassword } = req.body;
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    if (email !== custumer.email) {
      const [emailExists] = await db
        .select()
        .from(custumers)
        .where(eq(custumers.email, email))
        .limit(1);
      if (emailExists) {
        return res.status(401).json({ error: 'Email already exists' });
      }
    }
    
    if (oldPassword && !(await checkPassword(oldPassword, custumer.passwordHash))) {
      return res.status(400).json({ error: 'Passwords does not match' });
    }
    
    const updateData: any = { name: req.body.name, email };
    if (req.body.password) {
      updateData.passwordHash = await hashPassword(req.body.password);
    }

    const [updated] = await db
      .update(custumers)
      .set(updateData)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .returning({ name: custumers.name, email: custumers.email });

    return res.json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const [deleted] = await db
      .delete(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .returning();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    return res.json({ success: 'Conta excluída com Sucesso!' });
  }
}

export default new CustumerController();
