import Upload from "../models/UploadModel.js";

export const index = (req,res)=>{
    if(!req.session?.user){
        return res.redirect("/auth");
    }
    return res.render('upload');
}

export const add = async function (req,res){
    try{
        if(!req.file){
            req.flash("errors","Nenhum arquivo foi enviado ou formato invalido");
            return req.session.save(()=>res.redirect("/home"));
        }
        const file = new Upload(req.file,req.session);
        await file.upload();

        if(file.errors.length > 0 ){
            req.flash("errors",file.errors);
            return req.session.save(()=>
            res.redirect("/home"));
        }
        req.flash("success","Arquivo salvo com sucesso");
        return req.session.save(()=> res.redirect("/home"));
    }catch(e){
        console.error(e);
        return res.render('404');
    }
}