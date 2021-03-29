import request from 'supertest';
import { app } from '../../../app';
import TicketService from '../../../services/ticket';
import { natsWrapper } from '../../../nats';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  const cookie = global.signin();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10
    }).expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: 10
    }).expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  const cookie = global.signin();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test title',
      price: -10,
    }).expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: "Valid Title"
    }).expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await TicketService.getAll();
  expect(tickets.length).toEqual(0);

  const cookie = global.signin();
  const title = "Valid Title";
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price: 20
    }).expect(201);
  tickets = await TicketService.getAll();
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const title = "Valid Title";
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20
    }).expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});