import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

import { db } from '../../config/database';
import { custumers, avatars } from '../../db/schemas';
import { hashPassword, checkPassword } from '../../utils/password';

type Custumer = InferSelectModel<typeof custumers>;

class CustumerController {
  async show(req: Request, res: Response): Promise<Response> {
    const result = await db
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
      .leftJoin(avatars, eq(custumers.avatar_id, avatars.id))
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    const custumer = result[0];

    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    return res.json(custumer);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const { email, name, password } = req.body as {
      email: string;
      name: string;
      password: string;
    };
    const result = await db
      .select()
      .from(custumers)
      .where(eq(custumers.email, email))
      .limit(1);
    const existingCustumer: Custumer | undefined = result[0];

    if (existingCustumer) {
      return res.status(404).json({ error: 'Email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const [newCustumer] = await db
      .insert(custumers)
      .values({
        name,
        email,
        password_hash: passwordHash,
      })
      .returning({
        id: custumers.id,
        name: custumers.name,
        email: custumers.email,
      });

    return res.json(newCustumer);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { email, oldPassword, name, password } = req.body as {
      email?: string;
      oldPassword?: string;
      name?: string;
      password?: string;
    };
    const result = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    const custumer: Custumer | undefined = result[0];

    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    if (email && email !== custumer.email) {
      const emailResult = await db
        .select()
        .from(custumers)
        .where(eq(custumers.email, email))
        .limit(1);
      const emailExists: Custumer | undefined = emailResult[0];
      if (emailExists) {
        return res.status(401).json({ error: 'Email already exists' });
      }
    }

    if (
      oldPassword &&
      !(await checkPassword(oldPassword, custumer.password_hash))
    ) {
      return res.status(400).json({ error: 'Passwords does not match' });
    }

    const updateData: {
      name?: string;
      email?: string;
      password_hash?: string;
    } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password_hash = await hashPassword(password);
    }

    const [updated] = await db
      .update(custumers)
      .set(updateData)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .returning({ name: custumers.name, email: custumers.email });

    return res.json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const result = await db
      .delete(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .returning();
    const deleted: Custumer | undefined = result[0];

    if (!deleted) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    return res.json({ success: 'Conta excluída com Sucesso!' });
  }
}

export default new CustumerController();
