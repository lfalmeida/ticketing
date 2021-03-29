import { body } from 'express-validator';

const validationRules = [
  body('ticketId').not().isEmpty().withMessage('Ticket ID must be provided.'),
];

export default validationRules;