import { Request, Response, Router } from 'express';
const { db } = require('../firebase');

const api_v1 = Router();

api_v1.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Riddler API v1.0.0');
});

api_v1.get('/riddles', async (req: Request, res: Response) => {
  try {
    const riddlesSnapshot = await db.collection('riddles').get();
    const riddles: any[] = [];

    riddlesSnapshot.forEach((doc: { id: any; data: () => any }) => {
      riddles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.send({ riddles: riddles });
  } catch (error) {
    console.error('Error fetching riddles:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default api_v1;
