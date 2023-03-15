var express = require('express');
var router = express.Router();
const conexion = require('../database/db');
const authController = require('../controllers/authController')
const {authRol} = require('../middlewares/rol')
const Especialidades = require('../models/Especialidades');
const { body, validationResult, check, custom } = require('express-validator');
const validarJWT = require('../middlewares/validar-jwt')
const app = express()
// const router = Router();
// //Todas las rutas tienen q pasar por la validacion JWT
// router.use(validarJWT);

//============LOGIN FORM==================
/* GET home page. */
router.get('/', function(req, res, next) {
  //conexion();
  res.render('index', { title: 'Express',logout: true });
  
});

//Enviando especialidades al FORM registro
router.get('/registro', function(req, res, next) {
  Especialidades.findAll({ order: [['updatedAt', 'DESC']]}).then(especialidades => {
    const espVals = JSON.stringify(especialidades);
    res.render('registro', { title: 'Login Page',esp:especialidades });
})});


router.post('/registro',
[ // middlewares
        check('correo', 'Ingrese un correo valido').trim().isEmail(),
        check("password", "La contraseña debe tener al menos seis caracteres alfanumericos").isLength({ min: 6 }).isAlphanumeric()    
        .custom((password,{req}) => {
            if (password !== req.body.password2) {
                // trow error if passwords do not match
                throw new Error("Las contraseñas no coinciden");
            } else {
                return password;
            }
        }),
        // check('nombre','Ingrese su nombre completo').not().isEmpty().withMessage('Ingrese su nombre completo').isLength({ min: 3 })
        // .withMessage('La especialidad tiene que ser mayor a 3 caracteres').isAlphanumeric('es-ES', {ignore: ' '})
        // .withMessage('Solo espacios y caracteres alfanumericos'),
        check("nombre")
        .trim()
        .not().isEmpty()
        .withMessage("Ingrese su nombre completo")
        .matches(/^[a-zA-Z0-9\-,\.\(\)\#\/\s^m³°\{\}\[\]]+$/)
        .withMessage("Solo se permiten los siguientes caracteres: alfanumericos, guiones, puntos, comas, parentesis, numerales, espacios, potencias y centigrados.")
        .isLength({ min: 5 })
        .withMessage('Nombre tiene que ser mayor 5 caracteres'),

        check('ci','Ingrese su carnet').trim().isLength({min:3}).isAlphanumeric(),
        check('sangre','Seleccione una opcion')
        .custom((espcialidad,{req}) => {
          if (req.body.especialidad === "false") {
              // trow error if passwords do not match
              throw new Error("Seleccione su tipo de sangre");
          } else {
              return espcialidad;
          }
      }),
        // check('direccion','Ingrese una direccion').not().isEmpty().isLength({ min: 3 })
        // .withMessage('La direccion tiene que ser mayor a 10 caracteres').isAlphanumeric('es-ES', {ignore: ' '})
        // .withMessage('Solo espacios y caracteres alfanumericos'),
        check("direccion")
        .trim()
        .not().isEmpty()
        .withMessage("Ingrese su direccion")
        .matches(/^[a-zA-Z0-9\-,\.\(\)\#\/\s^m³°\{\}\[\]]+$/)
        .withMessage("Solo se permiten los siguientes caracteres: alfanumericos, guiones, puntos, comas, parentesis, numerales, espacios, potencias y centigrados.")
        .isLength({ min: 10 })
        .withMessage('La direccion tiene que ser mayor a 10 caracteres'),




        check('celular','Celular particular').trim().isLength({min:3}).isAlphanumeric(),
        check('especialidad','Seleccione una opcion')
        .custom((espcialidad,{req}) => {
          if (req.body.especialidad === "false") {
              // trow error if passwords do not match
              throw new Error("Seleccione una especialidad");
          } else {
              return espcialidad;
          }
      }),
        check('celempresa','Celular empresarial').trim().isLength({min:3}).isAlphanumeric()
    ],authController.registro);
    


    
router.post('/login',authController.login);
router.get('/logout',authController.logout);

//Redireccion despues del login
// router.get('/principal',authController.isAuthenticated, function(req, res, next) {
//   res.render('panel',{ title: 'Panel de administracion', page_name:'panel', user:req.user});
// });
router.get('/principal',authController.isAuthenticated,authRol(["0","1","2","7"]),authController.redirect);

// //router para las vistas
// router.get('/', authController.isAuthenticated, (req, res)=>{    
//   res.render('index', {user:req.user})
// })




module.exports = router;
