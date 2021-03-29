import { BasePublisher } from './basePublisher';
import { ITicketCreatedEvent } from './ticketCreatedEvent';
import { Subjects } from './subjects';

export class TicketCreatedPublisher extends BasePublisher<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}