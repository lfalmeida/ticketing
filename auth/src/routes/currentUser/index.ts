import express from 'express';
import { checkToken } from '../../middleware/checkToken';

const router = express.Router();

router.get('/api/users/current', checkToken, (req, res) => {
  const { currentUser = null } = req;
  return res.send({ currentUser });
});

export { router as currentUserRouter }