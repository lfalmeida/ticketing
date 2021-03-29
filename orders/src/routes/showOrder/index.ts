import express, { Request, Response } from 'express';
import validationRules from './validation';
import { requireAuth, validateRequest } from '@blackcoffee/common';


const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, validationRules, validateRequest, async (req: Request, res: Response) => {
  res.send({});
});

export { router as showOrderRouter };
