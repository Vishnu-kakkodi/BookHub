// import { BaseRepository } from "./base.repository";
// import { UserModel } from "../modal/userModel";
// import { IUserDocument } from "../types/userType";
// import { HttpException } from "../middleware/error.middleware";
// import mongoose, { FilterQuery } from 'mongoose';
// import { IUserRepository } from "../interfaces/IUserRepository";
// import { IBookDocument } from "../types/bookType";
// import { BookModel } from "../modal/bookModel";
// import { IBookRepository } from "../interfaces/IBookRepository";

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

//   export type SearchBook = FilterQuery<{
//     title: string;
// }>;


// export class bookRepository extends BaseRepository<IBookDocument> implements IBookRepository {
//     constructor(){
//         super(BookModel);
//     }

//     async findByEmail(email: string): Promise <IUserDocument | null >{
//         try{
//             return await this.model.findOne({email});
//         }catch(error){
//             throw error;
//         }
//     } 

//     async findbook(
//         searchQuery: SearchBook,
//         skip: number,
//         limit: number,
//         sortOptions: any = { createdAt: -1 }
//     ): Promise<{ book: IBookDocument[]; total: number }> {
//         try {
//             const book = await this.model
//                 .find()
//                 .sort(sortOptions)
//                 .skip(skip)
//                 .limit(limit)

//             const total: number = await this.model.countDocuments();

//             return { book, total };
//         } catch (error) {
//             throw error;
//         }
//     }
// }


import { BaseRepository } from "./base.repository";
import { BookModel } from "../modal/bookModel";
import { IBookDocument } from "../types/bookType";
import { IBookRepository, SearchBook } from "../interfaces/IBookRepository";
import mongoose, { FilterQuery } from 'mongoose';
import ElasticsearchClient from '../ElasticsearchClient';
import { Client } from '@elastic/elasticsearch';
import e from "express";


export class bookRepository extends BaseRepository<IBookDocument> implements IBookRepository {
    private esClient: Client;

    constructor() {
        super(BookModel);
        this.esClient = ElasticsearchClient.getInstance();
    }

    async create(data: Partial<IBookDocument>): Promise<IBookDocument> {
        try {
            // Create in MongoDB
            const book = await this.model.create(data);
            
            // Ensure book is saved before indexing
            await book.save();
            
            // Index in Elasticsearch
            await this.indexBook(book);
            
            return book.toObject();
        } catch (error) {
            console.error('Book creation error:', error);
            throw error;
        }
    }
    
    async indexBook(book: IBookDocument) {
        try {
            // Ensure book and _id exist
            if (!book || !book._id) {
                console.error('Invalid book object for indexing');
                return;
            }
    
            await this.esClient.index({
                index: 'books',
                id: book._id.toString(), // Use _id instead of id
                body: {
                    title: book.title,
                    author: book.author, // Ensure this matches your schema
                    createdAt: book.createdAt || new Date()
                }
            });
        } catch (error) {
            console.error('Error indexing book:', error);
        }
    }

    async findbook(
        searchQuery: SearchBook,
        skip: number,
        limit: number,
        sortOptions: any = { createdAt: -1 }
    ): Promise<{ book: IBookDocument[]; total: number }> {
        try {
            // Add connection check
            return this.fallbackMongoSearch(searchQuery, skip, limit, sortOptions);

            // const client = this.esClient;
            // await client.info(); // Verify connection before search
    
            // const esResult = await client.search({
            //     index: 'books',
            //     body: {
            //         query: this.buildElasticsearchQuery(searchQuery),
            //         sort: [{ [Object.keys(sortOptions)[0]]: Object.values(sortOptions)[0] === -1 ? 'desc' : 'asc' }],
            //         from: skip,
            //         size: limit
            //     }
            // });
    
            // const bookIds = esResult.hits.hits.map((hit: any) => new mongoose.Types.ObjectId(hit._id));
            // const books = await BookModel.find({ _id: { $in: bookIds } });
            // const total = esResult.hits.total as number;
    
            // return { book: books, total };
        } catch (error) {
            console.error('Elasticsearch search error:', error);
            return this.fallbackMongoSearch(searchQuery, skip, limit, sortOptions);
        }
    }

    private async fallbackMongoSearch(searchQuery: SearchBook,skip: number, limit: number, sortOptions: any): Promise<{ book: IBookDocument[]; total: number }> {
        console.log(searchQuery,"Search");
        let book;
        if(searchQuery){
            book = await this.model
            .find(searchQuery)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
        }else{
            book = await this.model
            .find({})
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
        }
    
        const total: number = await this.model.countDocuments();
        return { book, total };
    }

    private buildElasticsearchQuery(mongoQuery: any) {
        const esQuery: any = { bool: { must: [] } };

        if (mongoQuery.$or) {
            const shouldClauses = mongoQuery.$or.map((clause: any) => {
                if (clause.title) return { match: { title: clause.title.$regex.replace(/\//g, '') } };
                if (clause.department) return { match: { department: clause.department.$regex.replace(/\//g, '') } };
                if (clause.instructor) return { match: { instructor: clause.instructor.$regex.replace(/\//g, '') } };
            });
            esQuery.bool.should = shouldClauses;
            esQuery.bool.minimum_should_match = 1;
        }

        if (mongoQuery.department) {
            esQuery.bool.must.push({
                terms: { department: mongoQuery.department.$in }
            });
        }

        return esQuery;
    }


    async bookDelete(bookId: string): Promise<void> {
        try {
            const bookObjectId = new mongoose.Types.ObjectId(bookId);
    
            await this.model.findByIdAndDelete(bookObjectId);
    
            return; 
        } catch (error) {
            throw error; 
        }
    }


    async updateBook(bookData: any, bookId: string): Promise<any | null> {
        try {
            const id = new mongoose.Types.ObjectId(bookId)
            const existingBook = await this.model.findById(id);
            console.log(existingBook,"E")
            console.log(bookData);
            if (!existingBook) {
                return null;
            }
            if (bookData.title) {
                existingBook.title = bookData.title
            }
            if (bookData.author) {
                existingBook.author = bookData.author
            }
            if (bookData.description) {
                existingBook.description = bookData.description
            }
            if (bookData.genre) {
                existingBook.genre = bookData.genre
            }

            if (bookData.isbn) {
                existingBook.isbn = bookData.isbn;
            }

            return await existingBook.save();
        } catch (error) {
            throw error;
        }
    }
    
}