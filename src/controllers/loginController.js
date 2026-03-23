import Login from "../models/LoginModel.js"

export const index = (req, res) => {
    if (req.session?.user)
        return res.redirect("/home");
    return res.render("auth");
}

export const register = async function (req, res) {
    try {
        const register = new Login(req.body);
        await register.register();
        if (register.errors.length > 0) {
            req.flash("errors", register.errors);
            return req.session.save(() => res.redirect("/auth"));
        }
        req.session.regenerate(err => {
            if (err) {
                console.error(err);
                return res.status(500).render("500");
            }
            req.session.user = {
                id: loginModel.user.id,
                name: loginModel.user.name,
                last_name: loginModel.user.last_name,
                email: loginModel.user.email,
                role: loginModel.user.role,
                tokens: loginModel.user.tokens
            };
            req.flash("success", "Usuário cadastrado com sucesso!");
            return req.session.save(() => res.redirect("/home"));
        });
    } catch (e) {
        console.error(e)
        return res.status(500).render("404");
    }
}

export const login = async function (req, res) {
    try {
        const login = new Login(req.body)
        await login.login();

        if (login.errors.length > 0) {
            req.flash("errors", login.errors);
            return req.session.save(() => res.redirect("/auth"));
        }

        req.session.regenerate(err => {
            if (err) {
                console.log(err);
                return res.render("404");
            }

            req.session.user = {
                id: login.user.id,
                name: login.user.name,
                last_name: login.user.last_name,
                email: login.user.email,
                role: login.user.role,
                tokens: login.user.tokens
            }

            req.flash("success", "Login realizado com sucesso");
            return req.session.save(() => res.redirect("/home"));
        })
    } catch (e) {
        console.error(e);
        return res.status(500).render("404");
    }
}

export const logout = function (req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).render("500");
        }
        res.clearCookie("connect.sid");
        return res.redirect("/auth");
    })
}