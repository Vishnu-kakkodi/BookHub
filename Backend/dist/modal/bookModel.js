"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    isbn: { type: Number, required: true },
    genre: { type: String, required: true },
    thumbnail: { type: String, required: true },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });
exports.BookModel = (0, mongoose_1.model)('Book', bookSchema);
//# sourceMappingURL=bookModel.js.map