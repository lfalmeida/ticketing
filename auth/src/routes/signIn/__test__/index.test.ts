import request from 'supertest';
import { app } from '../../../app';

it('fails when a email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin').send({
      email: 'test@teste.com',
      password: 'password'
    }).expect(400);
});


it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup').send({
      email: 'test@teste.com',
      password: 'password'
    }).expect(201);

  const response = await request(app)
    .post('/api/users/signin').send({
      email: 'test@teste.com',
      password: 'wrong__password'
    }).expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup').send({
      email: 'test@teste.com',
      password: 'password'
    }).expect(201);

  const response = await request(app)
    .post('/api/users/signin').send({
      email: 'test@teste.com',
      password: 'password'
    }).expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
  expect(response.body).toHaveProperty('token');
});