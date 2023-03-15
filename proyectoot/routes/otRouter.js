var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
const {isAuthenticated, estadoSupervisor} = require('../controllers/authController')
const { detalle, estado, editar,actualizar} = require('../controllers/equiposController')
const {registro,formulario,registroot,updateot,registroerror,updateerror,registrodetalle,updateregistrodetalle,cerrarotdiaria,informeotd,asignarotc,tecnicosjson,registrootc,estadootc,reporteotc,cancelarotd,cancelarotdinforme,infpos,infneg,cerrarpos,cerrarneg,infposotd,infnegotd,formularioreanudar} = require('../controllers/otController')
const {nuevo}=require('../controllers/otController')
const {authRol} = require('../middlewares/rol')
const User = require('../models/User')
const Equipos = require('../models/Equipos')
const Ot = require('../models/Ot')
const Otc = require('../models/Otc')
const kks = require('../models/kks')
const formularioot = require('../models/FormularioOt')
const { body, validationResult, check } = require('express-validator');
const { request } = require('../app');
const Sequelize = require('../database/db');
const FormularioOt = require('../models/FormularioOt');


/* GET LISTA DE OTs  */
router.get('/ordenes',isAuthenticated,authRol(["1"]), function(req, res, next) {
  res.render('./ot/ordenes', { title: 'Ordenes de Trabajo Diarias', page_name:'ot',msgok:3 });
  
  
});
/* GET LISTA DE OTCs  */
router.get('/ordenesc',isAuthenticated,authRol(["1"]), function(req, res, next) {
  res.render('./ot/ordenesc', { title: 'Ordenes de Trabajo Correctivas', page_name:'otc' });
  
});

/* GET LISTA DE OTs DIARIAS para TECNICOS */
router.get('/pendientes',isAuthenticated,authRol(["2"]), function(req, res, next) {
  const nombre=req.user.nombre;
  res.render('./tecnicos/ordenes', { title: 'Ordenes Diarias', page_name:'ot',nombreuser:nombre, rango:"Tecnico" });
  
});
/* GET LISTA DE OTs Correctivas para TECNICOS */
router.get('/pendientes-correctivas',isAuthenticated,authRol(["2"]), function(req, res, next) {
  res.render('./tecnicos/ordenes-correctivas', { title: 'Ordenes Correctivas', page_name:'otcorrectiva' });
  
});

/*VISTA FORM para crear una nueva OT*/
router.get('/nuevo/:id',isAuthenticated,authRol(["1"]),nuevo)


/*POST FORM para crear un nuevo equipo*/
router.post('/nuevo',
            [ //NOMBRE
            check('turbina','Seleccione una turbina')
            .custom((turbina,{req}) => {
              if (req.body.turbina === "false") {
                  // trow error if passwords do not match
                  throw new Error("Seleccione una turbina");
              } else {
                  return turbina;
              }
          }),
            ],registro)

/* Actualizar Turbina */
router.post('/actualizar',
  [ //NOMBRE
  check('nombre', 'Ingrese un nombre valido. (mayor a 3 caracteres)').trim().not().isEmpty().withMessage('Escriba el nombre de una turbina')
  .isLength({ min: 2 })
  .withMessage('La especialidad tiene que ser mayor a 3 caracteres')
  .isAlphanumeric('es-ES', {ignore: ' '})
  .withMessage('Solo espacios y caracteres alfanumericos'),

 
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
],actualizar)            

/*GET FORM EDIT para EDITAR Turbina*/
router.get('/editar/:id',isAuthenticated,authRol(["0","7"]),editar)            

/* JSON-Devuelve la lista de equipos-turbinas como JSON solamente */
router.get('/ordenesjson',isAuthenticated,authRol(["1","7","0","2"]), function(req, res, next) {
  try {
    
  
    Ot.findAll({ 
      where: {
        estasupervisor: {[Op.notIn]: [1,2]},
        
      },
      include: [
       {
        model: User,
        as:'Supervisor',
        attributes: ['nombre','celular'],
        
      },{
        model: User,
        as:'Tecnico',
        attributes: ['nombre','correo'],
        
      },{
        model: Equipos,
        as:'Turbina',
        attributes: ['nombre','numeroid'],
        
      }]
      }).then(ordenes => {res.json(ordenes);})
   
  } catch (error) {
    console.log("ERROR EN LAS ORDENES:"+error);
  }
});  

/* JSON-Devuelve la lista de equipos-turbinas como JSON solamente */
router.get('/ordenescjson',isAuthenticated,authRol(["1","7","0","2"]), function(req, res, next) {
  // const idtecnico = req.user.id;
  // console.log("-----------------------------------------------IDTECNICO:"+idtecnico);
  try {
    Otc.findAll({  
      where: {
        estadosupervisor: {[Op.notIn]: [1,2]},
        // idtecnico:idtecnico,
      },
      include:[
          { 
            model:formularioot,
            include: [
              {
               model: Ot,
               required: true,
               attributes: ['id','idsupervisor','idtecnico'],
               include: [{model:User, required: true, as: 'Supervisor',attributes: ['id','nombre']},
                         {model:User, required: true, as: 'Tecnico',attributes: ['id','nombre']},
                         {model:Equipos, required: true, as: 'Turbina',attributes: ['id','nombre']}],
              }, // true for INNER JOIN
              {model: kks, required: true} // false for LEFT OUTER JOIN
            ],
          }, { 
            model: User,
            as:'Supervisor',
            attributes: ['nombre'],
          },{
            model: User,
            as:'Tecnico',
            attributes: ['nombre','correo'],
            
          }
        ],
    }).then(ordenesc => {res.json(ordenesc);})
  } catch (error) {
    console.log("ERROR EN LAS ORDENES:"+error);
  }
});  
/* JSON-Devuelve la lista de equipos-turbinas como JSON solamente */
router.get('/ordenescjsontec',isAuthenticated,authRol(["1","7","0","2"]), function(req, res, next) {
  const idtecnico = req.user.id;
  console.log("-----------------------------------------------IDTECNICO:"+idtecnico);
  try {
    Otc.findAll({  
      where: {
        estadosupervisor: {[Op.notIn]: [1,2]},
        idtecnico:idtecnico,
      },
      include:[
          { 
            model:formularioot,
            include: [
              {
               model: Ot,
               required: true,
               attributes: ['id','idsupervisor','idtecnico'],
               include: [{model:User, required: true, as: 'Supervisor',attributes: ['id','nombre']},
                         {model:User, required: true, as: 'Tecnico',attributes: ['id','nombre']},
                         {model:Equipos, required: true, as: 'Turbina',attributes: ['id','nombre']}],
              }, // true for INNER JOIN
              {model: kks, required: true} // false for LEFT OUTER JOIN
            ],
          }, { 
            model: User,
            as:'Supervisor',
            attributes: ['nombre'],
          },{
            model: User,
            as:'Tecnico',
            attributes: ['nombre','correo'],
            
          }
        ],
    }).then(ordenesc => {res.json(ordenesc);})
  } catch (error) {
    console.log("ERROR EN LAS ORDENES:"+error);
  }
});  

/* JSON-Devuelve la lista de OTS DIARIAS pendiente a los tecnicos */
// const idSupervisor = req.user.id;
router.get('/pendientesjson',isAuthenticated,authRol(["2"]), function(req, res, next) {
  // const idSupervisor = req.user.id;
  try {
    //  Ot.findAll({where:{idtecnico:req.user.id}}).then(ots => {res.json(ots);});
    Ot.findAll({ 
      where: { estasupervisor:0},
      include: [
       {
        model: User,
        as:'Supervisor',
        attributes: ['nombre','celular'],
        
      },{
        model: User,
        as:'Tecnico',
        attributes: ['nombre','correo'],
         where: { id:req.user.id}
        
      },{
        model: Equipos,
        as:'Turbina',
        attributes: ['nombre','numeroid'],
        
      },
      
      ]
      }).then(ordenes => {res.json(ordenes);})
   
  } catch (error) {
    console.log("ERROR EN LAS ORDENES:"+error);
  }
});  
/* JSON-Devuelve la lista de OTS CORRECTIVAS pendientes a los tecnicos */
// const idSupervisor = req.user.id;
router.get('/pendientes-correctivasjson',isAuthenticated,authRol(["2"]), function(req, res, next) {
  // const idSupervisor = req.user.id;
  try {
    //  Ot.findAll({where:{idtecnico:req.user.id}}).then(ots => {res.json(ots);});
    Otc.findAll({  
      where:{estadosupervisor:0},
      include:[
          { 
            model:formularioot,

            include: [
              {
               model: Ot,
               required: true,
               attributes: ['idsupervisor','idtecnico'],
               include: [{model:User, as: 'Supervisor',attributes: ['nombre']},
                         {model:User, as: 'Tecnico',attributes: ['nombre']},
                         {model:Equipos, as: 'Turbina',attributes: ['nombre']}],
              }, // true for INNER JOIN
              {model: kks, required: true} // false for LEFT OUTER JOIN
            ],
          }
        ],
    }).then(ordenesc => {res.json(ordenesc);})
   
  } catch (error) {
    console.log("ERROR EN LAS ORDENES:"+error);
  }
});  
/* Actializar estado OTC */
router.get('/estado-correctivas/:idotc',isAuthenticated,authRol(["2"]),estadootc)

/* Formulario OT */
router.get('/formulario/:idot/',isAuthenticated,authRol(["2"]),formulario)

/* Reaundar Formulario OT */
router.get('/formularioreanudar/:idot/',isAuthenticated,authRol(["2"]),formularioreanudar)


/* Cerrar OT diaria - esta ejecuta el tenico cuando termina la OTD*/
router.get('/cerrarotdiaria/:idot/',isAuthenticated,authRol(["2"]),cerrarotdiaria)

/* Cancelar OT diaria - esta ejecuta el supervisor cuando cancela una OTD SIN reporte*/
router.get('/cancelarotd/:idot/',isAuthenticated,authRol(["1"]),cancelarotd)
/* Cancelar OT diaria - esta ejecuta el supervisor cuando cancela una OTD CON reporte*/
router.get('/cancelarotdinforme/:idot/',isAuthenticated,authRol(["1"]),cancelarotdinforme)

/* Procesar INF positivo OTC - esta ejecuta el supervisor cuando cierra una otc+*/
router.get('/infpos/:idotc/',isAuthenticated,authRol(["1"]),infpos)
/* Procesar INF negativo OTC - esta ejecuta el supervisor cuando cierra una otc-*/
router.get('/infneg/:idotc/',isAuthenticated,authRol(["1"]),infneg)

/* Procesar INF positivo OTD - esta ejecuta el supervisor cuando cierra una OTD+*/
router.get('/infposotd/:idotd/',isAuthenticated,authRol(["1"]),infposotd)
/* Procesar INF negativo OTD - esta ejecuta el supervisor cuando cierra una OTD-*/
router.get('/infnegotd/:idotd/',isAuthenticated,authRol(["1"]),infnegotd)


/* Cancelar positivo OTC - esta ejecuta el supervisor cuando CANCELA una otc+*/
router.get('/cerrarpos/:idotc/',isAuthenticated,authRol(["1"]),cerrarpos)
/* Cancelar negatico OTC - esta ejecuta el supervisor cuando CANCELA una otc- con llamada de atencion*/
router.get('/cerrarneg/:idotc/',isAuthenticated,authRol(["1"]),cerrarneg)



/* Informe OT diaria*/
router.get('/informeotd/:idot/:idtecnico',isAuthenticated,authRol(["1"]),informeotd)
/* Asignar OTC */
router.get('/asignarotc/:idformularioot/:idot/:idkks/:idtecnico/:detalle',isAuthenticated,authRol(["1"]),asignarotc)
/* JSON USUARIOS DISPONIBLES PARA OTC */
router.get('/tecnicosjson/:idesp',isAuthenticated,authRol(["1"]),function(req, res, next) {
  try {
    User.findAll({where: {rol: 2,id_especialidad:req.params.idesp}}).then(especialidad => {res.json(especialidad);});
    
   
  } catch (error) {
    console.log("ERROR AL LISTAR TECNICOS DISPONIBLES:"+error);
  }
});  



/*POST FORM MODAL DE ERROR*/
router.post('/registroerror',isAuthenticated,authRol(["2"]),registroerror)
/*POST FORM MODAL DE ERROR-UPDATE*/
router.post('/updateerror',isAuthenticated,authRol(["2"]),updateerror)
/*POST FORM MODAL DE OK A ERROR-UPDATE*/
router.post('/cambioaerror',isAuthenticated,authRol(["2"]),updateerror)
/*POST FORM MODAL REGISTRO DETALLE OK*/
router.post('/registrodetalle',isAuthenticated,authRol(["2"]),registrodetalle)
/*POST FORM MODAL REGISTRO DETALLE OK A ERROR*/
router.post('/updateregistrodetalle',isAuthenticated,authRol(["2"]),updateregistrodetalle)
/*POST FORM OTC*/
router.post('/registrootc',[
  // check('detalle', 'Ingrese una kks valida. (mayor a 2 caracteres)').trim()
  // .not()
  // .isEmpty()
  // .withMessage('Escriba una tarea.')
  // .isAlphanumeric('es-ES', {ignore: ' '})
  // .withMessage('Solo espacios y caracteres alfanumericos'),

  check("detalle")
  .trim()
  .not().isEmpty()
  .withMessage("Ingrese la descripcion de la tarea a realizar.")
  .matches(/^[a-zA-Z0-9\-,\.\(\)\#\/\s^m³°\{\}\[\]]+$/)
  .withMessage("Solo se permiten los siguientes caracteres: alfanumericos, guiones, puntos, comas, parentesis, numerales, espacios, potencias y centigrados.")
  .isLength({ min: 5 })
  .withMessage('La descripción de la tarea tiene que ser mayor a 5 caracteres'),
  
  
  
  
  
  
  
  check('tecnicos', 'Seleccione un tecnico').trim().not().isEmpty(),










],isAuthenticated,authRol(["1"]),registrootc)
/*POST FORM REPORTE OTC POPUP*/
router.post('/reporteotc',isAuthenticated,authRol(["2"]),reporteotc)





/* Registro OT */
router.get('/registroot/:idot/:dataid/:ok',isAuthenticated,authRol(["2"]),registroot)
router.get('/updateot/:idot/:dataid/:ok',isAuthenticated,authRol(["2"]),updateot)
router.get('/registroot/:idot/:dataid/:error',isAuthenticated,authRol(["2"]),registroot)
/* JSON KKs */
router.get('/kkslista/:id',isAuthenticated,authRol(["2","1"]),function(req,res,next){
  try {
    const id=req.params.id
    kks.findAll({ 
      include: [{
        model: formularioot, 
        attributes: ['id','estado','detalle','createdAt'],
        where:{idot: id},required:false}],
        order: [['orden', 'ASC']],      
      }).then(kks => {res.json(kks)})
  } catch (error) {
    console.log(error)
  }
})
router.get('/kkslistasup/:id',isAuthenticated,authRol(["1"]),function(req,res,next){
  try {
    const id=req.params.id
    kks.findAll({ 
      include: [{
        model: formularioot, 
        attributes: ['id','estado','detalle','createdAt'],
        where:{idot: id},required:false}],
        order: [['orden', 'ASC']],      
      }).then(kks => {res.json(kks)})
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;



/* JSON KKs  REPORTES */
router.get('/reporteotcjson',isAuthenticated,authRol(["1"]), function(req, res, next) {
  // const idSupervisor = req.user.id;
  try {
    Otc.findAll({
      attributes: [
       "estadosupervisor",
        [Sequelize.fn("COUNT", Sequelize.col("estadosupervisor")), "total"],
      ],
      group: "estadosupervisor",
    }
    ).then(ordenes => {res.json(ordenes);});
  } catch (error) {
    console.log("ERROR EN EL REPORTE:"+error);
  }
});
router.get('/reportekksjson',isAuthenticated,authRol(["1"]), function(req, res, next) {
  // const idSupervisor = req.user.id;
  try {
    formularioot.findAll({
      where: { estado:2},
      attributes: [
       "idkks",
        [Sequelize.fn("COUNT", Sequelize.col("idkks")), "Kks total:"],
      ],
      group: "idkks",
    }
    ).then(ordenes => {res.json(ordenes);});
  } catch (error) {
    console.log("ERROR EN EL REPORTE:"+error);
  }
});  
router.get('/kksreporte',isAuthenticated,authRol(["1"]),function(req,res,next){
  
  
  try {
    formularioot.findAll({
      where: { estado:2},
      attributes: ['idkks','idot',
        [Sequelize.fn("COUNT", Sequelize.col("idkks")), "Kks Con error TOTAL:"],
      ],
    group: ['idkks','idot' ],
    order: [['idot', 'ASC']],    
     include: [{
        model: kks, 
        attributes: [
          'kks',
         ],
         required:true
      },{
        model: Ot, 
        attributes: [
          'id','idturbina'
         ],
         required:true,
         include: [{model:Equipos, required: true, as: 'Turbina',attributes: ['id','nombre']}],
      }],  
      
    }
    ).then(ordenes => {res.json(ordenes);});
  }catch (error) {
    console.log("kksreporte error_"+error)
  }
})
router.get('/turbinasreporte',isAuthenticated,authRol(["1"]),function(req,res,next){
  try {
    Equipos.findAll({
      attributes: ['id','nombre','estado'],
      group: ['nombre' ], 
      order: [['nombre', 'ASC']],   
      include: [{
        model: Ot, 
        as: 'Turbina',
        attributes: ['id','idturbina'],
        group: ['idturbina','idot' ],
        required:true,
         include: [{
          model: formularioot, 
        //   where: { estado:2},
        //   attributes: ['idkks','idot',
        //     [Sequelize.fn("COUNT", Sequelize.col("idkks")), "Kks Con error TOTAL:"],
        //   ],
        group: ['idkks','idot' ],
        // order: [['idot', 'ASC']],     
        }],  
        
      }],  
    }).then(ordenes => {res.json(ordenes);});
  }catch (error) {
    console.log("kksreporte error_"+error)
  }
})

/* REPORTE TURBINA - KKS */
router.get('/reporteturbinas',isAuthenticated,authRol(["1"]), function(req, res, next) {
  res.render('./reportes/turbina-kks', { title: 'Reporte Turbina - KKs', page_name:'reporteturbina' });
  
});