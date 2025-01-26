import { Document, Types } from "mongoose";

export interface BaseInterface{
    _is: string;
    createdAt :Date;
    updatedAt : Date;
}

export interface IBook extends BaseInterface{
    id:string;
    title: string;
    description: string;
    author: string;
    year: number;
    isbn: number;
    genre: string;
    thumbnail:string;
    userId: Types.ObjectId | string;
}

export type IBookDocument = IBook & Document;   