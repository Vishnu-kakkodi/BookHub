import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error.middleware";
import { IService } from "../interfaces/IService";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";


export class controller {
    private service: IService;
    constructor(
        service: IService,
    ) { 
        this.service = service;
    }

    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log("Hai")
            const { email, password } = req.body;
            console.log(email,password)
            const user = await this.service.register(email,password);
            if (!user) {
                res.json({STATUS:STATUS_CODES.UNAUTHORIZED,MESSAGE:MESSAGES.ERROR.UNAUTHORIZED});
            }
            res.status(200).json({ status:STATUS_CODES.SUCCESS,message:MESSAGES.SUCCESS.LOGIN_SUCCESS,data:user });
        } catch (error) {
            next(error);
        }
    }

    async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userDetails = await this.service.login(req.body.email, req.body.password);
            if (!userDetails) {
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.USER_NOT_FOUND);
            }
            res.json({ status:STATUS_CODES.SUCCESS, message:MESSAGES.SUCCESS.LOGIN_SUCCESS,data:userDetails });
        } catch (error) {
            next(error)
        }
    }


    async googleSign(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, userName, phoneNumber } = req.body
            console.log(email,userName,"llllllllllllllllllllllllllllllll")
            const userDetails = await this.service.googleSign(email, userName, phoneNumber);
            if (!userDetails) {
                throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const { accessToken, refreshToken, ...user } = userDetails;
            const Token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            // setCookie(res, 'user', Token);
            res.json({ status: STATUS_CODES.CREATED, message: MESSAGES.SUCCESS.USER_CREATED, data: userDetails });
        } catch (error) {
            next(error)
        }
    }

    public createBook = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
            console.log(req.body)
            const bookData: any = req.body;

            if (!bookData) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }

            if (req.file) {
                bookData.thumbnail = (req.file as any).location;
            } else {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }

            // if (!bookData.institutionId) {
            //     throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.INSTITUTION_ID_REQUIRED);
            // }

            await this.service.createBook(bookData);

            res.json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.COURSE_CREATED,

            });
        } catch (error) {
            next(error);
        }
    }

    public bookList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const sort = (req.query.sort as string);
            console.log(search,"S");
            console.log("sss")
            const {book,total} = await this.service.bookList(page,limit,search,filter,sort);
            res.status(201).json({
                book,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            next(error)
        }
    }

    public bookDelete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const bookId = req.query.bookId as string;
            if(!bookId){
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            await this.service.bookDelete(bookId);
            res.json({
                status:STATUS_CODES.SUCCESS,
                message:MESSAGES.SUCCESS.COURSE_DELETED
            });
        } catch (error) {
            next(error);
        }
    }

    public updateBook = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const bookData: any = req.body;
            console.log(bookData)
            const bookId:string = req.query.bookId as string;
            if (!bookData) {
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
            }
            await this.service.updateBook(bookData,bookId);
            res.status(201).json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.COURSE_UPDATED
            });
        } catch (error) {
            next(error);
        }
    }

}
