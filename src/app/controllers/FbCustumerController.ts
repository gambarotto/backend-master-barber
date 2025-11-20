/* eslint-disable camelcase */
import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { custumers, fbCustumers } from '../../database/schema';

class FbCustumerController {
  async store(req: Request, res: Response): Promise<Response> {
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    const [fbCustumer] = await db
      .insert(fbCustumers)
      .values({
        idFacebook: req.body.id_facebook,
        token: req.body.token,
        avatarUrl: req.body.avatar_url,
      })
      .returning();

    const [updated] = await db
      .update(custumers)
      .set({
        name: req.body.name,
        email: req.body.email,
        idFb: Number(fbCustumer.idFacebook),
      })
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .returning({
        id: custumers.id,
        name: custumers.name,
        email: custumers.email,
        idFb: custumers.idFb,
      });

    return res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      id_fb: updated.idFb,
    });
  }
}

export default new FbCustumerController();
