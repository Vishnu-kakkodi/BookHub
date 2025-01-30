import { Document, Types } from "mongoose";

export interface IBook{
    id:string;
    title: string;
    description: string;
    author: string;
    year: number;
    isbn: string;
    genre: string;
    thumbnail:string;
    userId: Types.ObjectId | string;
}

export type BookType = IBook & Document;   