var express = require('express');
var router = express.Router();
const conexion = require('../database/db');
const {actualizar,registro,estado,editar} = require('../controllers/especialidadController')
const authController = require('../controllers/authController')
const Especialidades = require('../models/Especialidades');
const { body, validationResult, check } = require('express-validator');
const {authRol} = require('../middlewares/rol')
var page_name='';

//ENRUTADORES PARA LA VISTA
// /* GET home page. */
// router.get('/cargo', function(req, res, next) {
//   //conexion();
//   res.render('cargo', { title: 'Cargo' });
// });

// ================================================================== RUTAS ESPECIALIDAD==================
// TABLA-Vista q muestra la TABLA de especialidades
router.get('/especialidad',authController.isAuthenticated,authRol(["0","7"]), function(req, res, next) {
  res.render('especialidad', { title: 'Especialidades', page_name:'especialidad' });
  
});
// JSON-Devuelve la lista de espcialidades como JSON solamente
router.get('/especialidades',authController.isAuthenticated,authRol(["0","7"]), function(req, res, next) {
    Especialidades.findAll({ order: [['updatedAt', 'DESC']]}).then(especialidades => {
      res.json(especialidades);
  })});
  
//VISTA FORM para crear una nueva especialidad
router.get('/especialidades/nuevo',authController.isAuthenticated ,authRol(["0","7"]),function(req, res, next) {
    res.render('./especialidad/nuevo', { title: 'tecnico', page_name:'/especialidades/nuevo' });
  });

//POST FORM para crear una nueva especialidad
router.post('/especialidades/nuevo',
            [
              check("especialidad")
              .trim()
              .not().isEmpty()
              .withMessage("Ingrese una especialidad valida. (mayor a 3 caracteres)")
              .matches(/^[a-zA-Z0-9\-,\.\(\)\#\/\s^m³°\{\}\[\]]+$/)
              .withMessage("Solo se permiten los siguientes caracteres: alfanumericos, guiones, puntos, comas, parentesis, numerales, espacios, potencias y centigrados.")
              .isLength({ min: 3 })
              .withMessage('La especialidad tiene que ser mayor a 3 caracteres')
              
            ],registro)

//Cambiar estado de la especialidad
router.get('/especialidades/estado/:id',authController.isAuthenticated,authRol(["0","7"]),estado)

//GET FORM EDIT para EDITAR especialidad
router.get('/especialidades/editar/:id',authController.isAuthenticated,authRol(["0","7"]),editar)

//GET FORM EDIT para EDITAR especialidad
router.post('/especialidades/actualizar',
[
  check('especialidad', 'Ingrese una especialidad valida. (mayor a 3 caracteres)').trim()
  .not()
  .isEmpty()
  .withMessage('Escriba el nombre de una especialidad')
  .isLength({ min: 3 })
  .withMessage('La especialidad tiene que ser mayor a 3 caracteres')
  .isAlphanumeric('es-ES', {ignore: ' '})
  .withMessage('Solo espacios y caracteres alfanumericos')
                                                                                  
],actualizar)

// ================================================================== RUTAS ESPECIALIDAD FIN ==================

// /* GET Cargo form. */
// router.get('/tecnico', function(req, res, next) {
//   res.render('tecnico', { title: 'tecnico', page_name:'tecnico' });
// });



// /* GET LOGIN page. */
// router.get('/registro', function(req, res, next) {
//   res.render('registro', { title: 'Login Page' });
// });



//ENRUTADORES PARA EL CONTROLADOR POST

//Controlador POST del formulario login
/* POST Login Form. */
router.post('/registro',authController.registro);

/* POST Login Form. */
router.post('/login',authController.login);


module.exports = router;
