import express from 'express';
import 'express-async-errors';
import { NotFoundError } from '@blackcoffee/common';

import { createChargeRouter } from './createCharge';

const supportedRoutes = [
  createChargeRouter
];

const loadRoutes = (app: express.Application) => {
  supportedRoutes.map(route => {
    app.use(route);
  });

  app.all('*', async () => {
    throw new NotFoundError();
  })
};

export default loadRoutes;
