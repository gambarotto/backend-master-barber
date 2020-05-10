import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  configAvatars: {
    storage: multer.diskStorage({
      destination: resolve(__dirname, '..', '..', 'temp', 'uploads', 'avatars'),
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, res) => {
          if (err) return cb(err);

          return cb(null, res.toString('hex') + extname(file.originalname));
        });
      },
    }),
  },
  configImages: {
    storage: multer.diskStorage({
      destination: resolve(__dirname, '..', '..', 'temp', 'uploads', 'images'),
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, res) => {
          if (err) return cb(err);

          return cb(null, res.toString('hex') + extname(file.originalname));
        });
      },
    }),
  },
};
