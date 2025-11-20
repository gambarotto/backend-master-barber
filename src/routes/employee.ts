import { Router } from 'express';
import multer from 'multer';

import authMidEmployee from '../app/middlewares/AuthEmployee';

import SessionController from '../app/controllers/SessionController';
import AvatarController from '../app/controllers/AvatarController';
import AppointmentController from '../app/controllers/AppointmentController';
import OwnEmployee from '../app/controllers/OwnEmployeeController';
import multerConfig from '../config/multer';

const uploadAvatar = multer(multerConfig.configAvatars);

const routes = Router();

routes.post('/sessions/employees', (req, res) =>
  SessionController.employeeStore(req, res)
);

routes.delete('/appointments/:id', (req, res) =>
  AppointmentController.delete(req, res)
);

routes.get('/employees', authMidEmployee, (req, res) =>
  OwnEmployee.index(req, res)
);
routes.delete('/employees', authMidEmployee, (req, res) =>
  OwnEmployee.delete(req, res)
);
routes.put('/employees', authMidEmployee, (req, res) =>
  OwnEmployee.update(req, res)
);
routes.post(
  '/employees/:employee_id/avatars',
  uploadAvatar.single('avatar'),
  (req, res) => AvatarController.storeEmployees(req, res)
);
routes.get('/employees/appointments', authMidEmployee, (req, res) =>
  OwnEmployee.listAppointments(req, res)
);
routes.delete(
  '/employees/appointments/:appointments_id',
  authMidEmployee,
  (req, res) => OwnEmployee.deleteAppointments(req, res)
);

routes.put(
  '/employees/appointments/:appointments_id/validations',
  authMidEmployee,
  (req, res) => OwnEmployee.validationAppointiment(req, res)
);
export default routes;
