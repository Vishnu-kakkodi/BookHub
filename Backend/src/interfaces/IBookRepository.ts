import mongoose, { FilterQuery } from "mongoose";
import { IUserDocument } from "../types/userType";
import { IBaseRepository } from "./IBaseRepository";
import { IBookDocument } from "../types/bookType";

export type SearchQueryType = FilterQuery<{
    userName: string;
    email: string;
    phoneNumber: string;
    quizProgress: {
        rank: number;
    }
}>;

export type SearchBook = FilterQuery<{
    $or?: Array<{
        title?: { $regex: string; $options?: string };
        author?: { $regex: string; $options?: string };
    }>;
}>;

export interface IBookRepository extends IBaseRepository<IBookDocument> {    
    // Updated findbook method to support Elasticsearch query
    findbook(
        searchQuery: SearchBook,
        skip: number,
        limit: number,
        sortOptions: any
    ): Promise<{ book: IBookDocument[]; total: number }>

    findbooks(
        searchQuery: SearchBook,
        skip: number,
        limit: number,
        sortOptions: any
    ): Promise<{ book: IBookDocument[]; total: number }>

    // New Elasticsearch-specific methods
    indexBook(book: IBookDocument, userId: string): Promise<void>

    bookDelete(bookId: string): Promise<void>

    updateBook(bookData: any, bookId: string): Promise<any | null>



}