import { model, Schema } from 'mongoose';
import { ActivityRecord, activityTypes } from '../types/domain';

const activitySchema = new Schema<ActivityRecord>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    type: { type: String, enum: activityTypes, required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, default: 0, min: 0 },
    points: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
    loggedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const ActivityModel = model<ActivityRecord>('Activity', activitySchema);
