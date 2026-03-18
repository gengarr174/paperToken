import Home from "../models/HomeModel.js";

export const index = async (req,res) =>{
    try{
        if(!req.session?.user) return res.redirect("/auth");

        if(req.session.user.role === "admin"){
            const users = await Home.allUsers();
            return res.render("home_admin",{users});
        }

        const files = await Home.allFiles(req.session.user.id);
        return res.render("home_user",{files});

    }catch(e){
        console.error(e);
        return res.status(500).send("Erro ao carregar dados");
    }
};

export const del = async (req,res)=>{
    try{
        if(req.session.user.role === "admin"){
            const user = await Home.deleteUser(req.body.idUser);

            if(!user) return res.status(404).send("Usuário nao encontrado");
            
            return res.redirect("/home");
        }

        const file = await Home.deleteFile(req.body.idFile, req.session.user.id);

        if(!file) return res.status(404).send("Arquivo nao encontrado");

        return res.redirect("/home");

    }catch(e){
        console.error(e);
        return res.status(500).send("Erro ao deletar");
    }
};

export const edit = async (req,res)=>{
    try{

        if(req.session.user.role === "admin"){

            const edit = await Home.changeStatusUser(
                req.body.idUser,req.body.statusUser
            );

            if(!edit) return res.status(404).send("Alteracao falhou");

            return res.redirect("/home");
        }

        const edit = await Home.editFile(
            req.body.idFile,
            req.body.session.user.id,
            req.body.original_name 
        );

        if(!edit) return res.status(404).send("Edicao falhou");

        return res.redirect("/home");

    }catch(e){
        console.error(e);
        return res.status(500).send("Erro ao editar");
    }
};