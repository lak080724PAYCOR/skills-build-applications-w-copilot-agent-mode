import cors from 'cors';
import express from 'express';
import apiRouter from './routes/api';

const app = express();
type HttpError = Error & { statusCode?: number };
const codespaceName = process.env.CODESPACE_NAME;
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(codespaceName ? [`https://${codespaceName}-5173.app.github.dev`] : []),
]);

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, !origin || allowedOrigins.has(origin));
    },
  }),
);
app.use(express.json());
app.use('/api', apiRouter);

app.use((error: HttpError, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const statusCode = typeof error.statusCode === 'number' ? error.statusCode : 500;

  response.status(statusCode).json({
    message: statusCode >= 500 ? 'Unexpected server error.' : error.message,
  });
});

export default app;
