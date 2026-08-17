import { model, Schema } from 'mongoose';
import { WorkoutSuggestion } from '../types/domain';

const workoutSchema = new Schema<WorkoutSuggestion>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    intensity: { type: String, enum: ['light', 'moderate', 'high'], required: true },
    focusArea: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const WorkoutModel = model<WorkoutSuggestion>('Workout', workoutSchema);
