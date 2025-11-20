import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { images, stores } from '../../database/schema';

class ImageController {
  async store(req: Request, res: Response): Promise<Response> {
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(req.params.store_id)))
      .limit(1);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'File not provided' });
    }
    
    const { originalname: name, filename: path } = req.file;

    const [file] = await db
      .insert(images)
      .values({ name, path })
      .returning();
    
    if (!file) {
      return res.status(400).json({ error: 'Error on Save' });
    }
    
    await db
      .update(stores)
      .set({ imageId: file.id })
      .where(eq(stores.id, Number(req.params.store_id)));
    
    return res.json(file);
  }
}

export default new ImageController();
