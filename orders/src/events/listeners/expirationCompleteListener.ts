import { BaseListener, IExpirationCompleteEvent, OrderStatus, Subjects } from "@blackcoffee/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/orderCancelledPublisher";
import { queueGroupName } from "./queueGroupName";

export class ExpirationCompleteListener extends BaseListener<IExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: IExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found.');
    }

    // checking if alredy complete before cancel
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    msg.ack();
  }
}