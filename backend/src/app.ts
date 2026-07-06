import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000' }));
app.use(morgan(process.env['NODE_ENV'] === 'production' ? 'combined' : 'dev'));
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;