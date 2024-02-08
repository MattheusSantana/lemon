import express from 'express';
import bodyParser from 'body-parser';
import { checkEligibility, validateInput } from './controller.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/checkEligibility', (req, res) => {
  try {
    const validated = validateInput(req.body);
    const result = checkEligibility(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

export default app;