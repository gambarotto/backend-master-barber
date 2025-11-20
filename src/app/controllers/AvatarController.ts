import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

import { db } from '../../config/database';
import { avatars, users, employees } from '../../db/schemas';

type User = InferSelectModel<typeof users>;
type Employee = InferSelectModel<typeof employees>;
type Avatar = InferSelectModel<typeof avatars>;

class AvatarController {
  async storeUsers(req: Request, res: Response): Promise<Response> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(req.params.user_id)))
      .limit(1);
    const user: User | undefined = result[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File not provided' });
    }

    const { originalname: name, filename: path } = req.file;

    const [file] = await db.insert(avatars).values({ name, path }).returning();

    if (!file) {
      return res.status(400).json({ error: 'Error on Save' });
    }

    await db
      .update(users)
      .set({ avatar_id: file.id })
      .where(eq(users.id, Number(req.params.user_id)));

    return res.json(file);
  }

  async storeEmployees(req: Request, res: Response): Promise<Response> {
    if (!req.file) {
      return res.status(400).json({ error: 'File not provided' });
    }

    const { originalname: name, filename: path } = req.file;

    try {
      const result = await db
        .select()
        .from(employees)
        .where(eq(employees.id, Number(req.params.employee_id)))
        .limit(1);
      const employee: Employee | undefined = result[0];

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const [file] = await db.insert(avatars).values({ name, path }).returning();

      await db
        .update(employees)
        .set({ avatar_id: file.id })
        .where(eq(employees.id, Number(req.params.employee_id)));

      return res.json(file);
    } catch (error) {
      return res.status(400).json({ error: 'Error on Save, please try again' });
    }
  }
}

export default new AvatarController();
