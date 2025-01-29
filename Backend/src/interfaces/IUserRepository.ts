import mongoose, { FilterQuery } from "mongoose";
import { IUserDocument } from "../types/userType";
import { IBaseRepository } from "./IBaseRepository";

export type SearchQueryType = FilterQuery<{
    userName: string;
    email: string;
    phoneNumber: string;
    quizProgress:{
        rank:number;
    }
  }>;
  interface UpdateProfileData {
    userName?: string;
    phoneNumber?: string;
    address?: string;
    [key: string]: any;  
}

export interface IUserRepository extends IBaseRepository<IUserDocument>{

  findByEmail(email: string): Promise <IUserDocument | null >
  findById(userId : string): Promise<IUserDocument | null>



}