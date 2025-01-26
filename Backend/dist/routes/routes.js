"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controller/controller");
const repository_1 = require("../repository/repository");
// import upload from "../bucketConfig";
const service_1 = __importDefault(require("../service/service"));
const router = (0, express_1.Router)();
const Repository = new repository_1.repository();
const Service = new service_1.default(Repository);
const Controller = new controller_1.controller(Service);
// router.get('/cart-items',authMiddleware,cartController.getCartItems.bind(cartController));
router.post('/register', Controller.register.bind(controller_1.controller));
// router.use(authMiddleware);
exports.default = router;
//# sourceMappingURL=routes.js.map