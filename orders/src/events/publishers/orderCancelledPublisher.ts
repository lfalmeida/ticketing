
import { BasePublisher, Subjects, IOrderCancelledEvent } from '@blackcoffee/common';

export class OrderCancelledPublisher extends BasePublisher<IOrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}