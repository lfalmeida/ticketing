import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus } from "@blackcoffee/common";
import { Order } from "../models/order";
import { Ticket, TicketDoc } from "../models/ticket";
import { natsWrapper } from '../nats';
import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher';
import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
/**
 * 
 */
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

/**
 * 
 */
export class OrderService {

  /**
   * Receives a ticketId and returns a ticket if it is found
   * @param ticketId string
   * @returns Promise
   */
  static async findTicketById(ticketId: string) {
    return await Ticket.findById(ticketId);
  }

  /**
   * Receives a orderId and returns a ticket if it is found
   * @param orderId string
   * @returns Promise
   */
  static async findOrderById(orderId: string) {
    return await Order.findById(orderId).populate('ticket');
  }

  /**
   * Return true when there is a order to the ticket provided.
   * One ticket is reserved when there is a order for the ticket with
   * a status of OrderStatus.Created, OrderStatus.AwaitingPayment or OrderStatus.Complete
   * 
   * @param ticket TicketDoc
   * @returns Promise<boolean>
   */
  static async isTicketReserved(ticket: TicketDoc): Promise<boolean> {
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete
        ]
      }
    });
    return !!existingOrder;
  }

  /**
   * Crates an order with ticketId and userId provided
   * @param ticketId string
   * @param userId string
   */
  static async create(ticketId: string, userId: string) {
    const ticket = await this.findTicketById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await this.isTicketReserved(ticket);

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = new Order({
      userId: userId,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });
    await order.save();

    const client = natsWrapper.client;
    new OrderCreatedPublisher(client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      expiresAt: order.expiresAt.toISOString(),
    });

    return order;
  }

  /**
   * Returns the orders for the given userId
   * @param userId User Identifier
   * @returns Orders
   */
  static async getOrdersFromUserId(userId: string) {
    const orders = await Order.find({ userId })
      .populate('ticket');
    return orders;
  }

  /**
   * 
   * @param orderId 
   * @param currentUserId 
   * @returns 
   */
  static async cancelOrder(orderId: string, currentUserId: string) {
    const order = await this.findOrderById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== currentUserId) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // TODO publish an event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    })

    return order.status === OrderStatus.Cancelled;
  }


}