import Upload from "../models/UploadModel.js";
import fs from "fs/promises";

export const add = async function (req, res) {
    if (!req.session?.user) return res.redirect("/auth");
    try {
        if (!req.file) {
            req.flash("errors", "Nenhum arquivo foi enviado ou formato invalido");
            return req.session.save(() => res.redirect("/home"));
        }
        const file = new Upload(req.file, req.session);
        await file.upload();

        if (file.errors.length > 0) {
            if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
            req.flash("errors", file.errors);
            return req.session.save(() => res.redirect("/home"));
        }
        req.flash("success", "Arquivo salvo com sucesso");
        return req.session.save(() => res.redirect("/home"));
    } catch (e) {
        if (e.code === "LIMIT_FILE_SIZE") {
            req.flash("errors", "Arquivo muito grande. Máximo 5MB.");
            return req.session.save(() => res.redirect("/home"));
        }
        if (e.code === "INVALID_FILE_TYPE") {
            req.flash("errors", "Tipo de arquivo não permitido.");
            return req.session.save(() => res.redirect("/home"));
        }
        console.error(e);
        return res.status(500).render("404");
    }
}