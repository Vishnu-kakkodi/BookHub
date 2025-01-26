import { Document, Types } from "mongoose";

export interface BaseInterface{
    _is: string;
    createdAt :Date;
    updatedAt : Date;
}

export enum UserStatus {
    Active = 'active',
    Inactive = 'inactive',
}

export interface IUser extends BaseInterface{
    id:string;
    email: string;
    password: string;
}

export type IUserDocument = IUser & Document;   