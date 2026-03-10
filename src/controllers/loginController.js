import Login from "../models/LoginModel.js"

export const index = (req,res) =>{
    if(req.session.user){
        return res.render('login-logado');
    }
    return res.render('login');
}

export const register = async function (req,res){
    try{
        const register = new Login(req.body);
        await register.register();

        if(register.errors.length > 0){
            req.flash('errors',register.errors);
            return req.session.save(()=>
            res.redirect('/login/index'));
        }

        req.flash ('sucess', 'Usuário cadastrado com sucesso!');
        return req.session.save(()=> res.redirect('/login/index'));
    }catch(e){
        console.error(e)
        return res.render('404');
    }
}

export const login = async function (req,res){
    try {
        const login = new Login(req.body)
        await login.login();

        if(login.errors.length > 0){
            req.flash('errors',login.errors);
            return req.session.save(()=> res.redirect('/login/index'));
        }

        req.session.regenerate(err=>{
            if(err){
                console.log(err);
                return res.render('404');
            }

            req.session.user = {
                id: login.user.id,
                email: login.user.email
            }

            req.flash('sucess','Login realizado com sucesso');
            return req.session.save(()=>res.redirect('login/index'));
        })
    }catch(e){
        console.error(e);
        return res.render('404');
    }
}

export const logout = function (req,res){
    req.session.destroy(err=>{
        if(err){
            console.error(err);
            return res.render('404');
        }

        res.clearCookie('connect.sid');
        return res.redirect('/');
    })
}