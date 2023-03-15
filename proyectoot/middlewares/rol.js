const jwt = require('jsonwebtoken');
const User = require('../models/User')
exports.authRol = (roles) =>{
    return async(req,res,next)=>{
   const userToken = req.user;
    if(userToken) {
        try {
            const userExists = await User.findOne({ where: { correo:userToken.correo } });
            // console.log("aqui estoy===========ROOOOOOOOOOOL:"+JSON.stringify(userExists));
            if(roles.includes(JSON.stringify(userExists.rol)))
            {
                return next()
            }else{
                //return console.log("No tienes los permisos necesarios para acceder a esta ruta");
                // return res.redirect('/principal')
                return res.render('rolerror',{message: 'No tienes los permisos necesarios para acceder a esta ruta'});

            }
            
        } catch (error) {
            console.log(error)
            return res.redirect('/')
        }
    }else{
        return res.redirect('/')    
        
    }

    }
}