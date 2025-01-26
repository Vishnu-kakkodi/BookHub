"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.HttpException = void 0;
class HttpException {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}
exports.HttpException = HttpException;
const errorMiddleware = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    res.json({ status: status, message: message });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map