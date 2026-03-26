import Login from "../models/LoginModel.js";

// Renderiza a página de autenticação
export const index = (req, res) => {
    if (req.session?.user) return res.redirect("/home");

    return res.render("auth", { csrfToken: req.csrfToken() });
};
// Cadastra um novo usuário e inicia a sessão
export const register = async function (req, res, next) {
    try {
        const register = new Login(req.body);
        await register.register();
        // Redireciona de volta se houver erros de validação
        if (register.errors.length > 0) {
            req.flash("errors", register.errors);
            return req.session.save(() => res.redirect("/auth"));
        }
        // Regenera a sessão por segurança após o cadastro
        req.session.regenerate(err => {
            if (err) {
                console.error(err);
                return res.status(500).render("500");
            }
            req.session.user = {
                id: register.user.id,
                name: register.user.name,
                last_name: register.user.last_name,
                email: register.user.email,
                role: register.user.role,
                tokens: register.user.tokens
            };
            req.flash("success", "Usuário cadastrado com sucesso!");
            return req.session.save(() => res.redirect("/home"));
        });
    } catch (e) {
        next(e);
    }
};
// Autentica o usuário e inicia a sessão
export const login = async function (req, res, next) {
    try {
        const login = new Login(req.body);
        await login.login();
        // Redireciona de volta se houver erros de validação
        if (login.errors.length > 0) {
            req.flash("errors", login.errors);
            return req.session.save(() => res.redirect("/auth"));
        }
        // Regenera a sessão por segurança após o login
        req.session.regenerate(err => {
            if (err) {
                console.error(err);
                return res.status(500).render("500");
            }
            req.session.user = {
                id: login.user.id,
                name: login.user.name,
                last_name: login.user.last_name,
                email: login.user.email,
                role: login.user.role,
                tokens: login.user.tokens
            };
            req.flash("success", "Login realizado com sucesso");
            return req.session.save(() => res.redirect("/home"));
        });
    } catch (e) {
        next(e);
    }
};
// Encerra a sessão do usuário
export const logout = function (req, res, next) {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).render("500");
        }

        res.clearCookie("connect.sid");
        return res.redirect("/auth");
    });
};