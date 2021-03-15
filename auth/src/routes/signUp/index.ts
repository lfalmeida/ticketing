import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import validationRules from './validation';

const router = express.Router();

router.post('/api/users/signup', validationRules, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }
  res.send('hello');
});

export { router as signupRouter }