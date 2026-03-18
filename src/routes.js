import express from "express";
import * as homeController from "./controllers/homeController.js"
import * as loginController from "./controllers/loginController.js";
import * as uploadController from "./controllers/uploadController.js";
import * as captchaController from "./controllers/captchaController.js";
import {loginRequired} from "./middlewares/middleware.js";

const router = express.Router();

router.get("/auth",loginController.index);
router.post("/auth/login",loginController.login);
router.post("/auth/register",loginController.register);
router.post("/auth/logout", loginRequired, loginController.logout);

router.get("/home", loginRequired, homeController.index);
router.put("/home/edit", loginRequired, homeController.edit);
router.delete("/home/delete", loginRequired, homeController.del);

router.get("/upload", loginRequired, uploadController.index);
router.post("/upload/add",loginRequired, uploadController.add);

router.get("/captcha", loginRequired, captchaController.index);
router.get("/captcha/addToken", loginRequired, captchaController.addToken);

export default router;