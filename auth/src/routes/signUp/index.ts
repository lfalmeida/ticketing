import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import validationRules from './validation';
import { RequestValidationError } from '../../errors/requestValidationError';
import { UserService } from '../../services/userService';

const router = express.Router();

router.post('/api/users/signup', validationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

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