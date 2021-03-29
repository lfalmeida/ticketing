import { BasePublisher, Subjects, ITicketUpdatedEvent } from '@blackcoffee/common';

export class TicketUpdatedPublisher extends BasePublisher<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}