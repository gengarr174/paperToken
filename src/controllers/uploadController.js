import Upload from "../models/UploadModel.js";

export const index = (req,res)=>{
    return res.render('upload');
}

export const upload = async function (req,res){
    try{
        if(!req.file){
            req.flash("erros","Nenhum arquivo foi enviado ou formato invalido");
            return req.session.save(()=>res.redirect("/"));
        }
        const file = new Upload(req.file,req.session);
        await file.upload();

        if(file.errors.length > 0 ){
            req.flash("errors",file.errors);
            return req.session.save(()=>
            res.redirect("/"));
        }
        req.flash("sucess","Arquivo salvo com sucesso");
        return req.session.save(()=> res.redirect("/"));
    }catch(e){
        console.error(e);
        return res.render('404');
    }
}