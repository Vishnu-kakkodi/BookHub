import { Router } from "express";
import { controller } from "../controller/controller";
import { userRepository } from "../repository/user.repository";
import service from "../service/service";
import upload from "../bucketConfig";
import { bookRepository } from "../repository/book.repository";
import { log } from "console";


const router = Router();
const UserRepository = new userRepository();
const BookRepository = new bookRepository();
const Service = new service(UserRepository,BookRepository);
const Controller = new controller(Service);


router.get('/book-list',Controller.bookList.bind(Controller));


router.post('/signup', Controller.register.bind(Controller));
router.post('/login',Controller.login.bind(Controller));
router.post('/googleSign',Controller.googleSign.bind(Controller));
router.post('/create-book',upload.single('thumbnail'),Controller.createBook.bind(Controller));

router.delete('/book-delete',Controller.bookDelete.bind(Controller));
router.post('/book-update',Controller.updateBook.bind(Controller));





export default router;
