import { Model, Document, Types, FilterQuery } from "mongoose";
import { BaseInterface } from "../types/baseType";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export abstract class BaseRepository<T extends BaseInterface & Document> implements IBaseRepository<T>{
    constructor(protected readonly model: Model<T & Document>) {}

    async create(data: Partial<T>): Promise<T> {
        try {
            const item = await this.model.create(data);
            return item.toObject();
        } catch (error: any) {
            console.error(error, "Error occurred during creation");
            if (error.name === "ValidationError") {
                throw new Error("Validation failed for the provided data.");
            }
            if (error.code === 11000) {
                throw new HttpException(
                    STATUS_CODES.CONFLICT,
                    MESSAGES.ERROR.EMAIL_ALREADY_EXISTS
                );
            }
            throw new Error("An unexpected error occurred during creation.");
        }
    }
}
