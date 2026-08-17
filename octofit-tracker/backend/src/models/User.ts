import { model, Schema } from 'mongoose';
import { userRoles, UserRecord } from '../types/domain';

const userSchema = new Schema<UserRecord>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: userRoles, required: true },
    grade: { type: String },
    favoriteActivity: { type: String },
    teamIds: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const UserModel = model<UserRecord>('User', userSchema);
