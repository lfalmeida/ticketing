import { OrderStatus } from '@blackcoffee/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats';
import { OrderService } from '../../../services/orders';

it('marks an order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 30
  });
  await ticket.save();

  const user = global.signin();

  // create request to create order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // create request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // expectation to make suer the thing is cancelled
  const updatedOrder = await OrderService.findOrderById(order.id);
  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 30
  });
  await ticket.save();

  const user = global.signin();

  // create request to create order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // create request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});