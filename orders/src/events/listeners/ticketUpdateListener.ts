import { Message } from 'node-nats-streaming';
import { Subjects, BaseListener, ITicketUpdatedEvent, NotFoundError } from '@blackcoffee/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queueGroupName';

export class TicketUpdateListener extends BaseListener<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ITicketUpdatedEvent['data'], msg: Message) {
    const { title, price } = data;
    const ticket = await Ticket.findById(data.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
