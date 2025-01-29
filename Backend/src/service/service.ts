import { IUserDocument } from "../types/userType";
import {IUserRepository} from '../interfaces/IUserRepository'
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from '../constants/statusCode';
import MESSAGES from '../constants/message';
import { IService } from "../interfaces/IService";
import { log } from "console";
import mongoose, { FilterQuery } from "mongoose";
import { IBookRepository } from "../interfaces/IBookRepository";
import { IBookDocument } from "../types/bookType";
import { Client, estypes } from '@elastic/elasticsearch';
import { PasswordUtils } from "../utils/passwordUtils";





class Service implements IService {
    private readonly userRepository: IUserRepository;
    private readonly bookRepository: IBookRepository;


    constructor(userRepository: IUserRepository, bookRepository: IBookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
     }

    async register(email:string, password: string): Promise<any> {
        try {
            const hashPassword = await PasswordUtils.hashPassword(password);

            const data = {
                email: email,
                password: hashPassword
            }
            console.log(data);
            return await this.userRepository.create(data);
        } catch (error) {
            throw error
        }
    }


    async googleSign(email: string, userName: string, phoneNumber: string): Promise<any | null> {
        try {
            const user = await this.userRepository.findByEmail(email)

            if (!user) {
                const hashPassword = await PasswordUtils.hashPassword(userName+"@123");

                let userDetail = {
                    email,
                    userName,
                    password: hashPassword,
                    phoneNumber,
                }
                const user = await this.userRepository.create(userDetail);
                let id: any = user._id
                // const accessToken = helperFunction.accesstoken(id, "user");
                // const refreshToken = helperFunction.refreshtoken(id, "user");

                return user;

            }

            // if (user) {
            //     if (user.status === 'inactive') {
            //         throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.ACCOUNT_LOCKED);
            //     }
            // }

            // const accessToken = helperFunction.accesstoken(user.id, "user");
            // const refreshToken = helperFunction.refreshtoken(user.id, "user");

            return user;

        } catch (error) {
            throw error
        }
    }

    async createBook(bookData: any): Promise<any> {
        try {
            const response = await this.bookRepository.create(bookData);
            if (!response) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            return response;
        } catch (error) {
            throw error;
        }
    }


    //   async bookList(page: number, limit: number, search: string, department: string, sort: string): Promise<{ book: IBookDocument[]; total: number; }> {
    //     try {

    //       const skip = (page - 1) * limit;
    //       let query: FilterQuery<any> = {};
    //       let sortOptions: Record<string, 1 | -1> = {};
    
    //       if (search && search.trim() !== '') {
    //         query.$or = [
    //           { title: { $regex: search, $options: 'i' } },
    //           { department: { $regex: search, $options: 'i' } },
    //           { instructor: { $regex: search, $options: 'i' } }
    //         ];
    //       }
    
    //       if (department && department.trim() !== '') {
    //         const departmentArray = department.split(',').map((dep) => dep.trim());
    
    //         query.department = { $in: departmentArray };
    //       }
    
    //       console.log("Query:", query);
    
    //       switch (sort) {
    //         case 'newest':
    //           sortOptions = { createdAt: -1 };
    //           break;
    //         case 'oldest':
    //           sortOptions = { createdAt: 1 };
    //           break;
    //         default:
    //           sortOptions = { createdAt: -1 };
    //       }
    
    //       return await this.bookRepository.findbook(query, skip, limit, sortOptions);
    
    //     } catch (error) {
    //       throw error;
    //     }
    //   }


    async bookList(page: number, limit: number, search: string, department: string, sort: string): Promise<{ book: IBookDocument[]; total: number; }> {
        try {
            const skip = (page - 1) * limit;
            let query: FilterQuery<any> = {};
            let sortOptions: Record<string, 1 | -1> = {};
    
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } }
                ];
            }
    
            switch (sort) {
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortOptions = { createdAt: 1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
    
            return await this.bookRepository.findbook(query, skip, limit, sortOptions);
        } catch (error) {
            throw error;
        }
    }

    async myBookList(page: number, limit: number, search: string, department: string, sort: string, userId: string): Promise<{ book: IBookDocument[]; total: number; }> {
        try {
            const skip = (page - 1) * limit;
            const id = new mongoose.Types.ObjectId(userId)
            let query: FilterQuery<any> = { userId: id };
            let sortOptions: Record<string, 1 | -1> = {};
    
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } }
                ];
            }
    
            switch (sort) {
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortOptions = { createdAt: 1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
    
            return await this.bookRepository.findbook(query, skip, limit, sortOptions);
        } catch (error) {
            throw error;
        }
    }

    async bookDelete(bookId: string): Promise<void> {
        try {
          return await this.bookRepository.bookDelete(bookId);
        } catch (error) {
          throw error;
        }
      }

      async updateBook(bookData: any, bookId: string): Promise<any | null> {
        try {
          return await this.bookRepository.updateBook(bookData, bookId);
        } catch (error) {
          throw error;
        }
      }

      async login(email: string, password: string): Promise<IUserDocument | null> {
        try {

            const user = await this.userRepository.findByEmail(email)
            if (!user) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.USER_NOT_FOUND);
            }

            if (user) {
                const validPassword = await PasswordUtils.comparePassword(password, user.password);
                if (!validPassword) {
                    throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.INVALID_CREDENTIALS);
                }
            }


            return { ...user.toObject()};

        } catch (error) {
            throw error
        }
    }


    async profilePhoto(userId: string, fileLocation: string): Promise<IUserDocument | null> {
        try {
            const user = await this.userRepository.findById(userId)
            if (!user) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.USER_NOT_FOUND);
            }

            if (user) {
                user.profilePhoto = fileLocation;
                user.save();
            }


            return { ...user.toObject() };

        } catch (error) {
            throw error
        }
    }
      
}

export default Service;