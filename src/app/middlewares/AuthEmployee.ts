import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { employees } from '../../db/schema';
import authConfig from '../../config/auth';

interface JwtPayload {
  id: number;
}

async function employeeAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(400).json({ error: 'Token not provider' });
  }

  const [, token] = authHeaders.split(' ');

  try {
    const verifyAsync = promisify(jwt.verify) as unknown as (
      token: string,
      secret: string
    ) => Promise<JwtPayload>;
    const decoded = await verifyAsync(token, authConfig.secret);
    
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, decoded.id))
      .limit(1);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee Auth invalid' });
    }
    
    req.employeeId = employee.id;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

export default employeeAuth;
