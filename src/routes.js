import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import AvatarController from './app/controllers/AvatarController';
import StoreController from './app/controllers/StoreController';
import AddressController from './app/controllers/AddressController';
import ImageController from './app/controllers/ImageController';

import multerConfig from './config/multer';

const routes = new Router();
const uploadAvatar = multer(multerConfig.configAvatars);
const uploadImage = multer(multerConfig.configImages);

/** Shaver routes */
routes.post('/users', UserController.store);
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

export default routes;
