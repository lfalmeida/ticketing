import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@blackcoffee/common';
import express, { Request, Response } from 'express';
import { OrderService } from '../../services/orders';
import validationRules from './validation';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  validationRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const currentUserId = req.currentUser!.id;
    const orderCanceled = await OrderService.cancelOrder(orderId, currentUserId);
    const status = orderCanceled ? 204 : 400;
    res.sendStatus(status);
  });

export { router as deleteOrderRouter };