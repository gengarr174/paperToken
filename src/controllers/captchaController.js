import Captcha from "../models/CaptchaModel.js";

export const addToken = async (req,res) =>{
    try{
        if(!req.session?.user) return res.redirect("/auth");
        if(req.session?.user?.role === "admin") return res.redirect("/home");
        if(!req.session.captchaSolved){
            req.flash("errors","Complete o captcha primeiro");
            return req.session.save(()=> res.redirect("/home"));
        }
        req.session.captchaSolved = false;
        const result = await Captcha.addToken(req.session.user.id);
        req.session.user.tokens = result;
        req.flash("sucess","Token adicionado com sucesso!");
        return req.session.save(()=> res.redirect("/home"));
    }catch(e){
        if (e.message === "Usuário não encontrado") {
            return res.status(404).send(e.message);
        }
        if (e.message === "Limite de tokens atingido") {
            req.flash("errors", "Você atingiu o limite de tokens");
            return req.session.save(() => res.redirect("/home"));
        }
        console.log(e);
        return res.status(500).send("Erro ao adicionar token");
    }
}