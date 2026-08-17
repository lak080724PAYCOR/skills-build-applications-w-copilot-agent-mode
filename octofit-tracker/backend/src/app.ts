import cors from 'cors';
import express from 'express';
import apiRouter from './routes/api';

const app = express();

app.use(
  cors({
    origin: true,
  }),
);
app.use(express.json());
app.use('/api', apiRouter);

app.use((error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  response.status(400).json({
    message: error.message || 'Unexpected server error.',
  });
});

export default app;
