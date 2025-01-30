"use strict";
// import { BaseRepository } from "./base.repository";
// import { UserModel } from "../modal/userModel";
// import { IUserDocument } from "../types/userType";
// import mongoose, { FilterQuery } from 'mongoose';
// import { IUserRepository } from "../interfaces/IUserRepository";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const userModel_1 = require("../modal/userModel");
const base_repository_1 = require("./base.repository");
class userRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(userModel_1.UserModel);
    }
    async findByEmail(email) {
        try {
            return await this.model.findOne({ email });
        }
        catch (error) {
            throw error;
        }
    }
    async findById(userId) {
        try {
            return await this.model.findById(userId);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.userRepository = userRepository;
//# sourceMappingURL=user.repository.js.map