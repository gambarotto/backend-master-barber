import { Router } from 'express';
import multer from 'multer';

import AuthMidCustumer from '../app/middlewares/AuthCustumer';

import SessionController from '../app/controllers/SessionController';
import StoreController from '../app/controllers/StoreController';
import AppointmentController from '../app/controllers/AppointmentController';
import AvailableController from '../app/controllers/AvailableController';
import CustumerController from '../app/controllers/CustumerController';
import FbCustumerController from '../app/controllers/FbCustumerController';
import AvatarCustumerController from '../app/controllers/AvatarCustumerController';
import AvaliationController from '../app/controllers/AvaliationController';
import CouponController from '../app/controllers/CouponController';
import AppointmentToolsController from '../app/controllers/AppointmentToolsController';
import EmployeeController from '../app/controllers/EmployeeController';
import ScheduleController from '../app/controllers/ScheduleController';
import FavoriteController from '../app/controllers/FavoriteController';
import multerConfig from '../config/multer';

const uploadAvatar = multer(multerConfig.configAvatars);

const routes = Router();

routes.post('/sessions/custumers', (req, res) =>
  SessionController.custumerStore(req, res)
);

/** ---------------------- Custumer routes ----------------* */
routes.post('/custumers', (req, res) => CustumerController.store(req, res));
routes.put('/custumers/:custumer_id', AuthMidCustumer, (req, res) =>
  CustumerController.update(req, res)
);
routes.get('/custumers/:custumer_id', AuthMidCustumer, (req, res) =>
  CustumerController.show(req, res)
);
routes.delete('/custumers/:custumer_id', AuthMidCustumer, (req, res) =>
  CustumerController.delete(req, res)
);

routes.get('/stores/:store_id/employees', AuthMidCustumer, (req, res) =>
  EmployeeController.indexByStore(req, res)
);
routes.get(
  '/appointments/custumers/:custumer_id',
  AuthMidCustumer,
  (req, res) => AppointmentToolsController.indexByCustumer(req, res)
);
routes.delete(
  '/appointments/:appointment_id/custumers/:custumer_id',
  AuthMidCustumer,
  (req, res) => AppointmentController.delete(req, res)
);

routes.get('/stores', AuthMidCustumer, (req, res) =>
  StoreController.index(req, res)
);
routes.post('/stores/:store_id/appointments', AuthMidCustumer, (req, res) =>
  AppointmentController.store(req, res)
);
routes.get('/employees/:employeeId/availables', AuthMidCustumer, (req, res) =>
  AvailableController.index(req, res)
);

routes.post('/custumers/:custumer_id/fbcustumers', (req, res) =>
  FbCustumerController.store(req, res)
);
routes.post(
  '/custumers/:custumer_id/avatars',
  AuthMidCustumer,
  uploadAvatar.single('avatar'),
  (req, res) => AvatarCustumerController.store(req, res)
);

routes.get(
  '/avaliation/stores/:store_id/custumer/:custumer_id',
  AuthMidCustumer,
  (req, res) => AvaliationController.show(req, res)
);
routes.post('/avaliation', AuthMidCustumer, (req, res) =>
  AvaliationController.store(req, res)
);
routes.put('/avaliation', AuthMidCustumer, (req, res) =>
  AvaliationController.update(req, res)
);

routes.get('/coupons/custumers/:custumer_id', AuthMidCustumer, (req, res) =>
  CouponController.show(req, res)
);
routes.post('/coupons', AuthMidCustumer, (req, res) =>
  CouponController.store(req, res)
);
routes.put('/coupons/:coupon_id', AuthMidCustumer, (req, res) =>
  CouponController.update(req, res)
);

routes.get('/schedules/employees/:employee_id', AuthMidCustumer, (req, res) =>
  ScheduleController.show(req, res)
);

routes.get('/favorites/custumers/:custumer_id', AuthMidCustumer, (req, res) =>
  FavoriteController.show(req, res)
);
routes.post('/favorities', AuthMidCustumer, (req, res) =>
  FavoriteController.store(req, res)
);
routes.delete('/favorities/:favorite_id', AuthMidCustumer, (req, res) =>
  FavoriteController.delete(req, res)
);
export default routes;
