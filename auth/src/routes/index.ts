import express from 'express';

import { currentUserRouter } from './currentUser';
import { signinRouter } from './signIn';
import { signoutRouter } from './signOut'
import { signupRouter } from './signUp'

const loadRoutes = (app: express.Application) => {
  app.use(currentUserRouter);
  app.use(signinRouter);
  app.use(signoutRouter);
  app.use(signupRouter);
};

export default loadRoutes;
