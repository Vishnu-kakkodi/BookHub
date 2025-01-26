import { Schema, model } from 'mongoose';
import { IUserDocument, UserStatus } from '../types/userType';

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', userSchema);
