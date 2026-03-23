export const loginRequired = (req,res,next) =>{
    if(!req.session?.user){
        req.flash("errors","Login necessário");
        if(req.session?.save){
            return req.session.save(()=> res.redirect("/auth"));
        }
        return res.redirect("/auth");
    }
    next();
}

export const csrfMidWare = (req,res,next)=>{
    try{
        res.locals.csrfToken = req.csrfToken();
    }catch(e){
        console.error("Erro ao gerar csrfToken:", e);
        res.locals.csrfToken = "";
    }
    next();
}

export const checkCsrfErr = (err,req,res,next)=>{
    if(err && err.code ==="EBADCSRFTOKEN"){
        return res.status(403).render("404");
    }
    next(err);
}

export const globalMid = (req,res,next) =>{
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");
    res.locals.user = req.session?.user || null;
    next();
}