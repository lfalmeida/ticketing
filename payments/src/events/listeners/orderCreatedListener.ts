import { BaseListener, IOrderCreatedEvent, Subjects } from "@blackcoffee/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupname } from "./queueGroupName";

export class OrderCreatedListener extends BaseListener<IOrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupname;
  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    });
    await order.save();

    msg.ack();
  }
}