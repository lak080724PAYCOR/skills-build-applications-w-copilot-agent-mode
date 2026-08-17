export const userRoles = ['Student', 'Gym Teacher'] as const;
export type UserRole = (typeof userRoles)[number];

export const activityTypes = [
  'running',
  'walking',
  'cycling',
  'workout',
  'swimming',
  'yoga',
  'basketball',
] as const;
export type ActivityType = (typeof activityTypes)[number];

export interface UserRecord {
  id: string;
  name: string;
  role: UserRole;
  grade?: string;
  favoriteActivity?: string;
  teamIds: string[];
}

export interface TeamRecord {
  id: string;
  name: string;
  description: string;
  captainId: string;
  memberIds: string[];
  teacherIds: string[];
}

export interface ActivityRecord {
  id: string;
  userId: string;
  type: ActivityType;
  durationMinutes: number;
  distanceKm: number;
  points: number;
  notes?: string;
  loggedAt: Date;
}

export interface WorkoutSuggestion {
  userId: string;
  title: string;
  description: string;
  intensity: 'light' | 'moderate' | 'high';
  focusArea: string;
}

export interface LeaderboardEntry {
  entityId: string;
  name: string;
  points: number;
  rank: number;
}

export interface LeaderboardSnapshotRecord {
  scope: 'individual' | 'team';
  entries: LeaderboardEntry[];
  generatedAt: Date;
}

export interface ProgressPoint {
  date: string;
  cumulativePoints: number;
}
