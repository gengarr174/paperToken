import Home from "../models/HomeModel.js";

export const index = async (req,res) =>{
    if (!req.session?.user) return res.redirect("/auth");
    try{
        const csrfToken = req.csrfToken();
        if(req.session.user.role === "admin"){
            const users = await Home.allUsers();
            return res.render("home_admin",{users,csrfToken,
                   user: req.session.user});
        }
        const files = await Home.allFiles(req.session.user.id);
        const filesCount = await Home.countFiles(req.session.user.id);
        console.log(files);
        return res.render("home_user",{files,filesCount,csrfToken,
               user: req.session.user});
    }catch(e){
        console.error(e);
        return res.status(500).render("500");
    }
};

export const del = async (req,res)=>{
    if (!req.session?.user) return res.redirect("/auth");
    try{
        if(req.session.user.role === "admin"){
            const user = await Home.deleteUser(req.body.idUser);
            if(!user){
                req.flash("errors", "Usuário não encontrado");
                return res.redirect("/home");
            }
            return res.redirect("/home");
        }
        const file = await Home.deleteFile(req.body.idFile, req.session.user.id);
        if(!file){
            req.flash("errors", "Usuário não encontrado");
            return res.redirect("/home");
        }
        return res.redirect("/home");
    }catch(e){
        console.error(e);
        return res.status(500).render("500");
    }
};

export const download = async(req,res) => {
    if (!req.session?.user) return res.redirect("/auth");
    try{
        if(req.session.user.role === "admin") return res.redirect("/home");
        const fileID = parseInt(req.params.id,10);

        if (isNaN(fileID)) return res.status(400).send("ID inválido");

        const filePath = await Home.downloadFile(req.params.id,req.session.user.id);
        if(!filePath) {
            req.flash("errors", "Arquivo não encontrado");
            return res.redirect("/home");
        }
        return res.download(filePath);
    }catch(e){
        console.error(e);
        return res.status(500).render("500");
    }
}

export const edit = async (req,res)=>{
    if (!req.session?.user) return res.redirect("/auth");
    try{
        if(req.session.user.role === "admin"){
            const edit = await Home.changeStatusUser(
                req.body.idUser,
                req.body.statusUser
            );

            if(!edit) {
                req.flash("errors", "Alteração falhou");
                return res.redirect("/home");
            }

            return res.redirect("/home");
        }
        const edit = await Home.editFile(
            req.body.idFile,
            req.session.user.id,
            req.body.original_name 
        );
        if(!edit) {
            req.flash("errors", "Edição falhou");
            return res.redirect("/home");
        }
        return res.redirect("/home");
    }catch(e){
        console.error(e);
        return res.status(500).render("500");
    }
};