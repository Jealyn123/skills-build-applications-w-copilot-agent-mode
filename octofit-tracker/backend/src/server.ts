import cors from 'cors';
import express from 'express';

export const apiBaseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/users/', (_request, response) => {
  response.json([]);
});

app.get('/api/teams/', (_request, response) => {
  response.json([]);
});

app.get('/api/activities/', (_request, response) => {
  response.json([]);
});

app.get('/api/leaderboard/', (_request, response) => {
  response.json([]);
});

app.get('/api/workouts/', (_request, response) => {
  response.json([]);
});