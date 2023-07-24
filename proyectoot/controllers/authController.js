const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require('dotenv').config(); 
//const conexion = require('../database/db');
const {promisify} = require('util');
const {validationResult} = require('express-validator');
const Especialidades = require('../models/Especialidades');
const User = require('../models/User');

//============REGISTRO DE USUARIOS NUEVOS======================
exports.registro = async (req, res, next) =>{
    
    try {
        const espExists = await Especialidades.findAll({ order: [['updatedAt', 'DESC']]});
        
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
        if (!errors.isEmpty()) {
            const valores = req.body
            console.log("🐕 🐕 🐕 🐕 🐕"+JSON.stringify(valores))
            const validaciones = errors.array()
            return res.render('registro', { validaciones:validaciones, valores: valores, esp:espExists });
            
        }        
        var correo=req.body.correo;    
        const userExists = await User.findOne({ where: { correo:correo } });
         if (userExists ) {
             console.log("ERRRRRRRRRRRROOOOOOOOOOOR");
             const valores = req.body
           const msgError = "El correo: " + correo + ", ya se encuentra registrado."
         //return res.render('./registro', { page_name:'especialidad', msgError:msgError, esp:espExists });
           return res.render('registro', { title: 'Login Page', msgError:msgError, valores: valores, esp:espExists });
         }
        //esto al final para salvar
        let pass = req.body.password;
        let passHash = await bcryptjs.hash(pass,8);
        User.create({
            correo: req.body.correo,
            password: passHash,
            nombre: req.body.nombre,
            carnet: req.body.ci,
            sangre: req.body.sangre,
            direccion: req.body.direccion,
            celular: req.body.celular,
            id_especialidad:req.body.especialidad,
            celempresa:req.body.celempresa,
            rol:2,    
            estado:1
        }).then(users=>{
            const msgok = "Usuario: " + JSON.stringify(req.body.nombre) + " creado con exito";
            return res.render('registro', {msgok:msgok,esp:espExists });
        });


    } catch (error) {
        console.log(error);
        return next(error)
    }
}
//============LOGIN USUARIOS REGISTRADOS=======================
exports.login = async (req, res) =>{
    // console.log("aqui estoy===========LOGIN");
    // console.log(req.body);
      //respuesta si todo esta OK(no entra al if)  
      const {correo, password} = req.body;

      try {
          //Confirmar Usuario
          const userExists = await User.findOne({ where: { correo:correo } });
          if (!userExists)
           {

            return res.render('./',{msgError:'Verifique sus credenciales'})
               
           }
           //Confirmar Passwords
           const validPassword = bcryptjs.compareSync(password,userExists.password)
           if (!validPassword){
            return res.render('./',{msgError:'Verifique sus credenciales'})
              
           }
           
           
           if (userExists.estado===0){
            return res.render('./',{msgError:'Usuario deshabilitado, contacte con su administrador'})
              
           }
  
        const token = jwt.sign({id:userExists.id,correo:userExists.correo,nombre:userExists.nombre,rol:userExists.rol}, process.env.SECRET_JWT_SEED, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
        })
       
       
    //    console.log("TOKEN: "+token+" para el USUARIO : "+userExists.correo)

       const cookiesOptions = {
            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
       }
       res.cookie('jwt', token, cookiesOptions)
       
      
    if (userExists.rol===7 || userExists.rol===0){
        // localStorage.setItem('nombre', userExists.nombre);
        // localStorage.setItem('rol', "Administrador");
        res.locals.nombre = "GUDDDYYY";
        return res.redirect('/usuarios/administrador')       
       }
    if (userExists.rol===1){
        // localStorage.setItem('nombre', userExists.nombre);
        // localStorage.setItem('rol', "Supervisor");
      
        return res.redirect('/usuarios/asignar')       
        }   
    if (userExists.rol===2){
        // localStorage.setItem('nombre', userExists.nombre);
        // localStorage.setItem('rol', "Tecnico");
        res.locals.nombre = "GUDDDYYY";
        return res.redirect('/ot/pendientes')       
        }   
       
       
    //    http://localhost:3000/usuarios/asignar
           
          
      } catch (error) {
         console.log("====ERROR LOGIN ===>"+error);
        //  res.status(500).json({
        //      ok:false,
        //      msg:'Por favor hable con el administrador.'
        //  })
          
      }

}
//============VALIDAR TOKEN=======================
exports.isAuthenticated  = async (req, res, next) =>{
    const galletita = req.cookies.jwt
    if(req.cookies.jwt) {
        try {
            const userToken =  jwt.verify(galletita,process.env.SECRET_JWT_SEED);
            req.user=userToken;
            // console.log("aqui estoy===========User logged:"+JSON.stringify(userToken));
            res.locals.nombre = req.user.nombre;
            const rol = req.user.rol;
            let rolglobal;
            if(rol== 0 || rol == 7) rolglobal = "Administrador";
            if(rol== 1) rolglobal = "Supervisor";
            if(rol== 2) rolglobal = "Tecnico";
            res.locals.rol = rolglobal;
            return next()
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        return res.redirect('/')    
        
    }

}
//============LogOut=======================
exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    
    return res.redirect('/')
}
//============Bypass a ventana Principal=======================
exports.redirect = async (req, res) =>{
    
    const userToken = req.user;
    const userExists = await User.findOne({ where: { correo:userToken.correo } });
    const currentRol=userExists.rol;
    console.log("aqui estoy----- Usuario encontrado--- ROOOL :"+JSON.stringify(currentRol));
    switch(userExists.rol){
        case 0:
            return res.render('panel',{title: 'Panel de administracion', page_name:'panel',user:userExists})
          
        case 7:
            return res.render('panel',{title: 'Panel de administracion', page_name:'panel',user:userExists})
          
        case 1:
            console.log("ENTRANDO AL SWITCH CASE NUMBAAA 2");
            return res.render('supervisor',{title: 'Panel de Supervisor', page_name:'panel',user:userExists})
        
        case 2:
            return res.render('tecnico',{title: 'Panel de Ordenes de trabajo', page_name:'panel',user:userExists})
        
        default:
        console.log("Error de redireccionamiento");
      }

    
}

// ===========Cambiar estado de un Tecnico
exports.estadoTecnico=async(req,res,next   )=>{
    
    try {
        
    const id = req.params.id;
    const estadoActual = await User.findOne({ where: { id:id } });
            console.log("ESTADO ACUTAL================="+JSON.stringify(estadoActual.nombre));
        if(estadoActual.estado==0){
            const result = await User.update(
                { estado: 1 },
                { where: { id: id } }
            )
            // return res.redirect("/panel/especialidad/"); 
            const msgEstado = "Estado '" + estadoActual.nombre + "' actualizado con exito." 
             res.render('./usuarios/tecnicos', { title: 'Tecnicos', page_name:'tecnicos', msgok:msgEstado});
        
      
        }else{
           
        await User.update({ estado: 0 },{ where: { id: id } })
        const msgEstado = "Estado '" + estadoActual.nombre + "' actualizado con exito." 
         res.render('./usuarios/tecnicos', { title: 'Tecnicos', page_name:'tecnicos', msgok:msgEstado});
        }
        
      } catch (err) {
        console.log(err);
         next(err);
        
      }


}
// ===========Cambiar estado de un Supervisor
exports.estadoSupervisor=async(req,res,next   )=>{
    
    try {
        
    const id = req.params.id;
    const estadoActual = await User.findOne({ where: { id:id } });
            
        if(estadoActual.estado==0){
            const result = await User.update(
                { estado: 1 },
                { where: { id: id } }
            )
            // return res.redirect("/panel/especialidad/"); 
            const msgEstado = "Estado '" + estadoActual.nombre + "' actualizado con exito." 
             res.render('./usuarios/supervisores', { title: 'Supervisores', page_name:'supervisores', msgok:msgEstado});
        
      
        }else{
           
        await User.update({ estado: 0 },{ where: { id: id } })
        const msgEstado = "Estado '" + estadoActual.nombre + "' actualizado con exito." 
         res.render('./usuarios/supervisores', { title: 'Supervisores', page_name:'supervisores', msgok:msgEstado});
        }
        
      } catch (err) {
        console.log(err);
         next(err);
        
      }


}
// ===========Cambiar estado de un Administrador
exports.estadoAdministrador=async(req,res,next   )=>{
    
    try {
        
    const id = req.params.id;
    const estadoActual = await User.findOne({ where: { id:id } });
            
        if(estadoActual.estado==0){
            const result = await User.update(
                { estado: 1 },
                { where: { id: id } }
            )
            // return res.redirect("/panel/especialidad/"); 
            const msgEstado = "Estado '" + estadoActual.nombre + "' actualizado con exito." 
             res.render('./usuarios/administradores', { title: 'Administradores', page_name:'administradores', msgok:msgEstado});
        
      
        }else{
           
        await User.update({ estado: 0 },{ where: { id: id } })
        const msgEstado = "Estado '" + estadoActual.nombre + "' actualizado con exito." 
         res.render('./usuarios/administradores', { title: 'Administradores', page_name:'administradores', msgok:msgEstado});
        }
        
      } catch (err) {
        console.log(err);
         next(err);
        
      }


}
// ===========Hacer Supervisores
exports.supervisorNuevo=async(req,res,next)=>{
try {
    const id = req.params.id;
    const usuarioActual = await User.findOne({ where: { id:id } });
    
    await User.update({ rol: 1 },{ where: { id: id } })
    const msgEstado = "El usuario: '" + usuarioActual.nombre + "' ahora tiene el rol de SUPERVISOR" 
    res.render('./usuarios/supervisores', { title: 'Supervisores', page_name:'supervisores', msgok:msgEstado});
        
    } catch (err) {
        console.log(err);
         next(err);
        
      }


}
// ===========Hacer Tecnicos
exports.tecnicoNuevo=async(req,res,next)=>{
    try {
        const id = req.params.id;
        const usuarioActual = await User.findOne({ where: { id:id } });
        await User.update({ rol: 2 },{ where: { id: id } })
        const msgEstado = "El usuario: '" + usuarioActual.nombre + "' ahora tiene el rol de TECNICO" 
        res.render('./usuarios/tecnicos', { title: 'Tecnicos', page_name:'tecnicos', msgok:msgEstado});
            
        } catch (err) {
            console.log(err);
             next(err);
            
          }
    
    
    }
// ===========Hacer Arministradores
exports.administradorNuevo=async(req,res,next)=>{
    try {
        const id = req.params.id;
        const usuarioActual = await User.findOne({ where: { id:id } });
        await User.update({ rol: 0 },{ where: { id: id } })
        const msgEstado = "El usuario: '" + usuarioActual.nombre + "' ahora tiene el rol de ADMINISTRADOR" 
        res.render('./usuarios/administradores', { title: 'Administradores', page_name:'administradores', msgok:msgEstado});
            
        } catch (err) {
            console.log(err);
             next(err);
            
          }
    
    
    }

// exports.perfilTecnico=async(req,res,next)=>{
//     try {
      
//         const id = req.params.id;
        
//           // const result = await Equipos.findOne({ where: { id: id }})
//           const result = await User.findOne({where:{id: id}})
          
//           const equipoURL = "/usuarios/perfil/"+id; 
//           const idturbina = id; 
        
//           return res.render('./equipos/detalle', { title: "Equipo: "+result.nombre, page_name:'equipos', equipo:result, equipoURL:equipoURL, idturbina:idturbina});
//       } catch (err) {
//         console.log(err);
//         return next(err);
        
//       }
// }    