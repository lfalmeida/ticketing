import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@blackcoffee/common';

export const databaseConnection = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('connected to database');
  } catch (err) {
    console.error(err);
    throw new DatabaseConnectionError();
  }
}
