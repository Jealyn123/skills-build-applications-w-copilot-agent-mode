import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { Activity, Leaderboard, Team, User, Workout } from './models';

export const apiBaseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/users/', async (_request, response) => {
  const users = await User.find().populate('team', 'name');
  response.json(users);
});

app.get('/api/teams/', async (_request, response) => {
  const teams = await Team.find().populate('members', 'username firstName lastName');
  response.json(teams);
});

app.get('/api/activities/', async (_request, response) => {
  const activities = await Activity.find()
    .populate('user', 'username firstName lastName')
    .sort({ completedAt: -1 });
  response.json(activities);
});

app.get('/api/leaderboard/', async (_request, response) => {
  const leaderboard = await Leaderboard.find()
    .populate('user', 'username firstName lastName')
    .sort({ rank: 1 });
  response.json(leaderboard);
});

app.get('/api/workouts/', async (_request, response) => {
  const workouts = await Workout.find().sort({ title: 1 });
  response.json(workouts);
});

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});