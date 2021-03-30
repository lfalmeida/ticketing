import { BasePublisher, IExpirationCompleteEvent, Subjects } from "@blackcoffee/common";

export class ExpirationCompletePublisher extends BasePublisher<IExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

}