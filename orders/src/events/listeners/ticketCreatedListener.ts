import { Message } from 'node-nats-streaming';
import { Subjects, BaseListener, ITicketCreatedEvent } from '@blackcoffee/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queueGroupName';

export class TicketCreatedListener extends BaseListener<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ITicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price
    });
    await ticket.save();
    msg.ack();
  }
}
