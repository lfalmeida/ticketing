import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { UserPayload } from '@blackcoffee/common';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string
    }
  }
}

jest.mock('../nats');

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
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // build a JWT payload { id, email }
  const payload: UserPayload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
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
