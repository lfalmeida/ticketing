import express from 'express';
import { json } from 'body-parser';

import { errorHandler } from './middleware/errorHandler';
import loadRoutes from './routes/index';

const app = express();
app.use(json());

loadRoutes(app);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000.');
});