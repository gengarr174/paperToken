import express from "express";
import * as homeController from "./controllers/homeController.js"
import * as loginController from "./controllers/loginController.js";
import * as uploadController from "./controllers/uploadController.js";
import * as captchaController from "./controllers/captchaController.js";
import * as profileController from "./controllers/UserController.js";
import csrf from "csurf";
import { loginRequired, upload } from "./middlewares/middleware.js";

const router = express.Router();
const csrfProtection = csrf();

router.get("/", csrfProtection, loginController.index);
router.get("/auth", csrfProtection, loginController.index);
router.post("/auth/login", csrfProtection, loginController.login);
router.post("/auth/register", csrfProtection, loginController.register);
router.post("/auth/logout", loginRequired, csrfProtection, loginController.logout);

router.get("/home", loginRequired, csrfProtection, homeController.index);
router.put("/home/edit", loginRequired, csrfProtection, homeController.edit);
router.delete("/home/delete", loginRequired, csrfProtection, homeController.del);
router.get("/home/download/:id", loginRequired, homeController.download);

router.post("/profile/update",loginRequired,csrfProtection, profileController.updateProfile);
router.post("/profile/password",loginRequired,csrfProtection,profileController.updatePassword);

router.post("/captcha/addToken", loginRequired, csrfProtection, captchaController.addToken);

router.post("/upload/add", loginRequired, upload, csrfProtection, uploadController.add);

router.get("/erro", async(req,res, next)=>{
    throw new Error("Teste de erro falhou com sucesso");
})

export default router;