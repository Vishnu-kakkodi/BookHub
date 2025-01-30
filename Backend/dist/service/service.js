"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
const mongoose_1 = __importDefault(require("mongoose"));
const passwordUtils_1 = require("../utils/passwordUtils");
class Service {
    constructor(userRepository, bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }
    async register(email, password, userName) {
        try {
            const hashPassword = await passwordUtils_1.PasswordUtils.hashPassword(password);
            const data = {
                userName: userName,
                email: email,
                password: hashPassword
            };
            console.log(data);
            return await this.userRepository.create(data);
        }
        catch (error) {
            throw error;
        }
    }
    async googleSign(email, userName, phoneNumber) {
        try {
            const user = await this.userRepository.findByEmail(email);
            console.log(user);
            if (!user) {
                const hashPassword = await passwordUtils_1.PasswordUtils.hashPassword(userName + "@123");
                let userDetail = {
                    email,
                    userName,
                    password: hashPassword,
                    phoneNumber,
                };
                const user = await this.userRepository.create(userDetail);
                let id = user._id;
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
        }
        catch (error) {
            throw error;
        }
    }
    async createBook(bookData) {
        try {
            const response = await this.bookRepository.create(bookData);
            if (!response) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            return response;
        }
        catch (error) {
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
    async bookList(page, limit, search, department, sort) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            let sortOptions = {};
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
        }
        catch (error) {
            throw error;
        }
    }
    async myBookList(page, limit, search, department, sort, userId) {
        try {
            const skip = (page - 1) * limit;
            const id = new mongoose_1.default.Types.ObjectId(userId);
            let query = { userId: id };
            let sortOptions = {};
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
        }
        catch (error) {
            throw error;
        }
    }
    async bookDelete(bookId) {
        try {
            return await this.bookRepository.bookDelete(bookId);
        }
        catch (error) {
            throw error;
        }
    }
    async updateBook(bookData, bookId) {
        try {
            return await this.bookRepository.updateBook(bookData, bookId);
        }
        catch (error) {
            throw error;
        }
    }
    async login(email, password) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.USER_NOT_FOUND);
            }
            if (user) {
                const validPassword = await passwordUtils_1.PasswordUtils.comparePassword(password, user.password);
                if (!validPassword) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.INVALID_CREDENTIALS);
                }
            }
            return { ...user.toObject() };
        }
        catch (error) {
            throw error;
        }
    }
    async profilePhoto(userId, fileLocation) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.USER_NOT_FOUND);
            }
            if (user) {
                user.profilePhoto = fileLocation;
                user.save();
            }
            return { ...user.toObject() };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map