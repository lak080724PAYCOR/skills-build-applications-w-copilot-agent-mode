import { model, Schema } from 'mongoose';
import { TeamRecord } from '../types/domain';

const teamSchema = new Schema<TeamRecord>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    captainId: { type: String, required: true },
    memberIds: { type: [String], default: [] },
    teacherIds: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const TeamModel = model<TeamRecord>('Team', teamSchema);
