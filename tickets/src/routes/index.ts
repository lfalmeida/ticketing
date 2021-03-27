import express from 'express';
import 'express-async-errors';

import { NotFoundError } from '@blackcoffee/common';
import { createTicketRouter } from './createTicket';
import { showTicketRouter } from './showTicket';
import { listTicketsRouter } from './listTickets';

const supportedRoutes = [
  createTicketRouter,
  showTicketRouter,
  listTicketsRouter
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
