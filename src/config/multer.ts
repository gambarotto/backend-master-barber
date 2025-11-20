import multer, { Options } from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

const configAvatars: Options = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads', 'avatars'),
    filename: (_req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err, '');

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

const configImages: Options = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads', 'images'),
    filename: (_req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err, '');

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

const multerConfig = {
  configAvatars,
  configImages,
};

export default multerConfig;
