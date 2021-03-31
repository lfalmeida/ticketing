import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@blackcoffee/common';
import validationRules from './validation';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  validationRules,
  validateRequest,
  async (req: Request, res: Response) => {

    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order.')
    }

    await stripe.charges.create({
      currency: 'brl',
      amount: order.price * 100,
      source: token
    });

    res.status(201).send({ success: true });
  });

export { router as createChargeRouter }