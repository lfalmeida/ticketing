import { BadRequestError, NotFoundError, OrderStatus } from "@blackcoffee/common";
import { Order } from "../models/order";
import { Ticket, TicketDoc } from "../models/ticket";

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

    return order;
  }

}