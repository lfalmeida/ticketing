import { Message } from 'node-nats-streaming';
import { BaseListener } from './baseListener';
import { ITicketCreatedEvent } from './ticketCreatedEvent';
import { Subjects } from './subjects';

export class TicketCreatedListerner extends BaseListener<ITicketCreatedEvent> {

  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: ITicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data!', data);
    console.log(data.id);
    console.log(data.price);
    console.log(data.title);
    msg.ack();
  }

}