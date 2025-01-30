"use strict";
// import { BaseRepository } from "./base.repository";
// import { BookModel } from "../modal/bookModel";
// import { IBookDocument } from "../types/bookType";
// import { IBookRepository, SearchBook } from "../interfaces/IBookRepository";
// import mongoose, { Model } from 'mongoose';
// import ElasticsearchClient from '../ElasticsearchClient';
// import { Client } from '@elastic/elasticsearch';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRepository = void 0;
// export class bookRepository extends BaseRepository<IBookDocument> implements IBookRepository {
//     private esClient: Client;
//     constructor() {
//         super(BookModel as Model<IBookDocument>);
//         this.esClient = ElasticsearchClient.getInstance();
//     }
//     async create(data: Partial<IBookDocument>): Promise<IBookDocument> {
//         try {
//             const book = await this.model.create(data);
//             await book.save();
//             const userId = data.userId as string
//             console.log("Elastic Search started");
//             await this.indexBook(book,userId);
//             return book.toObject();
//         } catch (error) {
//             console.error('Book creation error:', error);
//             throw error;
//         }
//     }
//     async indexBook(book: IBookDocument, userId: string) {
//         try {
//             if (!book || !book._id) {
//                 console.error('Invalid book object for indexing');
//                 return;
//             }
//             await this.esClient.index({
//                 index: 'books',
//                 id: book._id.toString(), 
//                 body: {
//                     title: book.title,
//                     userId: userId,
//                     author: book.author, 
//                     createdAt: book.createdAt || new Date()
//                 }
//             });
//         } catch (error) {
//             console.error('Error indexing book:', error);
//         }
//     }
//     async findbook(
//         searchQuery: SearchBook,
//         skip: number,
//         limit: number,
//         sortOptions: any = { createdAt: -1 }
//     ): Promise<{ book: IBookDocument[]; total: number }> {
//         try {
//             const client = this.esClient;
//             await client.info(); 
//             const esResult = await client.search({
//                 index: 'books',
//                 body: {
//                     query: this.buildElasticsearchQuery(searchQuery),
//                     sort: [{ [Object.keys(sortOptions)[0]]: Object.values(sortOptions)[0] === -1 ? 'desc' : 'asc' }],
//                     from: skip,
//                     size: limit
//                 }
//             });
//             const bookIds = esResult.hits.hits.map((hit: any) => new mongoose.Types.ObjectId(hit._id));
//             const books = await BookModel.find({ _id: { $in: bookIds } });
// const total =
// esResult.hits.total &&
// (typeof esResult.hits.total === 'number'
//     ? esResult.hits.total
//     : esResult.hits.total.value) || 0;
//             console.log("Elastic search working")
//             return { book: books, total };
//         } catch (error) {
//             console.error('Elasticsearch search error:', error);
//             return this.fallbackMongoSearch(searchQuery, skip, limit, sortOptions);
//         }
//     }
//     // async findbooks(
//     //     searchQuery: SearchBook,
//     //     skip: number,
//     //     limit: number,
//     //     sortOptions: any = { createdAt: -1 }
//     // ): Promise<{ book: IBookDocument[]; total: number }> {
//     //     try {
//     //         const client = this.esClient;
//     //         await client.info(); 
//     //         const esResult = await client.search({
//     //             index: 'books',
//     //             body: {
//     //                 query: this.buildElasticsearchQuery(searchQuery),
//     //                 sort: [{ [Object.keys(sortOptions)[0]]: Object.values(sortOptions)[0] === -1 ? 'desc' : 'asc' }],
//     //                 from: skip,
//     //                 size: limit
//     //             }
//     //         });
//     //         const bookIds = esResult.hits.hits.map((hit: any) => new mongoose.Types.ObjectId(hit._id));
//     //         const books = await BookModel.find({ _id: { $in: bookIds } });
//     //         const total =
//     //         esResult.hits.total &&
//     //         (typeof esResult.hits.total === 'number'
//     //             ? esResult.hits.total
//     //             : esResult.hits.total.value) || 0;
//     //         console.log("Elastic search working")
//     //         return { book: books, total };
//     //     } catch (error) {
//     //         console.error('Elasticsearch search error:', error);
//     //         return this.fallbackMongoSearch(searchQuery, skip, limit, sortOptions);
//     //     }
//     // }
//     private async fallbackMongoSearch(searchQuery: SearchBook,skip: number, limit: number, sortOptions: any): Promise<{ book: IBookDocument[]; total: number }> {
//         console.log(searchQuery,"Search");
//         let book;
//         if(searchQuery){
//             book = await this.model
//             .find(searchQuery)
//             .sort(sortOptions)
//             .skip(skip)
//             .limit(limit);
//         }else{
//             book = await this.model
//             .find({})
//             .sort(sortOptions)
//             .skip(skip)
//             .limit(limit);
//         }
//         const total: number = await this.model.countDocuments();
//         return { book, total };
//     }
//     // private buildElasticsearchQuery(mongoQuery: any) {
//     //     const esQuery: any = { bool: { must: [] } };
//     //     if (mongoQuery.$or) {
//     //         const shouldClauses = mongoQuery.$or.map((clause: any) => {
//     //             if (clause.title) return { match: { title: clause.title.$regex.replace(/\//g, '') } };
//     //             if (clause.department) return { match: { department: clause.department.$regex.replace(/\//g, '') } };
//     //             if (clause.instructor) return { match: { instructor: clause.instructor.$regex.replace(/\//g, '') } };
//     //         });
//     //         esQuery.bool.should = shouldClauses;
//     //         esQuery.bool.minimum_should_match = 1;
//     //     }
//     //     if (mongoQuery.department) {
//     //         esQuery.bool.must.push({
//     //             terms: { department: mongoQuery.department.$in }
//     //         });
//     //     }
//     //     return esQuery;
//     // }
//     private buildElasticsearchQuery(mongoQuery: any) {
//         const esQuery: any = { bool: { must: [] } };
//         // Handle $or queries (should clauses)
//         if (mongoQuery.$or) {
//             const shouldClauses = mongoQuery.$or.map((clause: any) => {
//                 if (clause.title) {
//                     return { match: { title: clause.title.$regex.replace(/\//g, '') } };
//                 }
//                 if (clause.department) {
//                     return { match: { department: clause.department.$regex.replace(/\//g, '') } };
//                 }
//                 if (clause.instructor) {
//                     return { match: { instructor: clause.instructor.$regex.replace(/\//g, '') } };
//                 }
//             });
//             esQuery.bool.should = shouldClauses;
//             esQuery.bool.minimum_should_match = 1;
//         }
//         // Handle department condition
//         if (mongoQuery.department) {
//             esQuery.bool.must.push({
//                 terms: { department: mongoQuery.department.$in }
//             });
//         }
//         // Handle userId condition
//         if (mongoQuery.userId) {
//             esQuery.bool.must.push({
//                 term: { userId: mongoQuery.userId }
//             });
//         }
//         return esQuery;
//     }
//     async bookDelete(bookId: string): Promise<void> {
//         try {
//             const bookObjectId = new mongoose.Types.ObjectId(bookId);
//             await this.model.findByIdAndDelete(bookObjectId);
//             await this.esClient.delete({
//                 index: 'books',
//                 id: bookId,
//             });
//             console.log(`Book with ID ${bookId} deleted from Elasticsearch`);
//         } catch (error) {
//             console.error('Error deleting book:', error);
//             throw error;
//         }
//     }
//     async updateBook(bookData: any, bookId: string): Promise<any | null> {
//         try {
//             const id = new mongoose.Types.ObjectId(bookId);
//             const existingBook = await this.model.findById(id);
//             if (!existingBook) {
//                 return null;
//             }
//             if (bookData.title) existingBook.title = bookData.title;
//             if (bookData.author) existingBook.author = bookData.author;
//             if (bookData.description) existingBook.description = bookData.description;
//             if (bookData.genre) existingBook.genre = bookData.genre;
//             if (bookData.isbn) existingBook.isbn = bookData.isbn;
//             const updatedBook = await existingBook.save();
//             await this.esClient.update({
//                 index: 'books',
//                 id: bookId,
//                 body: {
//                     doc: {
//                         title: updatedBook.title,
//                         author: updatedBook.author,
//                         description: updatedBook.description,
//                         genre: updatedBook.genre,
//                         isbn: updatedBook.isbn,
//                         updatedAt: updatedBook.updatedAt || new Date(),
//                     },
//                 },
//             });
//             return updatedBook;
//         } catch (error) {
//             console.error('Error updating book:', error);
//             throw error;
//         }
//     }  
// }
const mongoose_1 = __importDefault(require("mongoose"));
const bookModel_1 = require("../modal/bookModel");
const base_repository_1 = require("./base.repository");
const ElasticsearchClient_1 = __importDefault(require("../ElasticsearchClient"));
class bookRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(bookModel_1.BookModel);
        this.esClient = ElasticsearchClient_1.default.getInstance();
    }
    async create(data) {
        try {
            const book = await this.model.create(data);
            await book.save();
            const userId = data.userId;
            console.log("Elastic Search started");
            await this.indexBook(book, userId);
            return book.toObject();
        }
        catch (error) {
            console.error("Book creation error:", error);
            throw error;
        }
    }
    async indexBook(book, userId) {
        try {
            if (!book || !book._id) {
                console.error("Invalid book object for indexing");
                return;
            }
            await this.esClient.index({
                index: "books",
                id: book._id.toString(),
                body: {
                    title: book.title,
                    userId: userId,
                    author: book.author,
                    createdAt: book.createdAt || new Date(),
                },
            });
        }
        catch (error) {
            console.error("Error indexing book:", error);
        }
    }
    async findbook(searchQuery, skip, limit, sortOptions = { createdAt: -1 }) {
        try {
            const client = this.esClient;
            await client.info();
            const esResult = await client.search({
                index: 'books',
                body: {
                    query: this.buildElasticsearchQuery(searchQuery),
                    sort: [{ [Object.keys(sortOptions)[0]]: Object.values(sortOptions)[0] === -1 ? 'desc' : 'asc' }],
                    from: skip,
                    size: limit
                }
            });
            const bookIds = esResult.hits.hits.map((hit) => new mongoose_1.default.Types.ObjectId(hit._id));
            const books = await bookModel_1.BookModel.find({ _id: { $in: bookIds } });
            const total = esResult.hits.total &&
                (typeof esResult.hits.total === 'number'
                    ? esResult.hits.total
                    : esResult.hits.total.value) || 0;
            return { book: books, total };
        }
        catch (error) {
            console.error('Elasticsearch search error:', error);
            return this.fallbackMongoSearch(searchQuery, skip, limit, sortOptions);
        }
    }
    async fallbackMongoSearch(searchQuery, skip, limit, sortOptions) {
        console.log(searchQuery, "Search");
        const book = await this.model.find(searchQuery).sort(sortOptions).skip(skip).limit(limit);
        const total = await this.model.countDocuments();
        return { book, total };
    }
    async bookDelete(bookId) {
        try {
            await this.model.findByIdAndDelete(bookId);
            await this.esClient.delete({ index: "books", id: bookId });
            console.log(`Book with ID ${bookId} deleted from Elasticsearch`);
        }
        catch (error) {
            console.error("Error deleting book:", error);
            throw error;
        }
    }
    async updateBook(bookData, bookId) {
        try {
            const existingBook = await this.model.findById(bookId);
            if (!existingBook)
                return null;
            Object.assign(existingBook, bookData);
            const updatedBook = await existingBook.save();
            await this.esClient.update({
                index: "books",
                id: bookId,
                body: { doc: updatedBook },
            });
            return updatedBook;
        }
        catch (error) {
            console.error("Error updating book:", error);
            throw error;
        }
    }
    buildElasticsearchQuery(mongoQuery) {
        const esQuery = { bool: { must: [] } };
        if (mongoQuery.$or) {
            const shouldClauses = mongoQuery.$or.map((clause) => {
                if (clause.title)
                    return { match: { title: clause.title.$regex.replace(/\//g, "") } };
                if (clause.author)
                    return { match: { author: clause.author.$regex.replace(/\//g, "") } };
            });
            esQuery.bool.should = shouldClauses;
            esQuery.bool.minimum_should_match = 1;
        }
        if (mongoQuery.userId) {
            esQuery.bool.must.push({ term: { userId: mongoQuery.userId } });
        }
        return esQuery;
    }
}
exports.bookRepository = bookRepository;
//# sourceMappingURL=book.repository.js.map