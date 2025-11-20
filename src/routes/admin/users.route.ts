import { Router } from 'express';
import UserController from 'src/app/controllers/UserController';
import multer from 'multer';
import AvatarController from 'src/app/controllers/AvatarController';
import StoreController from 'src/app/controllers/StoreController';
import authMidUser from '../../app/middlewares/AuthUser';
import multerConfig from '../../config/multer';

const usersRoutes = Router();
const uploadAvatar = multer(multerConfig.configAvatars);

usersRoutes.post('/users', (req, res) => UserController.store(req, res));

usersRoutes.put('/users/:id', authMidUser, (req, res) =>
  UserController.update(req, res)
);

usersRoutes.delete('/users/:id', authMidUser, (req, res) =>
  UserController.delete(req, res)
);

usersRoutes.post('/users/:user_id/stores', authMidUser, (req, res) =>
  StoreController.store(req, res)
);

usersRoutes.post(
  '/users/:user_id/avatars',
  authMidUser,
  uploadAvatar.single('avatar'),
  (req, res) => AvatarController.storeUsers(req, res)
);

export { usersRoutes };
