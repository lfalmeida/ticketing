import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import validationRules from './validation';

const router = express.Router();

router.post('/api/users/signup', validationRules, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error('Invalid email or password');
  }
  console.log('Creating a user...');
  throw new Error('Error connecting the database');
  res.send({});
});

export { router as signupRouter }