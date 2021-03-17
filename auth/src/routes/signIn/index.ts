import express, { Request, Response } from 'express';

import { validateRequest } from '../../middleware/validateRequest';
import validationRules from './validation';

const router = express.Router();

router.post('/api/users/signin', validationRules, validateRequest, (req: Request, res: Response) => {
  const { email, password } = req.body;
});

export { router as signinRouter }