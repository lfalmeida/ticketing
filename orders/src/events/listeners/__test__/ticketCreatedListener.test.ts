import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ITicketCreatedEvent } from '@blackcoffee/common';

import { TicketCreatedListener } from '../ticketCreatedListener';
import { natsWrapper } from '../../../nats';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an istance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: ITicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object  
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with data object + message objetc
  await listener.onMessage(data, msg);
  // assert to make sure a ticket is created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with data object + message objetc
  await listener.onMessage(data, msg);
  // assert to make sure ack funcition is called
  expect(msg.ack).toHaveBeenCalled();

});