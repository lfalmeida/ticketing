import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ITicketUpdatedEvent } from '@blackcoffee/common';

import { TicketUpdatedListener } from '../ticketUpdatedListener';
import { natsWrapper } from '../../../nats';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 40,
    title: 'My Concert'
  });
  await ticket.save();
  // create a fake data object
  const data: ITicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'New Concert',
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString()
  };
  // creeate a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  //return all of this stuff
  return { listener, msg, data, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, msg, data, ticket } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('it acks the message', async () => {
  const { listener, msg, data } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, msg, data } = await setup();
  // tamper the version to a far on future
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (error) { }

  expect(msg.ack).not.toHaveBeenCalled()
});