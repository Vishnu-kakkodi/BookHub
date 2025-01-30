// import { BaseRepository } from "./base.repository";
// import { UserModel } from "../modal/userModel";
// import { IUserDocument } from "../types/userType";
// import mongoose, { FilterQuery } from 'mongoose';
// import { IUserRepository } from "../interfaces/IUserRepository";

// interface UpdateProfileData {
//     userName?: string;
//     phoneNumber?: string;
//     address?: string;
//     [key: string]: any;  
// }

// export type SearchQueryType = FilterQuery<{
//     userName: string;
//     email: string;
//     phoneNumber: string;
//     quizProgress:{
//         rank:number;
//     }
//   }>;


// export class userRepository extends BaseRepository<IUserDocument> implements IUserRepository {
//     constructor(){
//         super(UserModel as Model<IUserDocument>);
//     }

//     async findByEmail(email: string): Promise <IUserDocument | null >{
//         try{
//             return await this.model.findOne({email});
//         }catch(error){
//             throw error;
//         }
//     } 

//     async findById(userId : string): Promise<IUserDocument | null> { 
//         try {
//             const id = new mongoose.Types.ObjectId(userId)   
//             const user =  await this.model.findById({_id:id});
//             return user;      
//         } catch (error) {
//             throw error;
//         }
//     }
// }


import { Model } from "mongoose";
import { UserModel } from "../modal/userModel";
import { IUserDocument } from "../types/userType";
import { IUserRepository } from "../interfaces/IUserRepository";
import { BaseRepository } from "./base.repository";

export class userRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor() {
        super(UserModel as Model<IUserDocument>);
    }

    async findByEmail(email: string): Promise<IUserDocument | null> {
        try {
            return await this.model.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async findById(userId: string): Promise<IUserDocument | null> {
        try {
            return await this.model.findById(userId);
        } catch (error) {
            throw error;
        }
    }
}
