import express, { Request, Response } from 'express';
import validationRules from './validation';
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@blackcoffee/common';
import { OrderService } from '../../services/orders';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  validationRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await OrderService.findOrderById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  });

export { router as showOrderRouter };
