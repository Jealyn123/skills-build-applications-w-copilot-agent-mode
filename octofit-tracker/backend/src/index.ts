import { connectDatabase } from './config/database';
import { apiBaseUrl, app } from './server';

const port = Number(process.env.PORT) || 8000;

void connectDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit API listening at ${apiBaseUrl}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Failed to start OctoFit API:', error);
    process.exitCode = 1;
  });