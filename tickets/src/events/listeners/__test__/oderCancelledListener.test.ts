import { IOrderCancelledEvent } from '@blackcoffee/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats";
import { OrderCancelledListener } from "../orderCanceledListener";


const setup = async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const listener = new OrderCancelledListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: 'Fake Title',
    price: 50,
    userId: 'testeId',
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: IOrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { msg, data, ticket, orderId, listener };
};

it('updates the ticket, publishes an event and acks the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});