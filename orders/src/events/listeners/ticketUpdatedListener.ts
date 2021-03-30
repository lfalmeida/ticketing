import { Message } from 'node-nats-streaming';
import { Subjects, BaseListener, ITicketUpdatedEvent, NotFoundError } from '@blackcoffee/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queueGroupName';

export class TicketUpdatedListener extends BaseListener<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ITicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}
