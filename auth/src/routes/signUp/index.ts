import express, { Request, Response } from 'express';

import { validateRequest } from '../../middleware/validateRequest';
import validationRules from './validation';
import { UserService } from '../../services/userService';
import { TokenService } from '../../services/tokenService';

const router = express.Router();

router.post('/api/users/signup', validationRules, validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserService.create({ email, password });
  const token = TokenService.generate(user);
  // Store the token on session object (cookie)
  req.session = { token };
  res.status(201).send({ token, user });
});

export { router as signupRouter }