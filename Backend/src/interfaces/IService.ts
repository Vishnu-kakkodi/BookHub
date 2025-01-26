import { IBookDocument } from "../types/bookType"
import { IUserDocument } from "../types/userType"



export interface IService{
    register(email: string, password: string): Promise<any>
    login(email: string, password: string): Promise<IUserDocument | null>
    googleSign(email: string, userName: string, phoneNumber: string): Promise<any | null>
    createBook(bookData: any): Promise<any>
    bookList(page: number, limit: number, search: string, department: string, sort: string): Promise<{ book: IBookDocument[]; total: number; }>
    bookDelete(bookId: string): Promise<void>
    updateBook(courseData: any, bookId: string): Promise<any | null>


}