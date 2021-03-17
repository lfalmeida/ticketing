import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../middleware/validateRequest';
import validationRules from './validation';
import { UserService } from '../../services/userService';

const router = express.Router();

router.post('/api/users/signup', validationRules, validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userService = new UserService();
  const user = await userService.create({ email, password });

  // Generate JWT
  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
  }, process.env.JWT_KEY!);

  // Store it on session object
  req.session = {
    jwt: userJwt
  };
  res.status(201).send({ token: userJwt, user });
});

export { router as signupRouter }