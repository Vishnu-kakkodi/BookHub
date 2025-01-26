import { BaseRepository } from "./base.repository";
import { UserModel } from "../modal/userModel";
import { IUserDocument } from "../types/userType";
import { HttpException } from "../middleware/error.middleware";
import mongoose, { FilterQuery } from 'mongoose';
import { IUserRepository } from "../interfaces/IUserRepository";

interface UpdateProfileData {
    userName?: string;
    phoneNumber?: string;
    address?: string;
    [key: string]: any;  
}

export type SearchQueryType = FilterQuery<{
    userName: string;
    email: string;
    phoneNumber: string;
    quizProgress:{
        rank:number;
    }
  }>;


export class userRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor(){
        super(UserModel);
    }

    async findByEmail(email: string): Promise <IUserDocument | null >{
        try{
            return await this.model.findOne({email});
        }catch(error){
            throw error;
        }
    } 
}