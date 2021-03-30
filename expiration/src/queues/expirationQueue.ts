import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expirationCompletePublisher';
import { natsWrapper } from '../nats';

interface IJobPayload {
  orderId: string;
}

const expirationQueue = new Queue<IJobPayload>('expiration-queue', {
  redis: {
    host: process.env.REDIS_HOST
  }
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  });
});

export { expirationQueue };