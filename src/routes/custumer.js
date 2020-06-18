import { Router } from 'express';

import AppointmentController from '../app/controllers/AppointmentController';
import AvailableController from '../app/controllers/AvailableController';
import CustumerController from '../app/controllers/CustumerController';
import FbCustumerController from '../app/controllers/FbCustumerController';

const routes = new Router();

/** ---------------------- Custumer routes ----------------* */
routes.post('/stores/:store_id/appointments', AppointmentController.store);
routes.get('/employees/:employeeId/availables', AvailableController.index);
routes.post('/custumers', CustumerController.store);
routes.post(
  '/custumers/:custumer_id/avatars_custumers',
  FbCustumerController.store
);

export default routes;
