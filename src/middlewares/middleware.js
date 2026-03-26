import logger from "./logger.js";
import uploader from "./upload.js";

// Verifica se o usuário está logado antes de acessar a rota
export const loginRequired = (req, res, next) => {
    if (!req.session?.user) {
        req.flash("errors", "Login necessário");
        if (req.session?.save) return req.session.save(() => res.redirect("/auth"));
        return res.redirect("/auth");
    }
    next();
}

// Injeta o csrfToken nas views para proteção contra CSRF
export const csrfMidWare = (req, res, next) => {
    try {
        res.locals.csrfToken = req.csrfToken();
    } catch (e) {
        console.error("Erro ao gerar csrfToken:", e);
        res.locals.csrfToken = "";
    }
    next();
}

// Trata erros de CSRF e impede requisições inválidas
export const checkCsrfErr = (err, req, res, next) => {
    if (err && (err.code === "EBADCSRFTOKEN" || err.message === "invalid csrf token"))
        return res.status(403).render("404");
    next(err);
}

// Cria erro padrão para rotas não encontradas (404)
export const pageError = (req, res, next) => {
    const err = new Error("Página não encontrada");
    err.status = 404;
    next(err);
}

// Middleware global de erro (log + resposta adequada)
export const globalError = (err, req, res, next) => {
    logger.error(err);
    if (err.status === 404) return res.status(404).render("404");
    return res.status(500).render("500");
}

// Disponibiliza mensagens flash e usuário para as views
export const globalMid = (req, res, next) => {
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");
    res.locals.user = req.session?.user || null;
    next();
}

// Processa upload de arquivo e trata erros do multer
export const upload = (req, res, next) => {
    uploader.single("file")(req, res, function (err) {
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
}