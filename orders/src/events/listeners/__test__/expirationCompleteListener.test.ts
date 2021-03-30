import { IExpirationCompleteEvent, OrderStatus } from '@blackcoffee/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats";
import { ExpirationCompleteListener } from "../expirationCompleteListener";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 89
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket
  });
  await order.save()

  const data: IExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { msg, data, order, ticket, listener };
};


it('updates the order status to cancelled', async () => {
  const { msg, data, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.orderId);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { msg, data, listener, order } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { msg, data, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled()
});