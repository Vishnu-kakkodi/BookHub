"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
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
            console.error(error, "Error occurred during creation");
            if (error.name === "ValidationError") {
                throw new Error("Validation failed for the provided data.");
            }
            if (error.code === 11000) {
                throw new error_middleware_1.HttpException(statusCode_1.default.CONFLICT, message_1.default.ERROR.EMAIL_ALREADY_EXISTS);
            }
            throw new Error("An unexpected error occurred during creation.");
        }
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map