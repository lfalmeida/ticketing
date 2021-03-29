import express, { Request, Response } from 'express';
import validationRules from './validation';
import { requireAuth, validateRequest } from '@blackcoffee/common';
import { OrderService } from '../../services/orders';

const router = express.Router();

router.post('/api/orders', requireAuth, validationRules, validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  const userId = req.currentUser!.id;
  const orderCreated = await OrderService.create(ticketId, userId);
  res.status(201).send(orderCreated);
});

export { router as createOrderRouter };