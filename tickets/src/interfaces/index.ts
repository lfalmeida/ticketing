import mongoose from "mongoose";

/**
 * Describes the attributes for building a Ticket
 */
export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

/**
 * Describes the Ticket Document
 */
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

/**
 * Describes the Ticket Model
 */
export interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}
