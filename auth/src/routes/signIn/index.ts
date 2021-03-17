import express, { Request, Response } from 'express';

import { validateRequest } from '../../middleware/validateRequest';
import validationRules from './validation';

const router = express.Router();

router.post('/api/users/signin', validationRules, validateRequest, (req: Request, res: Response) => {
  res.send('hello');
});

export { router as signinRouter }