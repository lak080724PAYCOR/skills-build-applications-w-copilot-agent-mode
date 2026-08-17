import { connectToDatabase, disconnectDatabase, isDatabaseAvailable } from '../config/database';
import { cloneSeedStore } from '../data/seedData';
import { ActivityModel } from '../models/Activity';
import { LeaderboardSnapshotModel } from '../models/LeaderboardSnapshot';
import { TeamModel } from '../models/Team';
import { UserModel } from '../models/User';
import { WorkoutModel } from '../models/Workout';
import {
  buildIndividualLeaderboard,
  buildTeamLeaderboard,
  buildWorkoutSuggestions,
} from '../services/analytics';

async function seedDatabase() {
  try {
    await connectToDatabase();

    if (!isDatabaseAvailable()) {
      throw new Error('MongoDB is not available. Start mongod before running the seed script.');
    }

    const store = cloneSeedStore();
    const workoutSuggestions = store.users
      .filter((user) => user.role === 'Student')
      .flatMap((user) => buildWorkoutSuggestions(user, store.activities));

    await Promise.all([
      UserModel.deleteMany({}),
      TeamModel.deleteMany({}),
      ActivityModel.deleteMany({}),
      WorkoutModel.deleteMany({}),
      LeaderboardSnapshotModel.deleteMany({}),
    ]);

    await Promise.all([
      UserModel.insertMany(store.users),
      TeamModel.insertMany(store.teams),
      ActivityModel.insertMany(store.activities),
      WorkoutModel.insertMany(workoutSuggestions),
      LeaderboardSnapshotModel.insertMany([
        {
          scope: 'individual',
          entries: buildIndividualLeaderboard(store.users, store.activities),
          generatedAt: new Date(),
        },
        {
          scope: 'team',
          entries: buildTeamLeaderboard(store.teams, store.users, store.activities),
          generatedAt: new Date(),
        },
      ]),
    ]);

    console.log('Database seeding complete');
    await disconnectDatabase();
  } catch (error) {
    console.error('Error seeding database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
}

void seedDatabase();
