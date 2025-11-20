import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { avatars, custumers } from '../../database/schema';

class AvatarUserController {
  async index(req: Request, res: Response): Promise<Response> {
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    if (!custumer.avatarId) {
      return res.json(null);
    }
    
    const [avatar] = await db
      .select()
      .from(avatars)
      .where(eq(avatars.id, custumer.avatarId))
      .limit(1);

    return res.json(avatar);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'File not provided' });
    }
    
    const { originalname: name, filename: path } = req.file;

    if (!custumer.avatarId) {
      return res.status(404).json({ error: 'Avatar not found' });
    }

    const [avatar] = await db
      .update(avatars)
      .set({ name, path })
      .where(eq(avatars.id, custumer.avatarId))
      .returning();
    
    return res.json(avatar);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'File not provided' });
    }
    
    const { originalname: name, filename: path } = req.file;

    const [file] = await db
      .insert(avatars)
      .values({ name, path })
      .returning();
    
    if (!file) {
      return res.status(400).json({ error: 'Error on Save' });
    }
    
    await db
      .update(custumers)
      .set({ avatarId: file.id })
      .where(eq(custumers.id, Number(req.params.custumer_id)));
    
    return res.json(file);
  }
}

export default new AvatarUserController();
