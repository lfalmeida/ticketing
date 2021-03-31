import express, { Request, Response } from 'express';
import TicketService from '../../services/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await TicketService.getAllAvailable();
  return res.send(tickets);
});

export { router as listTicketsRouter };