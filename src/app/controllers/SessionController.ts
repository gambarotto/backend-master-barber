import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

import { db } from '../../config/database';
import { users, employees, custumers } from '../../db/schemas';
import { checkPassword } from '../../utils/password';
import authConfig from '../../config/auth';

type User = InferSelectModel<typeof users>;
type Employee = InferSelectModel<typeof employees>;
type Custumer = InferSelectModel<typeof custumers>;

class SessionController {
  async adminStore(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as { email: string; password: string };
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user: User | undefined = result[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!(await checkPassword(password, user.password_hash))) {
      return res.status(400).json({ error: 'Password invalid' });
    }

    const { id, name } = user;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }

  async employeeStore(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as { email: string; password: string };
    const result = await db
      .select()
      .from(employees)
      .where(eq(employees.email, email))
      .limit(1);
    const employee: Employee | undefined = result[0];

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (!(await checkPassword(password, employee.password_hash))) {
      return res.status(400).json({ error: 'Password invalid' });
    }

    const { id, name } = employee;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }

  async custumerStore(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as { email: string; password: string };
    const result = await db
      .select()
      .from(custumers)
      .where(eq(custumers.email, email))
      .limit(1);
    const custumer: Custumer | undefined = result[0];

    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    if (!(await checkPassword(password, custumer.password_hash))) {
      return res.status(400).json({ error: 'Password invalid' });
    }

    const { id, name } = custumer;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }
}

export default new SessionController();
