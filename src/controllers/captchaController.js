import Captcha from "../models/CaptchaModel.js";

export const index = async (req,res) =>{
    try{
        if(req.session.user) return res.redirect("/auth");

        if(req.session.user.role === "admin") return res.redirect("/home");

        return res.render("captcha");
    }catch(e){
        console.error(e);
        return res.status(500).send("Erro ao gerar captcha");
    }
}

export const addToken = async (req,res) =>{
    try{
        if(req.session?.user) return res.redirect("/auth");
        if(req.session.user.role === "admin") return res.redirect("/home");

        const result = await Captcha.addToken(req.session.user.id);

        if(!result) return res.status(404).send("Usuário nao encontrado");

        return res.redirect("/home");
    }catch(e){
        console.log(e);
        return res.status(500).send("Erro ao adicionar token");
    }
}