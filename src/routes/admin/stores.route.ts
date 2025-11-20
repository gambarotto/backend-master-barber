import { Router } from 'express';

import StoreController from 'src/app/controllers/StoreController';
import AddressController from 'src/app/controllers/AddressController';
import EmployeeController from 'src/app/controllers/EmployeeController';
import multer from 'multer';
import ImageController from 'src/app/controllers/ImageController';
import AppointmentController from 'src/app/controllers/AppointmentController';
import authMidUser from '../../app/middlewares/AuthUser';
import multerConfig from '../../config/multer';

const storesRoutes = Router();
const uploadImage = multer(multerConfig.configImages);

storesRoutes.get('/stores', authMidUser, (req, res) =>
  StoreController.index(req, res)
);

storesRoutes.get('/stores/employees', authMidUser, (req, res) =>
  EmployeeController.index(req, res)
);

storesRoutes.post('/stores/:store_id/employees', (req, res) =>
  EmployeeController.store(req, res)
);

storesRoutes.put('/stores/employees/:employee_id', (req, res) =>
  EmployeeController.update(req, res)
);

storesRoutes.delete('/stores/employees/:employee_id', authMidUser, (req, res) =>
  EmployeeController.delete(req, res)
);

storesRoutes.put('/stores/:user_id', authMidUser, (req, res) =>
  StoreController.update(req, res)
);

storesRoutes.get('/stores/:store_id/appointments', authMidUser, (req, res) =>
  AppointmentController.indexDayOrEmployee(req, res)
);

storesRoutes.delete('/stores/:store_id', authMidUser, (req, res) =>
  StoreController.delete(req, res)
);

storesRoutes.post(
  '/stores/:store_id/images',
  authMidUser,
  uploadImage.single('images'),
  (req, res) => ImageController.store(req, res)
);

/* Address store routes */
storesRoutes.post('/stores/:store_id/addresses', authMidUser, (req, res) =>
  AddressController.store(req, res)
);
export { storesRoutes };
