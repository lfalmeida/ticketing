import request from 'supertest';
import { app } from '../../../app';

it('responds with details about the current user', async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .get('/api/users/current')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with not authorized status if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/current')
    .send()
    .expect(401);
});