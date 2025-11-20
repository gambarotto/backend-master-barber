import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

interface JwtPayload {
  id: number;
}

async function user(
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
    req.custumerId = decoded.id;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

export default user;

