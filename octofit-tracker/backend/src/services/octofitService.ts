import { randomUUID } from 'crypto';
import { connectToDatabase, isDatabaseAvailable } from '../config/database';
import { cloneSeedStore } from '../data/seedData';
import { ActivityModel } from '../models/Activity';
import { LeaderboardSnapshotModel } from '../models/LeaderboardSnapshot';
import { TeamModel } from '../models/Team';
import { UserModel } from '../models/User';
import { WorkoutModel } from '../models/Workout';
import {
  ActivityRecord,
  ActivityType,
  TeamRecord,
  UserRecord,
  UserRole,
  activityTypes,
  userRoles,
} from '../types/domain';
import { calculateActivityPoints } from '../utils/activityPoints';
import {
  buildIndividualLeaderboard,
  buildProgressTimeline,
  buildTeamLeaderboard,
  buildWorkoutSuggestions,
  getUserActivities,
  getUserTotalDistance,
  getUserTotalDuration,
  getUserTotalPoints,
} from './analytics';

type SeedStore = ReturnType<typeof cloneSeedStore>;

function toPlainStoreUsers(users: UserRecord[]) {
  return users.map(({ id, name, role, grade, favoriteActivity, teamIds }) => ({
    id,
    name,
    role,
    grade,
    favoriteActivity,
    teamIds,
  }));
}

function toPlainStoreTeams(teams: TeamRecord[]) {
  return teams.map(({ id, name, description, captainId, memberIds, teacherIds }) => ({
    id,
    name,
    description,
    captainId,
    memberIds,
    teacherIds,
  }));
}

function toPlainStoreActivities(activities: ActivityRecord[]) {
  return activities.map(({ id, userId, type, durationMinutes, distanceKm, points, notes, loggedAt }) => ({
    id,
    userId,
    type,
    durationMinutes,
    distanceKm,
    points,
    notes,
    loggedAt: new Date(loggedAt),
  }));
}

function assertValidRole(role: string): role is UserRole {
  return userRoles.includes(role as UserRole);
}

function assertValidActivityType(type: string): type is ActivityType {
  return activityTypes.includes(type as ActivityType);
}

class OctofitService {
  private store: SeedStore = cloneSeedStore();

  private initialized = false;

  async initialize() {
    if (this.initialized) {
      return;
    }

    await connectToDatabase();

    if (isDatabaseAvailable()) {
      await this.loadFromDatabase();
    } else {
      this.store = cloneSeedStore();
    }

    this.initialized = true;
  }

  private async loadFromDatabase() {
    const [users, teams, activities] = await Promise.all([
      UserModel.find().lean<UserRecord[]>(),
      TeamModel.find().lean<TeamRecord[]>(),
      ActivityModel.find().lean<ActivityRecord[]>(),
    ]);

    if (users.length === 0 && teams.length === 0 && activities.length === 0) {
      await this.persistSeedStore(cloneSeedStore());
      return;
    }

    this.store = {
      users: toPlainStoreUsers(users),
      teams: toPlainStoreTeams(teams),
      activities: toPlainStoreActivities(activities),
    };
    await this.syncDerivedCollections();
  }

  private async persistSeedStore(store: SeedStore) {
    this.store = store;

    if (!isDatabaseAvailable()) {
      return;
    }

    await Promise.all([
      UserModel.deleteMany({}),
      TeamModel.deleteMany({}),
      ActivityModel.deleteMany({}),
    ]);

    await Promise.all([
      UserModel.insertMany(store.users),
      TeamModel.insertMany(store.teams),
      ActivityModel.insertMany(store.activities),
    ]);

    await this.syncDerivedCollections();
  }

  private async syncDerivedCollections() {
    if (!isDatabaseAvailable()) {
      return;
    }

    const suggestions = this.store.users
      .filter((user) => user.role === 'Student')
      .flatMap((user) => buildWorkoutSuggestions(user, this.store.activities));

    const individualLeaderboard = buildIndividualLeaderboard(this.store.users, this.store.activities);
    const teamLeaderboard = buildTeamLeaderboard(
      this.store.teams,
      this.store.users,
      this.store.activities,
    );

    await Promise.all([
      WorkoutModel.deleteMany({}),
      LeaderboardSnapshotModel.deleteMany({}),
    ]);

    if (suggestions.length > 0) {
      await WorkoutModel.insertMany(suggestions);
    }

    await LeaderboardSnapshotModel.insertMany([
      {
        scope: 'individual',
        entries: individualLeaderboard,
        generatedAt: new Date(),
      },
      {
        scope: 'team',
        entries: teamLeaderboard,
        generatedAt: new Date(),
      },
    ]);
  }

  async getDashboardData() {
    await this.initialize();

    const users = this.store.users.map((user) => ({
      ...user,
      totalPoints: getUserTotalPoints(user.id, this.store.activities),
      totalDurationMinutes: getUserTotalDuration(user.id, this.store.activities),
      totalDistanceKm: getUserTotalDistance(user.id, this.store.activities),
      recentActivities: getUserActivities(user.id, this.store.activities).slice(0, 4),
      progress: buildProgressTimeline(user.id, this.store.activities),
      suggestions:
        user.role === 'Student' ? buildWorkoutSuggestions(user, this.store.activities) : [],
    }));

    const teams = this.store.teams.map((team) => {
      const teamMembers = users.filter((user) => team.memberIds.includes(user.id));
      const teamTeachers = users.filter((user) => team.teacherIds.includes(user.id));
      const totalPoints = team.memberIds.reduce(
        (total, memberId) => total + getUserTotalPoints(memberId, this.store.activities),
        0,
      );
      const totalDurationMinutes = team.memberIds.reduce(
        (total, memberId) => total + getUserTotalDuration(memberId, this.store.activities),
        0,
      );

      return {
        ...team,
        members: teamMembers,
        teachers: teamTeachers,
        totalPoints,
        totalDurationMinutes,
      };
    });

    const activities = this.store.activities
      .slice()
      .sort((left, right) => right.loggedAt.getTime() - left.loggedAt.getTime());

    return {
      summary: {
        totalUsers: this.store.users.length,
        totalTeams: this.store.teams.length,
        totalActivities: this.store.activities.length,
        schoolPoints: this.store.activities.reduce((total, activity) => total + activity.points, 0),
      },
      users,
      teams,
      activities,
      individualLeaderboard: buildIndividualLeaderboard(this.store.users, this.store.activities),
      teamLeaderboard: buildTeamLeaderboard(this.store.teams, this.store.users, this.store.activities),
    };
  }

  async createUser(input: {
    name: string;
    role: string;
    grade?: string;
    favoriteActivity?: string;
  }) {
    await this.initialize();

    if (!input.name.trim()) {
      throw new Error('A name is required.');
    }

    if (!assertValidRole(input.role)) {
      throw new Error('Role must be Student or Gym Teacher.');
    }

    const user: UserRecord = {
      id: `user-${randomUUID()}`,
      name: input.name.trim(),
      role: input.role,
      grade: input.grade?.trim() || undefined,
      favoriteActivity: input.favoriteActivity?.trim() || undefined,
      teamIds: [],
    };

    this.store.users.push(user);

    if (isDatabaseAvailable()) {
      await UserModel.create(user);
      await this.syncDerivedCollections();
    }

    return user;
  }

  async logActivity(input: {
    userId: string;
    type: string;
    durationMinutes: number;
    distanceKm?: number;
    notes?: string;
  }) {
    await this.initialize();

    if (!this.store.users.some((user) => user.id === input.userId)) {
      throw new Error('Selected user does not exist.');
    }

    if (!assertValidActivityType(input.type)) {
      throw new Error('Please choose a supported activity type.');
    }

    if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
      throw new Error('Duration must be greater than zero.');
    }

    const distanceKm = Number.isFinite(input.distanceKm) ? Number(input.distanceKm) : 0;

    if (distanceKm < 0) {
      throw new Error('Distance cannot be negative.');
    }

    const activity: ActivityRecord = {
      id: `activity-${randomUUID()}`,
      userId: input.userId,
      type: input.type,
      durationMinutes: Number(input.durationMinutes),
      distanceKm,
      points: calculateActivityPoints(input.type, Number(input.durationMinutes), distanceKm),
      notes: input.notes?.trim() || undefined,
      loggedAt: new Date(),
    };

    this.store.activities.push(activity);

    if (isDatabaseAvailable()) {
      await ActivityModel.create(activity);
      await this.syncDerivedCollections();
    }

    return activity;
  }

  async createTeam(input: {
    name: string;
    description: string;
    captainId: string;
    teacherIds?: string[];
  }) {
    await this.initialize();

    if (!input.name.trim() || !input.description.trim()) {
      throw new Error('Team name and description are required.');
    }

    const captain = this.store.users.find((user) => user.id === input.captainId && user.role === 'Student');
    if (!captain) {
      throw new Error('Captain must be an existing student.');
    }

    const teacherIds = (input.teacherIds || []).filter((teacherId) =>
      this.store.users.some((user) => user.id === teacherId && user.role === 'Gym Teacher'),
    );

    const team: TeamRecord = {
      id: `team-${randomUUID()}`,
      name: input.name.trim(),
      description: input.description.trim(),
      captainId: captain.id,
      memberIds: [captain.id],
      teacherIds,
    };

    this.store.teams.push(team);
    captain.teamIds = [...new Set([...captain.teamIds, team.id])];

    if (isDatabaseAvailable()) {
      await Promise.all([
        TeamModel.create(team),
        UserModel.updateOne({ id: captain.id }, { $set: { teamIds: captain.teamIds } }),
      ]);
      await this.syncDerivedCollections();
    }

    return team;
  }

  async joinTeam(teamId: string, userId: string) {
    await this.initialize();

    const team = this.store.teams.find((candidate) => candidate.id === teamId);
    const user = this.store.users.find((candidate) => candidate.id === userId);

    if (!team || !user) {
      throw new Error('Team or user could not be found.');
    }

    if (user.role !== 'Student') {
      throw new Error('Only students can join teams.');
    }

    team.memberIds = [...new Set([...team.memberIds, user.id])];
    user.teamIds = [...new Set([...user.teamIds, team.id])];

    if (isDatabaseAvailable()) {
      await Promise.all([
        TeamModel.updateOne({ id: team.id }, { $set: { memberIds: team.memberIds } }),
        UserModel.updateOne({ id: user.id }, { $set: { teamIds: user.teamIds } }),
      ]);
      await this.syncDerivedCollections();
    }

    return team;
  }

  async getWorkoutSuggestionsForUser(userId: string) {
    await this.initialize();

    const user = this.store.users.find((candidate) => candidate.id === userId);
    if (!user) {
      throw new Error('User not found.');
    }

    return buildWorkoutSuggestions(user, this.store.activities);
  }
}

export const octofitService = new OctofitService();
