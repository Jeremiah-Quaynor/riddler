import { Request, Response, Router } from 'express';

const api_v1 = Router();

api_v1.get('/', (req:Request, res:Response) => {
  res.send('Welcome to Riddler API v1.0.0');
});

export default api_v1;
