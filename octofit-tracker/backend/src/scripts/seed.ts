import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { Activity, Leaderboard, Team, User, Workout } from '../models';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    const teams = await Promise.all([
      Team.findOneAndUpdate(
        { name: 'Trail Blazers' },
        {
          $set: { description: 'A team focused on outdoor movement and steady progress.' },
          $setOnInsert: { members: [] },
        },
        { new: true, upsert: true, runValidators: true },
      ),
      Team.findOneAndUpdate(
        { name: 'Power Pioneers' },
        {
          $set: { description: 'A team building strength through consistent training.' },
          $setOnInsert: { members: [] },
        },
        { new: true, upsert: true, runValidators: true },
      ),
    ]);

    const userRecords = [
      {
        username: 'alex.morgan',
        email: 'alex.morgan@example.test',
        firstName: 'Alex',
        lastName: 'Morgan',
        age: 16,
        fitnessLevel: 'intermediate',
        team: teams[0]._id,
      },
      {
        username: 'jamie.chen',
        email: 'jamie.chen@example.test',
        firstName: 'Jamie',
        lastName: 'Chen',
        age: 15,
        fitnessLevel: 'beginner',
        team: teams[0]._id,
      },
      {
        username: 'riley.patel',
        email: 'riley.patel@example.test',
        firstName: 'Riley',
        lastName: 'Patel',
        age: 17,
        fitnessLevel: 'advanced',
        team: teams[1]._id,
      },
      {
        username: 'sam.rivera',
        email: 'sam.rivera@example.test',
        firstName: 'Sam',
        lastName: 'Rivera',
        age: 16,
        fitnessLevel: 'intermediate',
        team: teams[1]._id,
      },
    ];

    const users = await Promise.all(
      userRecords.map(({ username, ...user }) =>
        User.findOneAndUpdate(
          { username },
          { $set: user, $setOnInsert: { username } },
          { new: true, upsert: true, runValidators: true },
        ),
      ),
    );

    await Promise.all([
      Team.updateOne(
        { _id: teams[0]._id },
        { $addToSet: { members: { $each: users.slice(0, 2).map((user) => user._id) } } },
      ),
      Team.updateOne(
        { _id: teams[1]._id },
        { $addToSet: { members: { $each: users.slice(2).map((user) => user._id) } } },
      ),
    ]);

    const activities = [
      { user: users[0]._id, activityType: 'running', durationMinutes: 28, caloriesBurned: 240, completedAt: new Date('2026-09-27T16:00:00.000Z') },
      { user: users[1]._id, activityType: 'walking', durationMinutes: 35, caloriesBurned: 145, completedAt: new Date('2026-09-27T17:00:00.000Z') },
      { user: users[2]._id, activityType: 'strength', durationMinutes: 42, caloriesBurned: 280, completedAt: new Date('2026-09-26T16:00:00.000Z') },
      { user: users[3]._id, activityType: 'running', durationMinutes: 22, caloriesBurned: 185, completedAt: new Date('2026-09-25T16:00:00.000Z') },
      { user: users[0]._id, activityType: 'strength', durationMinutes: 30, caloriesBurned: 210, completedAt: new Date('2026-09-24T16:00:00.000Z') },
    ];
    await Promise.all(
      activities.map(({ user, activityType, completedAt, ...activity }) =>
        Activity.updateOne(
          { user, activityType, completedAt },
          { $set: { user, activityType, completedAt, ...activity } },
          { upsert: true, runValidators: true },
        ),
      ),
    );

    const leaderboardRecords = [
      { user: users[2]._id, points: 860, rank: 1, period: 'weekly' },
      { user: users[0]._id, points: 740, rank: 2, period: 'weekly' },
      { user: users[3]._id, points: 610, rank: 3, period: 'weekly' },
      { user: users[1]._id, points: 480, rank: 4, period: 'weekly' },
    ];
    await Promise.all(
      leaderboardRecords.map(({ user, ...record }) =>
        Leaderboard.updateOne(
          { user, period: record.period },
          { $set: { user, ...record } },
          { upsert: true, runValidators: true },
        ),
      ),
    );

    const workouts = [
      {
        title: 'Easy pace intervals',
        description: 'Alternate a comfortable jog with short walking recovery periods.',
        activityType: 'running',
        durationMinutes: 25,
        intensity: 'moderate',
        targetFitnessLevel: 'beginner',
      },
      {
        title: 'After-school walk',
        description: 'Take a brisk walk and build a consistent daily movement habit.',
        activityType: 'walking',
        durationMinutes: 30,
        intensity: 'light',
        targetFitnessLevel: 'beginner',
      },
      {
        title: 'Bodyweight circuit',
        description: 'Complete controlled rounds of squats, push-ups, lunges, and planks.',
        activityType: 'strength',
        durationMinutes: 35,
        intensity: 'moderate',
        targetFitnessLevel: 'intermediate',
      },
      {
        title: 'Tempo run',
        description: 'Warm up, hold a challenging steady pace, then cool down.',
        activityType: 'running',
        durationMinutes: 40,
        intensity: 'vigorous',
        targetFitnessLevel: 'advanced',
      },
    ];
    await Promise.all(
      workouts.map(({ title, ...workout }) =>
        Workout.updateOne(
          { title },
          { $set: { title, ...workout } },
          { upsert: true, runValidators: true },
        ),
      ),
    );

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
