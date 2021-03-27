import { UserPayload, NotFoundError, NotAuthorizedError } from '@blackcoffee/common';
import { TicketAttrs, TicketDoc } from '../../interfaces';
import { Ticket } from '../../models/ticket';

export default class TicketService {
  static async create(attrs: TicketAttrs) {
    const ticket = Ticket.build(attrs);
    await ticket.save();
    return ticket;
  }

  static async getAll() {
    return await Ticket.find();
  }

  static async findById(ticketId: string) {
    return await Ticket.findById(ticketId);
  }

  static async update(ticketId: string, newData: Object, currentUser: UserPayload) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== currentUser.id) {
      throw new NotAuthorizedError()
    }

    ticket.set(newData);
    return await ticket.save();
  }

}