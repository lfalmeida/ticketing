import { BasePublisher, Subjects, ITicketCreatedEvent } from '@blackcoffee/common';

export class TicketCreatedPublisher extends BasePublisher<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}