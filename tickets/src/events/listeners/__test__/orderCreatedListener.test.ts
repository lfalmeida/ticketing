import mongoose from 'mongoose';
import { OrderCreatedListener } from '../orderCreatedListener';
import { natsWrapper } from '../../../nats/';
import { Ticket } from '../../../models/ticket';
import { IOrderCreatedEvent, OrderStatus } from '@blackcoffee/common';
import { Message } from 'node-nats-streaming';


const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    title: 'Concert',
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  // create the fake data event
  const data: IOrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'fsdfsd',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg };
}

it('sets the user id of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  try {
    await listener.onMessage(data, msg);
  } catch (error) { }
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});