import { BasePublisher, Subjects, IOrderCreatedEvent } from '@blackcoffee/common';

export class OrderCreatedPublisher extends BasePublisher<IOrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}