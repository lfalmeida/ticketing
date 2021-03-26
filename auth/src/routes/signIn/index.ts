import express, { Request, Response } from 'express';

import { validateRequest } from '@blackcoffee/common';
import { TokenService } from '../../services/tokenService';
import { UserService } from '../../services/userService';
import validationRules from './validation';

const router = express.Router();

router.post('/api/users/signin', validationRules, validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserService.validateCredentials(email, password);
  const token = TokenService.generate(user);
  // Store the token on session object (cookie)
  req.session = { token };
  res.status(200).send({ token, user });
});

export { router as signinRouter }