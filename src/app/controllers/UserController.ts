import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

import { db } from '../../config/database';
import { users, stores } from '../../db/schemas';
import { hashPassword, checkPassword } from '../../utils/password';

type User = InferSelectModel<typeof users>;

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    const { email } = req.body as { email: string };
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const existsEmail: User | undefined = result[0];

    if (existsEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const { name, password, provider } = req.body as {
      name: string;
      password: string;
      provider?: boolean;
    };
    const passwordHash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password_hash: passwordHash,
        provider: provider ?? false,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        provider: users.provider,
      });

    return res.json(newUser);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { name, email, oldPassword, password, store_id } = req.body as {
      name?: string;
      email?: string;
      oldPassword?: string;
      password?: string;
      store_id?: number;
    };
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(req.params.id)))
      .limit(1);
    const user: User | undefined = result[0];

    if (!user) {
      return res.status(404).json({ error: 'User does not exists' });
    }

    if (email && email !== user.email) {
      const emailResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      const emailExists: User | undefined = emailResult[0];
      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    if (
      oldPassword &&
      !(await checkPassword(oldPassword, user.password_hash))
    ) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    if (store_id) {
      const storeResult = await db
        .select()
        .from(stores)
        .where(eq(stores.id, store_id))
        .limit(1);
      const storeExists = storeResult[0];
      if (!storeExists) {
        return res.status(404).json({ error: 'Store not found' });
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      password_hash?: string;
      store_id?: number;
    } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password_hash = await hashPassword(password);
    }
    if (store_id) {
      updateData.store_id = store_id;
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
