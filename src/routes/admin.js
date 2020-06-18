import { Router } from 'express';
import multer from 'multer';

import authMidUser from '../app/middlewares/AuthUser';

import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';
import AvatarController from '../app/controllers/AvatarController';
import StoreController from '../app/controllers/StoreController';
import AddressController from '../app/controllers/AddressController';
import ImageController from '../app/controllers/ImageController';
import EmployeeController from '../app/controllers/EmployeeController';
import AppointmentController from '../app/controllers/AppointmentController';
import ScheduleController from '../app/controllers/ScheduleController';
import multerConfig from '../config/multer';

const routes = new Router();
const uploadAvatar = multer(multerConfig.configAvatars);
const uploadImage = multer(multerConfig.configImages);

routes.post('/sessions', SessionController.adminStore);
routes.post('/users', UserController.store);

routes.post('/stores/:store_id/employees', EmployeeController.store);
routes.put('/stores/employees/:employee_id', EmployeeController.update);
routes.delete(
  '/stores/employees/:employee_id',
  authMidUser,
  EmployeeController.delete
);

routes.put('/users/:id', authMidUser, UserController.update);
routes.delete('/users/:id', authMidUser, UserController.delete);
routes.post(
  '/users/:user_id/avatars',
  authMidUser,
  uploadAvatar.single('avatar'),
  AvatarController.storeUsers
);
/* Stores routes */
routes.post('/users/:user_id/stores', authMidUser, StoreController.store);
routes.put('/stores/:user_id', authMidUser, StoreController.update);
routes.delete('/stores/:store_id', authMidUser, StoreController.delete);
routes.post(
  '/stores/:store_id/images',
  authMidUser,
  uploadImage.single('images'),
  ImageController.store
);
/* Address store routes */
routes.post(
  '/stores/:store_id/addresses',
  authMidUser,
  AddressController.store
);

/* Employee routes */
routes.get('/stores/employees', authMidUser, EmployeeController.index);

/* Schedule routes */
routes.post('/schedules', ScheduleController.store);
routes.put('/schedules/:schedule_id', authMidUser, ScheduleController.update);
/** Appointments routes */
routes.get(
  '/stores/:store_id/appointments',
  authMidUser,
  AppointmentController.indexDayOrEmployee
);
routes.get('/appointments', authMidUser, AppointmentController.index);

export default routes;
