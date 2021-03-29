import express from 'express';
import 'express-async-errors';

import { NotFoundError } from '@blackcoffee/common';
import { createOrderRouter } from './createOrder';
import { showOrderRouter } from './showOrder';
import { listOrdersRouter } from './listOrders';
import { deleteOrderRouter } from './deleteOrder';

const supportedRoutes = [
  createOrderRouter,
  showOrderRouter,
  listOrdersRouter,
  deleteOrderRouter
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
