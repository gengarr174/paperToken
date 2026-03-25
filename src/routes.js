import express from "express";
import * as homeController from "./controllers/homeController.js"
import * as loginController from "./controllers/loginController.js";
import * as uploadController from "./controllers/uploadController.js";
import * as captchaController from "./controllers/captchaController.js";
import * as profileController from "./controllers/UserController.js";
import upload from "./middlewares/upload.js";
import csrf from "csurf";
import { loginRequired } from "./middlewares/middleware.js";

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

router.post("/upload/add",loginRequired,
    (req, res, next) => {
        upload.single("file")(req, res, function (err) {
            if (err) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    req.flash("errors", "Arquivo muito grande. Máximo 5MB.");
                    return req.session.save(() => res.redirect("/home"));
                }
                if (err.code === "INVALID_FILE_TYPE") {
                    req.flash("errors", "Tipo de arquivo não permitido.");
                    return req.session.save(() => res.redirect("/home"));
                }
                console.error(err);
                req.flash("errors", "Erro ao processar upload.");
                return req.session.save(() => res.redirect("/home"));
            }
            next();
        });
    },csrfProtection,uploadController.add);

export default router;