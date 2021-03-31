import mongoose from 'mongoose';
import { IOrderCancelledEvent, OrderStatus } from '@blackcoffee/common';
import { Message } from 'node-nats-streaming';
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats";
import { OrderCancelledListener } from "../orderCancelledListener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    version: 0,
    userId: 'validuserid',
  });
  await order.save();

  const data: IOrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'validticketid',
    }
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  return { listener, order, data, msg };
};

it('updates the status of the order', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});