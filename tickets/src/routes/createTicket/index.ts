import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@blackcoffee/common';
import validationRules from './validation';
import TicketService from '../../services/ticket';

const router = express.Router();

router.post('/api/tickets', requireAuth, validationRules, validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const userId = req.currentUser!.id;

  const ticket = await TicketService.create({
    title,
    price,
    userId
  });

  return res.status(201).send(ticket);
});

export { router as createTicketRouter };

