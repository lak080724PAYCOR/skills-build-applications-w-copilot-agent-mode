import { model, Schema } from 'mongoose';
import { LeaderboardSnapshotRecord } from '../types/domain';

const leaderboardEntrySchema = new Schema(
  {
    entityId: { type: String, required: true },
    name: { type: String, required: true },
    points: { type: Number, required: true },
    rank: { type: Number, required: true },
  },
  { _id: false },
);

const leaderboardSnapshotSchema = new Schema<LeaderboardSnapshotRecord>(
  {
    scope: { type: String, enum: ['individual', 'team'], required: true },
    entries: { type: [leaderboardEntrySchema], default: [] },
    generatedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const LeaderboardSnapshotModel = model<LeaderboardSnapshotRecord>(
  'LeaderboardSnapshot',
  leaderboardSnapshotSchema,
);
