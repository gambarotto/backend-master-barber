import { sessionRoutes } from './sessions.route';
import { appointmentRoutes } from './appointments.route';
import { scheduleRoutes } from './schedules.route';
import { servicesRoutes } from './services.route';
import { storesRoutes } from './stores.route';
import { usersRoutes } from './users.route';

const adminRoutes = [
  sessionRoutes,
  appointmentRoutes,
  scheduleRoutes,
  servicesRoutes,
  storesRoutes,
  usersRoutes,
];

export { adminRoutes };
