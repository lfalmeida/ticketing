import express from 'express';

const router = express.Router();

router.get('/api/users/current', (req, res) => {
  return res.send({ message: 'hello' });
});

export { router as currentUserRouter }