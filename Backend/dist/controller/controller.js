"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class controller {
    constructor(service) {
        this.createBook = async (req, res, next) => {
            try {
                console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
                console.log(req.body);
                const bookData = req.body;
                if (!bookData) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                if (req.file) {
                    bookData.thumbnail = req.file.location;
                }
                else {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                // if (!bookData.institutionId) {
                //     throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.INSTITUTION_ID_REQUIRED);
                // }
                await this.service.createBook(bookData);
                res.json({
                    status: statusCode_1.default.SUCCESS,
                    message: message_1.default.SUCCESS.COURSE_CREATED,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.bookList = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 2;
                const search = req.query.search;
                const filter = req.query.filter;
                const sort = req.query.sort;
                console.log(search, "S");
                console.log("sss");
                const { book, total } = await this.service.bookList(page, limit, search, filter, sort);
                console.log(total, "total");
                res.status(201).json({
                    book,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.myBookList = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 4;
                const search = req.query.search;
                const filter = req.query.filter;
                const sort = req.query.sort;
                const userId = req.query.userId;
                console.log(userId, "ooo");
                const { book, total } = await this.service.myBookList(page, limit, search, filter, sort, userId);
                res.status(201).json({
                    book,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.bookDelete = async (req, res, next) => {
            try {
                const bookId = req.query.bookId;
                if (!bookId) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                await this.service.bookDelete(bookId);
                res.json({
                    status: statusCode_1.default.SUCCESS,
                    message: message_1.default.SUCCESS.COURSE_DELETED
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateBook = async (req, res, next) => {
            try {
                const bookData = req.body;
                console.log(bookData);
                const bookId = req.query.bookId;
                if (!bookData) {
                    throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
                }
                await this.service.updateBook(bookData, bookId);
                res.status(201).json({
                    status: statusCode_1.default.SUCCESS,
                    message: message_1.default.SUCCESS.COURSE_UPDATED
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.service = service;
    }
    async register(req, res, next) {
        try {
            console.log("Hai");
            const { email, password, userName } = req.body;
            const user = await this.service.register(email, password, userName);
            if (!user) {
                res.json({ STATUS: statusCode_1.default.UNAUTHORIZED, MESSAGE: message_1.default.ERROR.UNAUTHORIZED });
            }
            res.status(200).json({ status: statusCode_1.default.SUCCESS, message: message_1.default.SUCCESS.LOGIN_SUCCESS, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const userDetails = await this.service.login(req.body.email, req.body.password);
            if (!userDetails) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.USER_NOT_FOUND);
            }
            res.json({ status: statusCode_1.default.SUCCESS, message: message_1.default.SUCCESS.LOGIN_SUCCESS, data: userDetails });
        }
        catch (error) {
            next(error);
        }
    }
    async googleSign(req, res, next) {
        try {
            const { email, userName, phoneNumber } = req.body;
            console.log(email, userName, "llllllllllllllllllllllllllllllll");
            const userDetails = await this.service.googleSign(email, userName, phoneNumber);
            if (!userDetails) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.USER_NOT_FOUND);
            }
            const { accessToken, refreshToken, ...user } = userDetails;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
            // setCookie(res, 'user', Token);
            res.json({ status: statusCode_1.default.CREATED, message: message_1.default.SUCCESS.USER_CREATED, data: userDetails });
        }
        catch (error) {
            next(error);
        }
    }
    async profilePhoto(req, res, next) {
        try {
            console.log("Hai");
            let fileLocation = req.file.location;
            const userId = req.body.userId;
            console.log(userId, "UserId");
            const user = await this.service.profilePhoto(userId, fileLocation);
            if (!user) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            res.status(200).json({
                status: statusCode_1.default.SUCCESS,
                message: message_1.default.SUCCESS.DATA_RETRIEVED,
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.controller = controller;
//# sourceMappingURL=controller.js.map