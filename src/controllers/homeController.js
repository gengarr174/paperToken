import Home from "../models/HomeModel.js";

// Renderiza a página inicial conforme o tipo de usuário
export const index = async (req, res, next) => {
    if (!req.session?.user) return res.redirect("/auth");

    try {
        const csrfToken = req.csrfToken();
        // Renderiza a home do admin com a lista de usuários
        if (req.session.user.role === "admin") {
            const users = await Home.allUsers();
            return res.render("home_admin", {
                users,
                csrfToken,
                user: req.session.user
            });
        }
        // Renderiza a home do usuário com seus arquivos e estatísticas
        const files = await Home.allFiles(req.session.user.id);
        const filesCount = await Home.countFiles(req.session.user.id);

        return res.render("home_user", {
            files,
            filesCount,
            csrfToken,
            user: req.session.user
        });
    } catch (e) {
        next(e);
    }
};
// Exclui um usuário ou arquivo, dependendo do perfil logado
export const del = async (req, res, next) => {
    if (!req.session?.user) return res.redirect("/auth");

    try {
        // Admin exclui usuário
        if (req.session.user.role === "admin") {
            const user = await Home.deleteUser(req.body.idUser);

            if (!user) {
                req.flash("errors", "Usuário não encontrado");
                return res.redirect("/home");
            }

            return res.redirect("/home");
        }
        // Usuário comum exclui seu próprio arquivo
        const file = await Home.deleteFile(req.body.idFile, req.session.user.id);

        if (!file) {
            req.flash("errors", "Arquivo não encontrado");
            return res.redirect("/home");
        }
        return res.redirect("/home");
    } catch (e) {
        next(e);
    }
};
// Faz o download de um arquivo do usuário
export const download = async (req, res, next) => {
    if (!req.session?.user) return res.redirect("/auth");

    try {
        // Admin não pode baixar arquivos por essa rota
        if (req.session.user.role === "admin") return res.redirect("/home");

        const fileID = parseInt(req.params.id, 10);

        if (isNaN(fileID)) return res.status(400).send("ID inválido");

        const filePath = await Home.downloadFile(req.params.id, req.session.user.id);

        if (!filePath) {
            req.flash("errors", "Arquivo não encontrado");
            return res.redirect("/home");
        }

        return res.download(filePath);
    } catch (e) {
        next(e);
    }
};
// Edita status de usuário ou nome de arquivo, dependendo do perfil logado
export const edit = async (req, res, next) => {
    if (!req.session?.user) return res.redirect("/auth");

    try {
        // Admin altera o status de um usuário
        if (req.session.user.role === "admin") {
            const edit = await Home.changeStatusUser(
                req.body.idUser,
                req.body.statusUser
            );

            if (!edit) {
                req.flash("errors", "Alteração falhou");
                return res.redirect("/home");
            }

            return res.redirect("/home");
        }
        // Usuário comum edita o nome original do arquivo
        const edit = await Home.editFile(
            req.body.idFile,
            req.session.user.id,
            req.body.original_name
        );
        if (!edit) {
            req.flash("errors", "Edição falhou");
            return res.redirect("/home");
        }
        return res.redirect("/home");
    } catch (e) {
        next(e);
    }
};