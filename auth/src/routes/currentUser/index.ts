import express from 'express';

const router = express.Router();

router.get('/api/users/current', (req, res) => {
  return res.send('hello');
});

export { router as currentUserRouter }