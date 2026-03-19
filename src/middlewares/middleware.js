export const loginRequired = (req,res,next) =>{
    if(!req.session?.user){
        req.flash("errors","Login necessário");
        return req.session.save(()=> res.redirect("/auth"));
    }
    next();
}

export const csrfMidWare = (req,res,next)=>{
    try{
        res.locals.csrfToken = req.csrfToken();
    }catch(e){
        res.locals.csrfToken = "";
    }
    next();
}

export const checkCsrfErr = (err,req,res,next)=>{
    if(err && (err.code ==="EBADCSRFTOKEN" || err.message === 'invalid csrf token')){
        return res.status(404).render("404")
    }
    next();
}

export const globalMid = (req,res,next) =>{
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");
    res.locals.user = req.session?.user || null;
    next();
}