import express, { Express } from 'express';
import { resolve } from 'path';
import cors from 'cors';
import routes from './routes/index';
import './config/database'; // Initialize database connection

class App {
  server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.cors();
  }

  middlewares(): void {
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

  routes(): void {
    this.server.use([...routes]);
  }

  cors(): void {
    this.server.use(cors());
  }
}

export default new App().server;

