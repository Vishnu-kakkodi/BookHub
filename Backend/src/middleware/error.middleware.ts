
import { Request, Response, NextFunction } from "express";

interface CatchError {
    status: number;
    message: string;
}

export class 
HttpException implements CatchError{
    constructor(public status: number, public message: string){
    }
}

export const errorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void =>{
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';

    res.json({status:status,message:message});
}





