import { Router } from 'express';
import AppointmentController from 'src/app/controllers/AppointmentController';
import authMidUser from '../../app/middlewares/AuthUser';

const appointmentRoutes = Router();

appointmentRoutes.get('/appointments', authMidUser, (req, res) =>
  AppointmentController.index(req, res)
);

export { appointmentRoutes };
