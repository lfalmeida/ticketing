import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import validationRules from './validation';
import { RequestValidationError } from '../../errors/requestValidationError';
import { DatabaseConnectionError } from '../../errors/databaseConnectionError';

const router = express.Router();

router.post('/api/users/signup', validationRules, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  console.log('Creating a user...');
  throw new DatabaseConnectionError();
  res.send({});
});

export { router as signupRouter }