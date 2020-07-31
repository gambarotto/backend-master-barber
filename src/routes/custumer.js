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

const routes = new Router();

routes.post('/sessions/custumers', SessionController.custumerStore);

/** ---------------------- Custumer routes ----------------* */
routes.post('/custumers', CustumerController.store);
routes.put(
  '/custumers/:custumer_id',
  AuthMidCustumer,
  CustumerController.update
);
routes.get('/custumers/:custumer_id', AuthMidCustumer, CustumerController.show);
routes.delete(
  '/custumers/:custumer_id',
  AuthMidCustumer,
  CustumerController.delete
);

routes.get(
  '/stores/:store_id/employees',
  AuthMidCustumer,
  EmployeeController.indexByStore
);
routes.get(
  '/appointments/custumers/:custumer_id',
  AuthMidCustumer,
  AppointmentToolsController.indexByCustumer
);
routes.delete(
  '/appointments/:appointment_id/custumers/:custumer_id',
  AuthMidCustumer,
  AppointmentController.delete
);

routes.get('/stores', AuthMidCustumer, StoreController.index);
routes.post(
  '/stores/:store_id/appointments',
  AuthMidCustumer,
  AppointmentController.store
);
routes.get(
  '/employees/:employeeId/availables',
  AuthMidCustumer,
  AvailableController.index
);

routes.post('/custumers/:custumer_id/fbcustumers', FbCustumerController.store);
routes.post(
  '/custumers/:custumer_id/avatars',
  AuthMidCustumer,
  uploadAvatar.single('avatar'),
  AvatarCustumerController.store
);

routes.get(
  '/avaliation/stores/:store_id/custumer/:custumer_id',
  AuthMidCustumer,
  AvaliationController.show
);
routes.post('/avaliation', AuthMidCustumer, AvaliationController.store);
routes.put('/avaliation', AuthMidCustumer, AvaliationController.update);

routes.get(
  '/coupons/custumers/:custumer_id',
  AuthMidCustumer,
  CouponController.show
);
routes.post('/coupons', AuthMidCustumer, CouponController.store);
routes.put('/coupons/:coupon_id', AuthMidCustumer, CouponController.update);

routes.get(
  '/schedules/employees/:employee_id',
  AuthMidCustumer,
  ScheduleController.show
);

routes.get(
  '/favorites/custumers/:custumer_id',
  AuthMidCustumer,
  FavoriteController.show
);
routes.post('/favorities', AuthMidCustumer, FavoriteController.store);
routes.delete(
  '/favorities/:favorite_id',
  AuthMidCustumer,
  FavoriteController.delete
);
export default routes;
