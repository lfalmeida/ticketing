import express, { Request, Response } from 'express';
import validationRules from './validation';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@blackcoffee/common';
import { OrderService } from '../../services/orders';
import { Order } from '../../models/order';

const router = express.Router();

router.post('/api/orders', requireAuth, validationRules, validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  const userId = req.currentUser!.id;
  const orderCreated = await OrderService.create(ticketId, userId);
  res.status(201).send(orderCreated);
});

export { router as createOrderRouter };