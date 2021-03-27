import { body } from 'express-validator';

const validationRules = [
  body('title').not().isEmpty().withMessage('Title is required.'),
  body('price').isFloat({
    gt: 0
  }).withMessage('Price must be grater than zero.'),
];

export default validationRules;