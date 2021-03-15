import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/test', (req, res) => {
  res.send('hello');
});

app.listen(3000, () => {
  console.log('Listening on port 3000.');
});