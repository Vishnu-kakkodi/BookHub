"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controller/controller");
const user_repository_1 = require("../repository/user.repository");
const service_1 = __importDefault(require("../service/service"));
const bucketConfig_1 = __importDefault(require("../bucketConfig"));
const book_repository_1 = require("../repository/book.repository");
const router = (0, express_1.Router)();
const UserRepository = new user_repository_1.userRepository();
const BookRepository = new book_repository_1.bookRepository();
const Service = new service_1.default(UserRepository, BookRepository);
const Controller = new controller_1.controller(Service);
router.get('/book-list', Controller.bookList.bind(Controller));
router.get('/my-book-list', Controller.myBookList.bind(Controller));
router.post('/signup', Controller.register.bind(Controller));
router.post('/login', Controller.login.bind(Controller));
router.post('/googleSign', Controller.googleSign.bind(Controller));
router.post('/create-book', bucketConfig_1.default.single('thumbnail'), Controller.createBook.bind(Controller));
router.delete('/book-delete', Controller.bookDelete.bind(Controller));
router.post('/book-update', Controller.updateBook.bind(Controller));
router.post('/profile-photo', bucketConfig_1.default.single('profileImage'), Controller.profilePhoto.bind(Controller));
exports.default = router;
//# sourceMappingURL=routes.js.map