import express, { Request, Response } from 'express';
import validationRules from './validation';
import TicketService from '../../services/ticket';
import {
  validateRequest,
  requireAuth,
  UserPayload
} from '@blackcoffee/common';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, validationRules, validateRequest, async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  const { title, price } = req.body;
  const currentUser = req.currentUser as UserPayload;
  const newData = { title, price };
  const updatedTicket = await TicketService.update(ticketId, newData, currentUser);

  return res.send(updatedTicket);
})

export { router as updateTicketRouter };