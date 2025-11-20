import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { users, stores } from '../../database/schema';
import { hashPassword, checkPassword } from '../../utils/password';

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const [existsEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existsEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const passwordHash = await hashPassword(req.body.password);
    const [newUser] = await db
      .insert(users)
      .values({
        name: req.body.name,
        email: req.body.email,
        passwordHash,
        provider: req.body.provider || false,
      })
      .returning({ id: users.id, name: users.name, email: users.email, provider: users.provider });

    return res.json(newUser);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { name, email, oldPassword } = req.body;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(req.params.id)))
      .limit(1);
    
    if (!user) {
      return res.status(404).json({ error: 'User does not exists' });
    }
    
    if (email !== user.email) {
      const [emailExists] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    
    if (oldPassword && !(await checkPassword(oldPassword, user.passwordHash))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    
    if (req.body.store_id) {
      const [storeExists] = await db
        .select()
        .from(stores)
        .where(eq(stores.id, req.body.store_id))
        .limit(1);
      if (!storeExists) {
        return res.status(404).json({ error: 'Store not found' });
      }
    }

    const updateData: any = { name, email };
    if (req.body.password) {
      updateData.passwordHash = await hashPassword(req.body.password);
    }
    if (req.body.store_id) {
      updateData.storeId = req.body.store_id;
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, Number(req.params.id)))
      .returning({ id: users.id, name: users.name, email: users.email });

    return res.json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, Number(req.params.id)))
      .returning();

    if (!deleted) {
      return res.status(400).json({ error: 'Error on delete' });
    }

    return res.json({ success: 'ok' });
  }
}

export default new UserController();
