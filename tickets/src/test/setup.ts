import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import { UserPayload } from '@blackcoffee/common';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'test_key';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});


beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // build a JWT payload { id, email }
  const payload: UserPayload = {
    id: 'ramdomId',
    email: 'fake@email.com'
  };
  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object { jwt: MY_JWT }
  const session = { token };
  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with ecoded data
  return `express:sess=${base64}`;
};
