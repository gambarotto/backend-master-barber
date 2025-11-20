import { Router } from 'express';

import SessionController from 'src/app/controllers/SessionController';

const sessionRoutes = Router();

sessionRoutes.post('/sessions', (req, res) =>
  SessionController.adminStore(req, res)
);

export { sessionRoutes };
