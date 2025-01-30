import { Schema, model } from 'mongoose';
import { IUserDocument, UserStatus } from '../types/userType';

const userSchema = new Schema<IUserDocument>(
  {
    userName: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, required: false },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', userSchema);
