import { BaseListener, IPaymentCreatedEvent, OrderStatus, Subjects } from "@blackcoffee/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queueGroupName";

export class PaymentCreatedListener extends BaseListener<IPaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IPaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found.');
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}