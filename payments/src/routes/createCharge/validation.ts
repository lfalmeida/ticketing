import { body } from 'express-validator';
import mongoose from 'mongoose';

const validationRules = [
  body('token')
    .not()
    .isEmpty(),
  body('orderId')
    .not()
    .isEmpty(),
];

export default validationRules;