import { apiBaseUrl, app } from './server';

const port = Number(process.env.PORT) || 8000;

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit API listening at ${apiBaseUrl}`);
});