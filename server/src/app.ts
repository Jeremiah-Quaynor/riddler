import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
// import * as cors from 'cors';
import api_v1 from './routes/v1';

const express = require('express');
const admin = require('firebase-admin');

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Riddler API');
});

app.use(bodyParser.json());

app.use('/api/v1', api_v1);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
