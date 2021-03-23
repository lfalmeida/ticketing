import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler } from './middleware/errorHandler';
import loadRoutes from './routes/index';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({ signed: false, secure: true }));

loadRoutes(app);

app.use(errorHandler);

export { app }