import express from 'express';
import { requireAuth } from '../../middleware/requireAuth';

const router = express.Router();

router.get('/api/users/current', requireAuth, (req, res) => {
  const { currentUser = null } = req;
  return res.send({ currentUser });
});

export { router as currentUserRouter }