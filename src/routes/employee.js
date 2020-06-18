import { Router } from 'express';
import multer from 'multer';

import authMidEmployee from '../app/middlewares/AuthEmployee';

import Session from '../app/controllers/SessionController';
import AvatarController from '../app/controllers/AvatarController';
import AppointmentController from '../app/controllers/AppointmentController';
import OwnEmployee from '../app/controllers/OwnEmployeeController';
import multerConfig from '../config/multer';

const uploadAvatar = multer(multerConfig.configAvatars);

const routes = new Router();

routes.post('/sessions/employees', Session.employeeStore);

routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/employees', authMidEmployee, OwnEmployee.index);
routes.delete('/employees', authMidEmployee, OwnEmployee.delete);
routes.put('/employees', authMidEmployee, OwnEmployee.update);
routes.post(
  '/employees/:employee_id/avatars',
  uploadAvatar.single('avatar'),
  AvatarController.storeEmployees
);
routes.get(
  '/employees/appointments',
  authMidEmployee,
  OwnEmployee.listAppointments
);
routes.delete(
  '/employees/appointments/:appointments_id',
  authMidEmployee,
  OwnEmployee.deleteAppointments
);

routes.put(
  '/employees/appointments/:appointments_id/validations',
  authMidEmployee,
  OwnEmployee.validationAppointiment
);
export default routes;
