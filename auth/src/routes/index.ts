import express from 'express';

import { NotFoundError } from '../errors/notFoundError';
import { currentUserRouter } from './currentUser';
import { signinRouter } from './signIn';
import { signoutRouter } from './signOut'
import { signupRouter } from './signUp'

const supportedRoutes = [
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter
];

const loadRoutes = (app: express.Application) => {
  supportedRoutes.map(route => {
    app.use(route);
  });

  app.all('*', () => {
    throw new NotFoundError();
  })
};

export default loadRoutes;
