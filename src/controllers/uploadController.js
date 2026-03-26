import Upload from "../models/UploadModel.js";
import fs from "fs/promises";

// Realiza o upload de arquivo e atualiza os tokens do usuário
export const add = async function (req, res, next) {
    if (!req.session?.user) return res.redirect("/auth");

    try {
        // Verifica se o arquivo foi enviado corretamente
        if (!req.file) {
            req.flash("errors", "Nenhum arquivo foi enviado ou formato inválido");
            return req.session.save(() => res.redirect("/home"));
        }
        const file = new Upload(req.file, req.session);
        const tokensUpdate = await file.upload();
        // Trata erros de validação do upload
        if (file.errors.length > 0) {
            if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
            req.flash("errors", file.errors);
            return req.session.save(() => res.redirect("/home"));
        }
        // Atualiza os tokens na sessão
        req.session.user.tokens = tokensUpdate.tokens;

        req.flash("success", "Arquivo salvo com sucesso");
        return req.session.save(() => res.redirect("/home"));
    } catch (e) {
        // Trata erros específicos do multer
        if (e.code === "LIMIT_FILE_SIZE") {
            req.flash("errors", "Arquivo muito grande. Máximo 5MB.");
            return req.session.save(() => res.redirect("/home"));
        }
        if (e.code === "INVALID_FILE_TYPE") {
            req.flash("errors", "Tipo de arquivo não permitido.");
            return req.session.save(() => res.redirect("/home"));
        }
        // Envia erro inesperado para o middleware global
        next(e);
    }
};