import { TicketAttrs } from '../../interfaces';
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
}