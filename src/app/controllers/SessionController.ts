import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { users, employees, custumers } from '../../database/schema';
import { checkPassword } from '../../utils/password';
import authConfig from '../../config/auth';

class SessionController {
  async adminStore(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!(await checkPassword(password, user.passwordHash))) {
      return res.status(400).json({ error: 'Password invalid' });
    }
    
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async employeeStore(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const [employee] = await db.select().from(employees).where(eq(employees.email, email)).limit(1);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    if (!(await checkPassword(password, employee.passwordHash))) {
      return res.status(400).json({ error: 'Password invalid' });
    }

    const { id, name } = employee;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async custumerStore(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const [custumer] = await db.select().from(custumers).where(eq(custumers.email, email)).limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    if (!(await checkPassword(password, custumer.passwordHash))) {
      return res.status(400).json({ error: 'Password invalid' });
    }
    
    const { id, name } = custumer;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
