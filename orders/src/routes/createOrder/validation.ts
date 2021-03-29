import { body } from 'express-validator';
import mongoose from 'mongoose';

const validationRules = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket ID must be provided.'),
];

export default validationRules;