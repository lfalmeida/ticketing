import Queue from 'bull';

interface IJobPayload {
  orderId: string;
}

const expirationQueue = new Queue<IJobPayload>('expiration-queue', {
  redis: {
    host: process.env.REDIS_HOST
  }
});

expirationQueue.process(async (job) => {
  console.log(`I want to publish an expiration:complete event for event ${job.data.orderId}`);
});

export { expirationQueue };