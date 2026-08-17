import { ActivityType } from '../types/domain';

const pointMultipliers: Record<ActivityType, number> = {
  running: 5,
  walking: 2,
  cycling: 4,
  workout: 4,
  swimming: 5,
  yoga: 3,
  basketball: 4,
};

export function calculateActivityPoints(
  type: ActivityType,
  durationMinutes: number,
  distanceKm = 0,
) {
  return Math.round(durationMinutes * pointMultipliers[type] + distanceKm * 10);
}
