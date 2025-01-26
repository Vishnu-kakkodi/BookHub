"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repository = void 0;
const base_repository_1 = require("../repository/base.repository");
const userModel_1 = require("../modal/userModel");
class repository extends base_repository_1.BaseRepository {
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
}
exports.repository = repository;
//# sourceMappingURL=repository.js.map