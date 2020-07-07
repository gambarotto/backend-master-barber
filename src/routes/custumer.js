import { Router } from 'express';
import multer from 'multer';

import StoreController from '../app/controllers/StoreController';
import AppointmentController from '../app/controllers/AppointmentController';
import AvailableController from '../app/controllers/AvailableController';
import CustumerController from '../app/controllers/CustumerController';
import FbCustumerController from '../app/controllers/FbCustumerController';
import AvatarCustumerController from '../app/controllers/AvatarCustumerController';
import AvaliationController from '../app/controllers/AvaliationController';
import multerConfig from '../config/multer';

const uploadAvatar = multer(multerConfig.configAvatars);

const routes = new Router();

/** ---------------------- Custumer routes ----------------* */
routes.post('/custumers', CustumerController.store);
routes.put('/custumers/:custumer_id', CustumerController.update);
routes.get('/custumers/:custumer_id', CustumerController.show);
routes.delete('/custumers/:custumer_id', CustumerController.delete);

routes.get('/stores', StoreController.index);
routes.post('/stores/:store_id/appointments', AppointmentController.store);
routes.get('/employees/:employeeId/availables', AvailableController.index);

routes.post('/custumers/:custumer_id/fbcustumers', FbCustumerController.store);
routes.post(
  '/custumers/:custumer_id/avatars',
  uploadAvatar.single('avatar'),
  AvatarCustumerController.store
);

routes.post('/avaliation', AvaliationController.store);
routes.put('/avaliation', AvaliationController.update);

export default routes;
