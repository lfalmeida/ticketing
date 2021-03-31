import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Order } from '../../../models/order';
import { OrderStatus } from '@blackcoffee/common';
import { stripe } from '../../../stripe';
import { Payment } from '../../../models/payment';

jest.mock('../../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'invalidvalue',
      orderId: mongoose.Types.ObjectId().toHexString()
    }).expect(404);
});

it('returns a 401 when purchasing an order that doesnt belongs to the user', async () => {

  const fakeUserId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: fakeUserId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();

  const otherUser = global.signin();
  await request(app)
    .post('/api/payments')
    .set('Cookie', otherUser)
    .send({
      token: 'validStringValue',
      orderId: order.id
    }).expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const user = global.signin(userId);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 1,
    price: 20,
    status: OrderStatus.Cancelled
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({
      token: 'validStringValue',
      orderId: order.id
    }).expect(400);

});

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const user = global.signin(userId);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 1,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({
      token: 'tok_visa',
      orderId: order.id
    }).expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('brl');

  const payment = Payment.findOne({ orderId: order.id });
  expect(payment).not.toBeNull()

});