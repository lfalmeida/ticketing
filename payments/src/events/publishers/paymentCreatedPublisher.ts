import { BasePublisher, IPaymentCreatedEvent, Subjects } from "@blackcoffee/common";

export class PaymentCreatedPublisher extends BasePublisher<IPaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}