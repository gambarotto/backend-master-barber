import { Router } from 'express';
import multer from 'multer';

import authMiddlewareUser from './app/middlewares/AuthUser';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import AvatarController from './app/controllers/AvatarController';
import StoreController from './app/controllers/StoreController';
import AddressController from './app/controllers/AddressController';
import ImageController from './app/controllers/ImageController';
import EmployeeController from './app/controllers/EmployeeController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import AvailableController from './app/controllers/AvailableController';

import multerConfig from './config/multer';

const routes = new Router();
const uploadAvatar = multer(multerConfig.configAvatars);
const uploadImage = multer(multerConfig.configImages);

routes.post('/sessions', SessionController.store);

routes.post('/stores/:store_id/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.get(
  '/stores/:store_id/appointments',
  AppointmentController.indexDayOrEmployee
);
routes.delete('/appointments/:id', AppointmentController.delete);
routes.get('/employee/3/availables', AvailableController.index);

/** Shaver routes */
routes.post('/users', UserController.store);

routes.use(authMiddlewareUser);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);
routes.post(
  '/users/:user_id/avatars',
  uploadAvatar.single('avatar'),
  AvatarController.store
);

routes.post('/users/:user_id/stores', StoreController.store);
routes.put('/stores/:user_id', StoreController.update);

routes.post('/stores/:store_id/addresses', AddressController.store);
routes.delete('/stores/:store_id', StoreController.delete);

routes.post(
  '/stores/:store_id/images',
  uploadImage.single('images'),
  ImageController.store
);
/* Employee routes */
routes.get('/employees', EmployeeController.index);
routes.post('/stores/:store_id/employees', EmployeeController.store);
routes.put('/employees/:employee_id', EmployeeController.update);
routes.delete('/employees/:employee_id', EmployeeController.delete);
/* Schedule routes */
routes.post('/schedules', ScheduleController.store);
routes.put('/schedules/:schedule_id', ScheduleController.update);
export default routes;
