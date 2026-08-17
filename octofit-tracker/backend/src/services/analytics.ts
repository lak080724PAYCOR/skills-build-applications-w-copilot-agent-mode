import {
  ActivityRecord,
  LeaderboardEntry,
  ProgressPoint,
  TeamRecord,
  UserRecord,
  WorkoutSuggestion,
} from '../types/domain';

export function getUserActivities(userId: string, activities: ActivityRecord[]) {
  return activities
    .filter((activity) => activity.userId === userId)
    .sort((left, right) => right.loggedAt.getTime() - left.loggedAt.getTime());
}

export function getUserTotalPoints(userId: string, activities: ActivityRecord[]) {
  return getUserActivities(userId, activities).reduce((total, activity) => total + activity.points, 0);
}

export function getUserTotalDuration(userId: string, activities: ActivityRecord[]) {
  return getUserActivities(userId, activities).reduce(
    (total, activity) => total + activity.durationMinutes,
    0,
  );
}

export function getUserTotalDistance(userId: string, activities: ActivityRecord[]) {
  return Number(
    getUserActivities(userId, activities)
      .reduce((total, activity) => total + activity.distanceKm, 0)
      .toFixed(1),
  );
}

export function buildProgressTimeline(userId: string, activities: ActivityRecord[]): ProgressPoint[] {
  let cumulativePoints = 0;

  return getUserActivities(userId, activities)
    .slice()
    .reverse()
    .map((activity) => {
      cumulativePoints += activity.points;

      return {
        date: activity.loggedAt.toISOString().slice(0, 10),
        cumulativePoints,
      };
    });
}

export function buildIndividualLeaderboard(
  users: UserRecord[],
  activities: ActivityRecord[],
): LeaderboardEntry[] {
  return users
    .filter((user) => user.role === 'Student')
    .map((user) => ({
      entityId: user.id,
      name: user.name,
      points: getUserTotalPoints(user.id, activities),
    }))
    .sort((left, right) => right.points - left.points || left.name.localeCompare(right.name))
    .map((entry, index) => ({
      entityId: entry.entityId,
      name: entry.name,
      points: entry.points,
      rank: index + 1,
    }));
}

export function buildTeamLeaderboard(
  teams: TeamRecord[],
  users: UserRecord[],
  activities: ActivityRecord[],
): LeaderboardEntry[] {
  return teams
    .map((team) => ({
      entityId: team.id,
      name: team.name,
      points: team.memberIds.reduce((total, memberId) => total + getUserTotalPoints(memberId, activities), 0),
      memberCount: team.memberIds.filter((memberId) => users.some((user) => user.id === memberId)).length,
    }))
    .sort((left, right) => right.points - left.points || right.memberCount - left.memberCount)
    .map((entry, index) => ({
      entityId: entry.entityId,
      name: entry.name,
      points: entry.points,
      rank: index + 1,
    }));
}

export function buildWorkoutSuggestions(
  user: UserRecord,
  activities: ActivityRecord[],
  now = new Date(),
): WorkoutSuggestion[] {
  const recentActivities = getUserActivities(user.id, activities).filter((activity) => {
    const diff = now.getTime() - activity.loggedAt.getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  });

  const recentMinutes = recentActivities.reduce(
    (total, activity) => total + activity.durationMinutes,
    0,
  );
  const activityMix = new Set(recentActivities.map((activity) => activity.type));

  if (recentMinutes < 90) {
    return [
      {
        userId: user.id,
        title: 'Starter cardio circuit',
        description: 'Try 20 minutes of brisk walking and 10 minutes of bodyweight squats and planks.',
        intensity: 'light',
        focusArea: 'Consistency',
      },
      {
        userId: user.id,
        title: 'After-school movement break',
        description: 'Schedule a 25-minute jog or bike ride with a classmate to build a routine.',
        intensity: 'moderate',
        focusArea: 'Cardio',
      },
    ];
  }

  if (recentMinutes < 210) {
    const suggestions: WorkoutSuggestion[] = [
      {
        userId: user.id,
        title: 'Balanced weekly challenge',
        description: 'Add one interval run and one 30-minute strength session to build variety.',
        intensity: 'moderate',
        focusArea: 'Endurance',
      },
    ];

    if (!activityMix.has('workout')) {
      suggestions.push({
        userId: user.id,
        title: 'Strength booster',
        description: 'Complete 3 rounds of lunges, push-ups, and mountain climbers for total-body strength.',
        intensity: 'moderate',
        focusArea: 'Strength',
      });
    }

    return suggestions;
  }

  return [
    {
      userId: user.id,
      title: 'Active recovery day',
      description: 'Keep momentum with 20 minutes of yoga or an easy walk to let your body recharge.',
      intensity: 'light',
      focusArea: 'Recovery',
    },
    {
      userId: user.id,
      title: 'Skill variety session',
      description: 'Swap one cardio day for basketball drills or swimming to stay challenged without overtraining.',
      intensity: 'moderate',
      focusArea: 'Variety',
    },
  ];
}
