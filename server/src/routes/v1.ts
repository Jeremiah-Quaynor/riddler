import { getCurrentDateAndTime } from '../utils/getCurrentDateTime'; // Adjust the path accordingly
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

    const totalRiddles = riddlesSnapshot.size;
    const totalRiddlesEasy = riddlesSnapshot.docs.filter(
      (doc: { data: () => { (): any; new (): any; difficulty: string } }) =>
        doc.data().difficulty === 'Easy',
    ).length;
    const totalRiddlesMedium = riddlesSnapshot.docs.filter(
      (doc: { data: () => { (): any; new (): any; difficulty: string } }) =>
        doc.data().difficulty === 'Medium',
    ).length;
    const totalRiddlesHard = riddlesSnapshot.docs.filter(
      (doc: { data: () => { (): any; new (): any; difficulty: string } }) =>
        doc.data().difficulty === 'Hard',
    ).length;
    riddlesSnapshot.forEach((doc: { id: any; data: () => any }) => {
      riddles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.send({
      meta: {
        totalRiddles: totalRiddles,
        totalRiddlesEasy: totalRiddlesEasy,
        totalRiddlesMedium: totalRiddlesMedium,
        totalRiddlesHard: totalRiddlesHard,
      },
      riddles: riddles,
    });
  } catch (error) {
    console.error('Error fetching riddles:', error);
    res.status(500).send('Internal Server Error');
  }
});

api_v1.post('/add-riddle', async (req: Request, res: Response) => {
  try {
    if (
      !req.body.hasOwnProperty('difficulty') ||
      !req.body.hasOwnProperty('riddleText') ||
      !req.body.hasOwnProperty('answer') ||
      !req.body.hasOwnProperty('possibleAnswers') ||
      !req.body.hasOwnProperty('category')
    ) {
      res.status(400).send('Bad Request: Missing fields');
      return;
    }

    let riddle = req.body;
    riddle.dateCreated = getCurrentDateAndTime();
    const riddleRef = await db.collection('riddles').add(riddle);
    if (riddleRef.id && riddleRef.id.length > 0 && riddleRef.id.length < 21) {
      res.send({ msg: 'Riddle added successfully' });
    } else {
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error('Error adding riddle:', error);
    res.status(500).send('Internal Server Error');
  }
});

api_v1.post('/add-riddles', async (req: Request, res: Response) => {
  try {
    if (!req.body.hasOwnProperty('riddles')) {
      res.status(400).send('Bad Request: Missing fields');
      return;
    }
    // it should not be more than 20 riddles
    if (req.body.riddles.length > 20) {
      res.status(400).send('Bad Request: Too many riddles');
      return;
    }
    let riddles = req.body.riddles;
    let riddlesAdded = 0;
    let riddlesFailed = 0;

    for (let i = 0; i < riddles.length; i++) {
      let riddle = riddles[i];
      riddle.dateCreated = getCurrentDateAndTime();
      const riddleRef = await db.collection('riddles').add(riddle);
      if (riddleRef.id && riddleRef.id.length > 0 && riddleRef.id.length < 21) {
        riddlesAdded++;
      } else {
        riddlesFailed++;
      }
    }

    res.send({
      msg: 'Riddles added successfully',
      riddlesAdded: riddlesAdded,
      riddlesFailed: riddlesFailed,
    });
  } catch (error) {
    console.error('Error adding riddles:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default api_v1;
