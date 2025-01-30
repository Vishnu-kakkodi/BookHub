"use strict";
// import { Model, HydratedDocument, Types, FilterQuery } from "mongoose";
// import { BaseInterface } from "../types/baseType";
// import { HttpException } from "../middleware/error.middleware";
// import STATUS_CODES from "../constants/statusCode";
// import MESSAGES from "../constants/message";
// import { IBaseRepository } from "../interfaces/IBaseRepository";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        try {
            const item = await this.model.create(data);
            return item.toObject();
        }
        catch (error) {
            console.error("Error occurred during creation:", error);
            throw new Error("An unexpected error occurred during creation.");
        }
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map