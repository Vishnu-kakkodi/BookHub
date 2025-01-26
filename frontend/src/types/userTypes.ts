import { Document, Types } from "mongoose";


export interface Institute{
    _id:string;
    collegeName: string;
    instituteEmail: string;
    collegeCode: string;
    country:string;
    state: string;
    district: string;
    applicationId: string;
    status: InstituteStatus;
    department: string[];
    documentUrl: string;
    accessToken?: string;
    refreshToken?: string;
    totalStudents: number;
    createdAt :Date;
    updatedAt : Date;
}

export enum InstituteStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Reject = 'Rejected',
  Pending = 'Pending',
  Verify = 'Verify'
}

export interface InstituteResponse {
    id: string;
    collegeName: string;
    instituteEmail: string;
    applicationId: string;
    status: InstituteStatus;
    totalStudents: number;
  }
  

export type InstituteDocument = Institute & Document;
export interface Review {
  courseId: Types.ObjectId
  userReviews: {
    userId: Types.ObjectId
    comment: string;
    rating: number;
    createdAt?: Date;
  }[];
  averageRating: number;
}

export type ReviewDocument = Review & Document;

export interface User{
    _id:string | null;
    userName:string;
    email:string;
    password:string;
    confirmPassword?:string;
    phoneNumber:string;
    profilePhoto?:string;  
}

export interface SignUpUser{
  userName:string;
  email:string;
  password:string;
  confirmPassword?:string;
  phoneNumber:string;
  profilePhoto?:string;  
}

export interface UserLogin{
    email:string;
    password:string;
}

export interface googleSign{
  email:string;
}

export interface ResponseData{
        success: boolean;
        message: string;
}

export interface InstituteViewQueryResponse {
    message:string,
    data: {
      institutes: InstituteDocument;
    };
  }

  export interface ReviewResponse{
    message:string;
    data:{
      response: ReviewDocument,
      total: number;
    }
}
