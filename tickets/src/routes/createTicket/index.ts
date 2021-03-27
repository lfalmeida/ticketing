import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@blackcoffee/common';
import validationRules from './validation';
const router = express.Router();

router.post('/api/tickets', requireAuth, validationRules, validateRequest, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as createTicketRouter }

