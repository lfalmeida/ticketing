import { requireAuth } from '@blackcoffee/common';
import express, { Request, Response } from 'express';
import { OrderService } from '../../services/orders';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const orders = await OrderService.getOrdersFromUserId(userId);
  res.send(orders);
});

export { router as listOrdersRouter };