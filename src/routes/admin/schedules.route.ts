import { Router } from 'express';

import ScheduleController from 'src/app/controllers/ScheduleController';
import authMidUser from '../../app/middlewares/AuthUser';

const scheduleRoutes = Router();

scheduleRoutes.post('/schedules', (req, res) =>
  ScheduleController.store(req, res)
);

scheduleRoutes.put('/schedules/:schedule_id', authMidUser, (req, res) =>
  ScheduleController.update(req, res)
);

export { scheduleRoutes };
