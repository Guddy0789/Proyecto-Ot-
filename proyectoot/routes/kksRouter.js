var express = require('express');
var router = express.Router();
const {isAuthenticated} = require('../controllers/authController')
const {registro, detalle, estado, editar,actualizar} = require('../controllers/kksController')
const {authRol} = require('../middlewares/rol')
const User = require('../models/User')
const kks = require('../models/kks')
const { body, validationResult, check } = require('express-validator');
const { request } = require('../app');


/* GET KKS  */
router.get('/',isAuthenticated,authRol(["0","7"]), function(req, res, next) {
  res.render('./kks/kks', { title: 'Herramientas KKs', page_name:'kks' });
  
});

/*VISTA FORM para crear una nueva especialidad*/
router.get('/nuevo',isAuthenticated ,authRol(["0","7"]),function(req, res, next) {
  res.render('./kks/nuevo', { title: 'Herramientas KKs', page_name:'/kks/nuevo' });
});
/* GET Equipos DETALLE INDIVIDUAL */
//router.get('/detalle/:id',isAuthenticated,authRol(["0","7"]),detalle);


/* Cambiar estado de la turbina */
router.get('/estado/:id',isAuthenticated,authRol(["0","7"]),estado)

/*POST FORM para crear un nuevo equipo*/ 
router.post('/nuevo',
            [
              // check('kks', 'Ingrese una kks valida. (mayor a 2 caracteres)').trim()
              // .not()
              // .isEmpty()
              // .withMessage('Escriba el nombre de la herramienta KKs')
              // .isLength({ min: 2 })
              // .withMessage('La herramienta kks tiene que ser mayor a 2 caracteres')
              // .isAlphanumeric('es-ES', {ignore: ' '})
              // .withMessage('Solo espacios y caracteres alfanumericos'),

              check("kks")
              .trim()
              .not().isEmpty()
              .withMessage("Escriba el nombre de la herramienta KKs")
              .matches(/^[a-zA-Z0-9\-,\.\(\)\#\/\s^m³°\{\}\[\]]+$/)
              .withMessage("Solo se permiten los siguientes caracteres: alfanumericos, guiones, puntos, comas, parentesis, numerales, espacios, potencias y centigrados.")
              .isLength({ min: 2 })
              .withMessage('Nombre de la kks tiene q ser mayor a 2 caracteres'),


              // Pregunta generica
              check('general', 'Ingrese una pregunta general (mayor a 10 caracteres)').trim().not().isEmpty().withMessage('Escriba una pregunta general')
              .isLength({ min: 10 })
              .withMessage('La pregunta tiene que ser mayor a 10 caracteres'),

         
              
               //Pregunta especifica
              //  check('especifica').trim()
              // .isAlphanumeric('es-ES', {ignore: ' '})
              //  .withMessage('Solo espacios y caracteres alfanumericos')  
              //  .optional({ nullable: true, checkFalsy: true })
               check("especifica")
               .trim()
               .matches(/^[a-zA-Z0-9\-,\.\(\)\#\/\s^m³°\{\}\[\]]+$/)
               .withMessage("Solo se permiten los siguientes caracteres: alfanumericos, guiones, puntos, comas, parentesis, numerales, espacios, potencias y centigrados.")
               .isLength({ min: 8 })
               .withMessage('La pregunta especifica tiene q ser mayor a 8 caracteres'),


                                                                                              
            ],registro)

/* Actualizar Turbina */
router.post('/actualizar',
[
  
  check("kks")
  .trim()
  .not().isEmpty()
  .withMessage("Escriba el nombre de la herramienta KKs")
  .matches(/^[a-zA-Z0-9\-,\.\(\)\#\/\s^m³°\{\}\[\]]+$/)
  .withMessage("Solo se permiten los siguientes caracteres: alfanumericos, guiones, puntos, comas, parentesis, numerales, espacios, potencias y centigrados.")
  .isLength({ min: 2 })
  .withMessage('Nombre de la kks tiene q ser mayor a 2 caracteres'),


  // Pregunta generica
  check('general', 'Ingrese una pregunta general (mayor a 10 caracteres)').trim().not().isEmpty().withMessage('Escriba una pregunta general')
  .isLength({ min: 10 })
  .withMessage('La pregunta tiene que ser mayor a 10 caracteres'),


  
   //Pregunta especifica
  //  check('especifica').trim()
  // .isAlphanumeric('es-ES', {ignore: ' '})
  //  .withMessage('Solo espacios y caracteres alfanumericos')  
  //  .optional({ nullable: true, checkFalsy: true })
   check("especifica")
   .trim()
   .matches(/^[a-zA-Z0-9\-,\.\(\)\#\/\s^m³°\{\}\[\]]+$/)
   .withMessage("Solo se permiten los siguientes caracteres: alfanumericos, guiones, puntos, comas, parentesis, numerales, espacios, potencias y centigrados.")
   .isLength({ min: 8 })
   .withMessage('La pregunta especifica tiene q ser mayor a 8 caracteres'),

                                                                                  
],actualizar)

/*GET FORM EDIT para EDITAR Turbina*/
router.get('/editar/:id',isAuthenticated,authRol(["0","7"]),editar)            

/* JSON-Devuelve la lista de los KKs como JSON solomente */
router.get('/lista',isAuthenticated,authRol(["0","7","2"]), function(req, res, next) {
  kks.findAll({ order: [['orden', 'ASC']]}).then(kks => {
    res.json(kks);
})});
module.exports = router;
