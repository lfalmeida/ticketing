import { NotFoundError } from '@blackcoffee/common';
import express, { Request, Response } from 'express';

import TicketService from '../../services/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await TicketService.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  return res.status(200).send(ticket);
});

export { router as showTicketRouter };