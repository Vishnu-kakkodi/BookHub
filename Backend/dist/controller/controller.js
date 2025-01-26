"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const statusCode_ts_1 = __importDefault(require("../constants/statusCode.ts"));
const message_ts_1 = __importDefault(require("../constants/message.ts"));
class controller {
    constructor(service) {
        this.service = service;
    }
    async register(req, res, next) {
        try {
            console.log("Hai");
            const { email, password } = req.body;
            const admin = await this.service.register(email, password);
            if (!admin) {
                res.json({ STATUS: statusCode_ts_1.default.UNAUTHORIZED, MESSAGE: message_ts_1.default.ERROR.UNAUTHORIZED });
            }
            res.status(200).json({ status: statusCode_ts_1.default.SUCCESS, message: message_ts_1.default.SUCCESS.LOGIN_SUCCESS, data: admin });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.controller = controller;
//# sourceMappingURL=controller.js.map