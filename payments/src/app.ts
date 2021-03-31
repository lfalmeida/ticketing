import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler } from '@blackcoffee/common';
import loadRoutes from './routes/index';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  // secure: process.env.NODE_ENV !== 'test'
  secure: false
}));

loadRoutes(app);

app.use(errorHandler);

export { app }