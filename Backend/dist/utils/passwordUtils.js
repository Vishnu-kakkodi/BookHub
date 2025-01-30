"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtils = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
exports.PasswordUtils = {
    async hashPassword(password) {
        try {
            const salt = await bcrypt_1.default.genSalt(SALT_ROUNDS);
            const hash = await bcrypt_1.default.hash(password, salt);
            return hash;
        }
        catch (error) {
            throw new Error('Password hashing failed');
        }
    },
    async comparePassword(password, hash) {
        try {
            return await bcrypt_1.default.compare(password, hash);
        }
        catch (error) {
            throw new Error('Password comparison failed');
        }
    }
};
//# sourceMappingURL=passwordUtils.js.map