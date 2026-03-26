import User from "../models/UserModel.js";

// Atualiza os dados básicos do perfil do usuário
export const updateProfile = async function (req, res, next) {
    if (!req.session?.user) return res.redirect("/auth");

    try {
        const update = await User.editProfile(
            req.session.user.id,
            req.body.name,
            req.body.last_name,
            req.body.email
        );

        if (!update) {
            req.flash("errors", "Falha na atualização do perfil");
            return req.session.save(() => res.redirect("/home"));
        }

        // Atualiza os dados do usuário na sessão
        req.session.user.name = req.body.name?.trim();
        req.session.user.last_name = req.body.last_name?.trim();
        req.session.user.email = req.body.email?.trim();

        req.flash("success", "Perfil atualizado com sucesso");
        return req.session.save(() => res.redirect("/home"));

    } catch (e) {
        // Envia erro inesperado para o middleware global (logger)
        next(e);
    }
};

// Atualiza a senha do usuário autenticado
export const updatePassword = async function (req, res, next) {
    if (!req.session?.user) return res.redirect("/auth");

    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Confere se a nova senha foi confirmada corretamente
        if (newPassword !== confirmPassword) {
            req.flash("errors", "A confirmação da nova senha não confere");
            return req.session.save(() => res.redirect("/home"));
        }

        const update = await User.editPassword(
            req.session.user.id,
            currentPassword,
            newPassword
        );

        if (!update) {
            req.flash("errors", "Falha na atualização da senha");
            return req.session.save(() => res.redirect("/home"));
        }

        req.flash("success", "Senha atualizada com sucesso");
        return req.session.save(() => res.redirect("/home"));

    } catch (e) {
        // Envia erro inesperado para o middleware global (logger)
        next(e);
    }
};