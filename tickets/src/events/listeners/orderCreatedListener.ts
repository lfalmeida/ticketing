import { BaseListener, IOrderCreatedEvent, Subjects, } from '@blackcoffee/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticketUpdatePublisher';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends BaseListener<IOrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    // find ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket, throw an error
    if (!ticket) {
      throw new Error('ticket not found.');
    }
    // mark the ticket as being reserved by setting its orderId Property
    ticket.set({ orderId: data.id });
    await ticket.save();
    // publish an event binding the order id to the ticket
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });

    msg.ack();
  }
}