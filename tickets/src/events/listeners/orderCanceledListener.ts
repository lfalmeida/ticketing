import { BaseListener, IOrderCancelledEvent, Subjects, } from '@blackcoffee/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticketUpdatePublisher';
import { queueGroupName } from './queueGroupName';

export class OrderCancelledListener extends BaseListener<IOrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCancelledEvent['data'], msg: Message) {
    // find ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket, throw an error
    if (!ticket) {
      throw new Error('ticket not found.');
    }
    // unmark the ticket as being reserved by setting its orderId to undefined
    ticket.set({ orderId: undefined });
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