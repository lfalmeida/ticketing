import { databaseConnection } from './database/connection';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }
  await databaseConnection();

  app.listen(3000, () => {
    console.log('Listening on port 3000.');
  });
}

start();
