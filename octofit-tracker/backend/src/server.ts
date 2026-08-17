import app from './app';
import { octofitService } from './services/octofitService';

const port = Number(process.env.PORT || 8000);

async function startServer() {
  await octofitService.initialize();

  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit Tracker API listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start the OctoFit Tracker API.', error);
  process.exit(1);
});
