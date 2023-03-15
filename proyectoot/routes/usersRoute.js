var express = require('express');
var router = express.Router();
const {isAuthenticated,estadoSupervisor,estadoTecnico,estadoAdministrador, supervisorNuevo, administradorNuevo, tecnicoNuevo,perfilTecnico} = require('../controllers/authController')
const {authRol} = require('../middlewares/rol')
const User = require('../models/User')
const Especialidad = require('../models/Especialidades')

/* GET Tecnicos  */
router.get('/tecnico',isAuthenticated,authRol(["0","1","7"]), function(req, res, next) {
  res.render('./usuarios/tecnicos', { title: 'Técnicos', page_name:'tecnicos' });
  
});

/* GET ASIGNAR Tecnicos  */
router.get('/asignar',isAuthenticated,authRol(["1"]), function(req, res, next) {

  const nombre=req.user.nombre;
  
  res.render('./usuarios/asignartecnico', { title: 'Técnicos', page_name:'tecnicos', nombreuser:nombre, rango:"Supervisor" });
  
});

/* GET PERFIL Tecnicos  */
// router.get('/perfil/:id',isAuthenticated,authRol(["0","7"]),perfilTecnico)


/* GET Supervisores  */

router.get('/supervisor',isAuthenticated,authRol(["0","7"]), function(req, res, next) {
  res.render('./usuarios/supervisores', { title: 'Supervisores', page_name:'supervisores' });
  
});

/* GET Administradores  */

router.get('/administrador',isAuthenticated,authRol(["0","7"]), function(req, res, next) {
  const nombre=req.user.nombre;
  res.render('./usuarios/administradores', { title: 'Administradores', page_name:'administradores', nombreuser:nombre, rango:"Administrador" });
  
});

 /* GET JSON Tecnicos  */
router.get('/tecnicos',isAuthenticated,authRol(["0","1","7"]), function(req, res, next) {
  User.findAll({
    where: {rol: 2},
    include: { model: Especialidad, required: true, },
    
  }).then(tecnicos => {
    res.json(tecnicos);
  })});
 /* GET JSON Supervisores  */
router.get('/supervisores',isAuthenticated,authRol(["0",,"7"]), function(req, res, next) {
  User.findAll({
    where: {rol: 1},
    include: { model: Especialidad, required: true, },
    
  }).then(supervisores => {
    res.json(supervisores);
  })});
  /* GET JSON Administradores  */
router.get('/administradores',isAuthenticated,authRol(["0","7"]), function(req, res, next) {
  User.findAll({
    where: {rol: 0},
    include: { model: Especialidad, required: true, },
    
  }).then(administradores => {
    res.json(administradores);
  })});


/*Cambiar estado de un TECNICO*/
router.get('/tecnico/estado/:id',isAuthenticated,authRol(["0","7"]),estadoTecnico)

/*Cambiar estado de un SUPERVISOR*/
router.get('/supervisor/estado/:id',isAuthenticated,authRol(["0","7"]),estadoSupervisor)

/*Cambiar estado de un ADMINISTRADOR*/
router.get('/administrador/estado/:id',isAuthenticated,authRol(["0","7"]),estadoAdministrador)

/*Hacer Supervisor*/
router.get('/supervisor/nuevo/:id',isAuthenticated,authRol(["0","7"]),supervisorNuevo)

/*Hacer Administrador*/
router.get('/administrador/nuevo/:id',isAuthenticated,authRol(["0","7"]),administradorNuevo)

/*Hacer Tecnico*/
router.get('/tecnico/nuevo/:id',isAuthenticated,authRol(["0","7"]),tecnicoNuevo)


module.exports = router;
