import { body } from 'express-validator';

const validationRules = [
  body('email').isEmail().withMessage('Email must be valid.'),
  body('password').trim().isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
];

export default validationRules;