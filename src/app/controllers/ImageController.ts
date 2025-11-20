import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

import { db } from '../../config/database';
import { images, stores } from '../../db/schemas';

type Store = InferSelectModel<typeof stores>;
type Image = InferSelectModel<typeof images>;

class ImageController {
  async store(req: Request, res: Response): Promise<Response> {
    const result = await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(req.params.store_id)))
      .limit(1);
    const store: Store | undefined = result[0];

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File not provided' });
    }

    const { originalname: name, filename: path } = req.file;

    const [file] = await db.insert(images).values({ name, path }).returning();

    if (!file) {
      return res.status(400).json({ error: 'Error on Save' });
    }

    await db
      .update(stores)
      .set({ image_id: file.id })
      .where(eq(stores.id, Number(req.params.store_id)));

    return res.json(file);
  }
}

export default new ImageController();
