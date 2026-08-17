import { calculateActivityPoints } from '../utils/activityPoints';
import { ActivityRecord, ActivityType, TeamRecord, UserRecord } from '../types/domain';

type SeedActivityTuple = [
  string,
  string,
  ActivityType,
  number,
  number,
  string,
  string,
];

const seedUsers: UserRecord[] = [
  {
    id: 'user-ava',
    name: 'Ava Martinez',
    role: 'Student',
    grade: '9',
    favoriteActivity: 'running',
    teamIds: ['team-trailblazers'],
  },
  {
    id: 'user-ethan',
    name: 'Ethan Brooks',
    role: 'Student',
    grade: '10',
    favoriteActivity: 'cycling',
    teamIds: ['team-trailblazers'],
  },
  {
    id: 'user-zoe',
    name: 'Zoe Patel',
    role: 'Student',
    grade: '11',
    favoriteActivity: 'walking',
    teamIds: ['team-powerhouse'],
  },
  {
    id: 'user-mason',
    name: 'Mason Kim',
    role: 'Student',
    grade: '10',
    favoriteActivity: 'basketball',
    teamIds: ['team-powerhouse'],
  },
  {
    id: 'user-lila',
    name: 'Lila Nguyen',
    role: 'Student',
    grade: '12',
    favoriteActivity: 'yoga',
    teamIds: ['team-octowave'],
  },
  {
    id: 'user-noah',
    name: 'Noah Johnson',
    role: 'Student',
    grade: '9',
    favoriteActivity: 'swimming',
    teamIds: ['team-octowave'],
  },
  {
    id: 'user-paul',
    name: 'Paul Octo',
    role: 'Gym Teacher',
    favoriteActivity: 'workout',
    teamIds: ['team-trailblazers', 'team-powerhouse'],
  },
  {
    id: 'user-jessica',
    name: 'Jessica Cat',
    role: 'Gym Teacher',
    favoriteActivity: 'walking',
    teamIds: ['team-octowave'],
  },
];

const seedTeams: TeamRecord[] = [
  {
    id: 'team-trailblazers',
    name: 'Trailblazers',
    description: 'Runners and riders chasing weekly cardio streaks.',
    captainId: 'user-ava',
    memberIds: ['user-ava', 'user-ethan'],
    teacherIds: ['user-paul'],
  },
  {
    id: 'team-powerhouse',
    name: 'Powerhouse',
    description: 'Strength-focused students building balanced routines.',
    captainId: 'user-zoe',
    memberIds: ['user-zoe', 'user-mason'],
    teacherIds: ['user-paul'],
  },
  {
    id: 'team-octowave',
    name: 'OctoWave',
    description: 'Recovery-minded movers mixing flexibility and endurance.',
    captainId: 'user-lila',
    memberIds: ['user-lila', 'user-noah'],
    teacherIds: ['user-jessica'],
  },
];

const seedActivities: ActivityRecord[] = ([
  ['activity-1', 'user-ava', 'running', 35, 5.2, 'Interval laps before first period.', '2026-08-16T06:30:00.000Z'],
  ['activity-2', 'user-ava', 'walking', 20, 1.8, 'Lunch walk with classmates.', '2026-08-14T17:15:00.000Z'],
  ['activity-3', 'user-ethan', 'cycling', 40, 11.4, 'Neighborhood ride after school.', '2026-08-15T16:45:00.000Z'],
  ['activity-4', 'user-ethan', 'workout', 30, 0, 'Core and resistance band circuit.', '2026-08-12T18:05:00.000Z'],
  ['activity-5', 'user-zoe', 'walking', 50, 3.5, 'Community center treadmill walk.', '2026-08-17T07:10:00.000Z'],
  ['activity-6', 'user-mason', 'basketball', 45, 2.1, 'Pickup game in the gym.', '2026-08-16T19:20:00.000Z'],
  ['activity-7', 'user-mason', 'workout', 25, 0, 'Push and pull workout block.', '2026-08-13T18:40:00.000Z'],
  ['activity-8', 'user-lila', 'yoga', 30, 0, 'Mobility and breathing practice.', '2026-08-17T06:50:00.000Z'],
  ['activity-9', 'user-noah', 'swimming', 45, 1.4, 'Lap swim at the aquatic center.', '2026-08-15T15:15:00.000Z'],
  ['activity-10', 'user-noah', 'walking', 25, 1.9, 'Cooldown walk with family.', '2026-08-11T20:15:00.000Z'],
 ] as SeedActivityTuple[]).map(([id, userId, type, durationMinutes, distanceKm, notes, loggedAt]) => ({
  id,
  userId,
  type,
  durationMinutes,
  distanceKm,
  points: calculateActivityPoints(type, durationMinutes, distanceKm),
  notes,
  loggedAt: new Date(loggedAt),
}));

export function cloneSeedStore() {
  return structuredClone({
    users: seedUsers,
    teams: seedTeams,
    activities: seedActivities,
  });
}
