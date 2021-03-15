import express from 'express';
import { json } from 'body-parser';
import loadRoutes from './routes/index';

const app = express();
app.use(json());
loadRoutes(app);

app.listen(3000, () => {
  console.log('Listening on port 3000.');
});