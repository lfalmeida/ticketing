import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res.send('hello 2');
});

export { router as signoutRouter }