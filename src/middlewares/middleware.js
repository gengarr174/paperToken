export const loginRequired = (req,res,next) =>{
    if(!req.session.user){
        req.flash("errors","login user required");
        req.session.save(()=> res.redirect("/"));
        return;
    }
    next();
}

export const csrfMidWare = (req,res,next) =>{
    res.locals.csrfToken = req.csrfToken();
    next();
}

export const checkCsrfErr = (err,req,res,next)=>{
    if(err){
        return res.render("404")
    }
    next();
}

export const globalMid = (req,res,next) =>{
    res.locals.errors = req.flash("errors");
    res.locals.sucess = req.flash("sucess");
    res.locals.user = req.session.user;
    next();
}