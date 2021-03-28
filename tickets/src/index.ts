import { databaseConnection } from './database/connection';
import { app } from './app';
import { natsWrapper } from './nats';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  await natsWrapper.connect('ticketing', 'sdfasdf', 'http://nats-srv:4222');
  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  await databaseConnection();

  app.listen(3000, () => {
    console.log('Listening on port 3000.');
  });
}

start();
