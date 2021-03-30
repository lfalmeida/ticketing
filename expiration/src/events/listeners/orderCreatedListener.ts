import { BaseListener, IOrderCreatedEvent, Subjects } from '@blackcoffee/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { expirationQueue } from '../../queues/expirationQueue';

export class OrderCreatedListener extends BaseListener<IOrderCreatedEvent>{
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`waiting this many milliseconds to process queue: ${delay}`);
    await expirationQueue.add(
      {
        orderId: data.id
      }, {
      delay: 10000
    });

    msg.ack();
  }
}