import express from 'express';
import { resolve } from 'path';
// import routes from './routes';
import routes from './routes/index';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/avatars',
      express.static(resolve(__dirname, '..', 'temp', 'uploads', 'avatars'))
    );
    this.server.use(
      '/images',
      express.static(resolve(__dirname, '..', 'temp', 'uploads', 'images'))
    );
  }

  routes() {
    this.server.use([...routes]);
  }
}

export default new App().server;
