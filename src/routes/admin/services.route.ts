import { Router } from 'express';
import ServiceController from 'src/app/controllers/ServiceController';
import authMidUser from '../../app/middlewares/AuthUser';

const servicesRoutes = Router();

servicesRoutes.get('/services', (req, res) =>
  ServiceController.index(req, res)
);

servicesRoutes.post('/services', authMidUser, (req, res) =>
  ServiceController.store(req, res)
);

servicesRoutes.put('/services/:service_id', authMidUser, (req, res) =>
  ServiceController.update(req, res)
);

servicesRoutes.delete('/services/:service_id', authMidUser, (req, res) =>
  ServiceController.delete(req, res)
);

export { servicesRoutes };
