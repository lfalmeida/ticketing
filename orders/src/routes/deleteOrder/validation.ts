import mongoose from 'mongoose';
import { param } from 'express-validator';

const validationRules = [
  param('orderId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Order ID must be provided.'),
];

export default validationRules;