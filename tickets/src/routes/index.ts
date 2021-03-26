import express from 'express';
import 'express-async-errors';

import { NotFoundError } from '@blackcoffee/common';
import { createTicketRouter } from './createTicket';

const supportedRoutes = [
  createTicketRouter
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
