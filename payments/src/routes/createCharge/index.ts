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
import { Payment } from '../../models/payment';
import { PaymentCreatedPublisher } from '../../events/publishers/paymentCreatedPublisher';
import { natsWrapper } from '../../nats';

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

    const charge = await stripe.charges.create({
      currency: 'brl',
      amount: order.price * 100,
      source: token
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.orderId
    });

    res.status(201).send({ id: payment.id });
  });

export { router as createChargeRouter }