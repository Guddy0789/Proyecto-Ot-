var express = require('express');
var router = express.Router();
const {isAuthenticated} = require('../controllers/authController')
const {registro, detalle, estado, editar,actualizar} = require('../controllers/equiposController')
const {authRol} = require('../middlewares/rol')
const User = require('../models/User')
const Equipos = require('../models/Equipos')
const { body, validationResult, check } = require('express-validator');
const { request } = require('../app');


/* GET Equipos  */
router.get('/',isAuthenticated,authRol(["0","7"]), function(req, res, next) {
  res.render('./equipos/equipos', { title: 'Turbinas', page_name:'equipos' });
  
});

/*VISTA FORM para crear una nueva especialidad*/
router.get('/nuevo',isAuthenticated ,authRol(["0","7"]),function(req, res, next) {
  res.render('./equipos/nuevo', { title: 'Turbinas', page_name:'/equipos/nuevo' });
});
/* GET Equipos DETALLE INDIVIDUAL */
router.get('/detalle/:id',isAuthenticated,authRol(["0","7"]),detalle);

/* GET Equipos JSON DETALLE INDIVIDUAL */
router.get('/turbina/:id',isAuthenticated,authRol(["0","7"]), function(req, res, next) {
  const id=req.params.id
  Equipos.findAll({where:{id:id}}).then(turbina => {
    res.json(turbina);
})});



/* Cambiar estado de la turbina */
router.get('/estado/:id',isAuthenticated,authRol(["0","7"]),estado)

/*POST FORM para crear un nuevo equipo*/
router.post('/nuevo',
            [ //NOMBRE
              check('nombre', 'Ingrese un nombre valido. (mayor a 3 caracteres)').trim().not().isEmpty().withMessage('Escriba el nombre de una turbina')
              .isLength({ min: 2 })
              .withMessage('La especialidad tiene que ser mayor a 3 caracteres')
              .isAlphanumeric('es-ES', {ignore: ' '})
              .withMessage('Solo espacios y caracteres alfanumericos'),

              //MARCA
              check('marca', 'Ingrese una marca valida. (mayor a 3 caracteres)').trim().not().isEmpty().withMessage('Escriba el nombre de una turbina')
              .isLength({ min: 2 })
              .withMessage('La marca tiene que ser mayor a 3 caracteres')
              .isAlphanumeric('es-ES', {ignore: ' '})
              .withMessage('Solo espacios y caracteres alfanumericos'),              

              //MODELO
              check('modelo', 'Ingrese un modelo valido. (mayor a 3 caracteres)').trim().not().isEmpty().withMessage('Escriba el modelo del equipo')
              .isLength({ min: 3 })
              .withMessage('El modelo tiene que ser mayor a 3 caracteres')
              .isAlphanumeric('es-ES', {ignore: ' '})
              .withMessage('Solo espacios y caracteres alfanumericos'),              

              //NUMERO DE IDENTIFICACION
              check('numeroid', 'Ingrese un numero de identificacion. (mayor a 3 caracteres)').trim().not().isEmpty().withMessage('Ingrese un numero de identificacion')
              .isLength({ min: 3 })
              .withMessage('El modelo tiene que ser mayor a 3 caracteres')
              .isAlphanumeric('es-ES', {ignore: ' '})
              .withMessage('Solo espacios y caracteres alfanumericos'),              

              //VELOCIDAD RPM
              check('velocidad', 'Ingrese la velocidad nominal del equipo.').trim().not().isEmpty().withMessage('Ingrese la velocidad nominal')
              .isNumeric('es-ES', {ignore: ' '})
              .withMessage('Solo numeros en este campo'),              
              
              // TIPO DE COMBUSTIBLE 
              check('combustible','Seleccione una opcion')
              .custom((combustible,{req}) => {
                if (req.body.combustible === "false") {
                    // trow error if passwords do not match
                    throw new Error("Seleccione el tipo de combustible");
                } else {
                    return combustible;
                }
            }),

            //POTENCIA ISO
            check('potenciaiso', 'Ingrese la potencia ISO').trim().not().isEmpty()
            .isNumeric('es-ES', {ignore: ' '})
            .withMessage('Solo numeros en este campo'),   

            //POTENCIA MVA
            check('potenciainstalada', 'Ingrese la potencia instalada').trim().not().isEmpty()
            .isNumeric('es-ES', {ignore: ' '})
            .withMessage('Solo numeros-numeros decimales en este campo'),   
              
            //POTENCIA EFECTIVA
            check('potenciaefectiva', 'Ingrese la potencia efectiva').trim().not().isEmpty()
            .isNumeric('es-ES', {ignore: ' '})
            .withMessage('Solo numeros-numeros decimales en este campo'),   


            ],registro)

/* Actualizar Turbina */
router.post('/actualizar',
  [ //NOMBRE
  check('nombre', 'Ingrese un nombre valido. (mayor a 3 caracteres)').trim().not().isEmpty().withMessage('Escriba el nombre de una turbina')
  .isLength({ min: 2 })
  .withMessage('La especialidad tiene que ser mayor a 3 caracteres')
  .isAlphanumeric('es-ES', {ignore: ' '})
  .withMessage('Solo espacios y caracteres alfanumericos'),

  //MARCA
  check('marca', 'Ingrese una marca valida. (mayor a 3 caracteres)').trim().not().isEmpty().withMessage('Escriba el nombre de una turbina')
  .isLength({ min: 2 })
  .withMessage('La marca tiene que ser mayor a 3 caracteres')
  .isAlphanumeric('es-ES', {ignore: ' '})
  .withMessage('Solo espacios y caracteres alfanumericos'),              

  //MODELO
  check('modelo', 'Ingrese un modelo valido. (mayor a 3 caracteres)').trim().not().isEmpty().withMessage('Escriba el modelo del equipo')
  .isLength({ min: 3 })
  .withMessage('El modelo tiene que ser mayor a 3 caracteres')
  .isAlphanumeric('es-ES', {ignore: ' '})
  .withMessage('Solo espacios y caracteres alfanumericos'),              

  //NUMERO DE IDENTIFICACION
  check('numeroid', 'Ingrese un numero de identificacion. (mayor a 3 caracteres)').trim().not().isEmpty().withMessage('Ingrese un numero de identificacion')
  .isLength({ min: 3 })
  .withMessage('El modelo tiene que ser mayor a 3 caracteres')
  .isAlphanumeric('es-ES', {ignore: ' '})
  .withMessage('Solo espacios y caracteres alfanumericos'),              

  //VELOCIDAD RPM
  check('velocidad', 'Ingrese la velocidad nominal del equipo.').trim().not().isEmpty().withMessage('Ingrese la velocidad nominal')
  .isNumeric('es-ES', {ignore: ' '})
  .withMessage('Solo numeros en este campo'),              

  // TIPO DE COMBUSTIBLE 
  check('combustible','Seleccione una opcion')
  .custom((combustible,{req}) => {
    if (req.body.combustible === "false") {
        // trow error if passwords do not match
        throw new Error("Seleccione el tipo de combustible");
    } else {
        return combustible;
    }
  }),

  //POTENCIA ISO
  check('potenciaiso', 'Ingrese la potencia ISO').trim().not().isEmpty()
  .isNumeric('es-ES', {ignore: ' '})
  .withMessage('Solo numeros en este campo'),   

  //POTENCIA MVA
  check('potenciainstalada', 'Ingrese la potencia instalada').trim().not().isEmpty()
  .isNumeric('es-ES', {ignore: ' '})
  .withMessage('Solo numeros-numeros decimales en este campo'),   

  //POTENCIA EFECTIVA
  check('potenciaefectiva', 'Ingrese la potencia efectiva').trim().not().isEmpty()
  .isNumeric('es-ES', {ignore: ' '})
  .withMessage('Solo numeros-numeros decimales en este campo'),   


  ],actualizar)            

/*GET FORM EDIT para EDITAR Turbina*/
router.get('/editar/:id',isAuthenticated,authRol(["0","7"]),editar)            

/* JSON-Devuelve la lista de equipos-turbinas como JSON solamente */
router.get('/lista',isAuthenticated,authRol(["0","7"]), function(req, res, next) {
  Equipos.findAll({ order: [['updatedAt', 'DESC']]}).then(equipos => {
    res.json(equipos);
})});
module.exports = router;
