import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  IOrderCancelledEvent,
  OrderStatus,
  Subjects
} from '@blackcoffee/common';
import { Order } from '../../models/order';
import { queueGroupname } from './queueGroupName';

export class OrderCancelledListener extends BaseListener<IOrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupname;

  async onMessage(data: IOrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent({ id: data.id, version: data.version });

    if (!order) {
      throw new Error('Order not found.');
    }

    order!.set({ status: OrderStatus.Cancelled });
    await order!.save();

    msg.ack();
  }
};