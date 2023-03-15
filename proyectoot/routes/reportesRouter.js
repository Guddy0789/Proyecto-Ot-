var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
const {isAuthenticated, estadoSupervisor} = require('../controllers/authController')
const { detalle, estado, editar,actualizar} = require('../controllers/equiposController')
const {registro,formulario,registroot,updateot,registroerror,updateerror,registrodetalle,updateregistrodetalle,cerrarotdiaria,informeotd,asignarotc,tecnicosjson,registrootc,estadootc,reporteotc,cancelarotd,cancelarotdinforme,infpos,infneg,cerrarpos,cerrarneg,infposotd,infnegotd} = require('../controllers/otController')
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

/* JSON KKs  REPORTES */
router.get('/tecnico-hora',isAuthenticated,authRol(["1"]), function(req, res, next) {
 
  const idSupervisor = req.user.id;
  try {
    Ot.findAll({
          attributes: ['id','inicia','finaliza',
          // [Sequelize.fn(Sequelize.fn('SUM', Sequelize.col('estasupervisor')+10)), 'result'],
          // [Sequelize.literal('ListPrice * 1.15'), 'NewPrice'],
          //  Sequelize.fn('timestampdiff', Sequelize.literal('hour'), Sequelize.col('inicia'), Sequelize.fn('now'))
          // [Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('MINUTE'), Sequelize.col('finaliza'), Sequelize.col('inicia')), 'differenceInHours'],
            // [Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('MINUTE'), Sequelize.col("inicia"), Sequelize.col("finaliza")), 'timePlayed']
            [Sequelize.literal((Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('MINUTE'), Sequelize.col("inicia"), Sequelize.col("finaliza"))*10), 'timePlayed')],
           
// [sequelize.fn(Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('MINUTE'), Sequelize.col("inicia"), Sequelize.col("finaliza")) * 2 ), 'average'],
        ],

    }
    ).then(ordenes => {res.json(ordenes);}).catch(error => res.send({ status: false, error: error }));
  } catch (error) {
    console.log("ERROR EN EL REPORTE:"+error);
  }
});
router.get('/tecnico-otd',isAuthenticated,authRol(["1"]), function(req, res, next) {
 
  const idSupervisor = req.user.id;
  try {
    User.findAll({
      attributes: ['id','nombre','id_especialidad'],
      where: { rol:2},
      include: [{
        model: Ot, 
        as: 'Tecnico',
        where: { estaSupervisor:3},
                attributes: ['inicia','finaliza',
           [Sequelize.fn("COUNT", Sequelize.col("estasupervisor")), "total"],
           [Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('MINUTE'), Sequelize.col("inicia"), Sequelize.col("finaliza")), 'timePlayed'],

          // [Sequelize.fn('count',Sequelize.fn('SUM', Sequelize.col('estasupervisor'))+10), 'result'], FUNCIONA
          [Sequelize.fn('SUM',(Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('MINUTE'), Sequelize.col("inicia"), Sequelize.col("finaliza")))), 'Minutos'],

          
        ],
      
        required:false,
      }],  
      group: "nombre",
    }
    ).then(ordenes => {res.json(ordenes);}).catch(error => res.send({ status: false, error: error }));;
  } catch (error) {
    console.log("ERROR EN EL REPORTE:"+error);
  }
});
router.get('/turbina-total-errores',isAuthenticated,authRol(["1"]), function(req, res, next) {
  // const idSupervisor = req.user.id;
  try {
    Equipos.findAll({
      attributes: ['id','nombre','estado'
      // [Sequelize.fn("COUNT", Sequelize.col("nombre")), "total"]
    ],
      group: ['nombre' ], 
      order: [['nombre', 'ASC']],   
      include: [{
        model: Ot, 
        as: 'Turbina',
        attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("idturbina")), "total"]
      ],
        required:true,
      }],  
    }).then(reporte => {res.json(reporte);});
  }catch (error) {
    console.log("kksreporte error_"+error)
  }
});  
router.get('/detallejson-turbina-kks/:idturbina',isAuthenticated,authRol(["1"]),function(req,res,next){
  const idturbina=req.params.idturbina
  console.log("LLEGANDOOOOOOOOOOOOOOOOOOOOOOOOOO:+biien"+idturbina);
  try {
    formularioot.findAll({
      where: { estado:2},
      attributes: ['idkks','idot',
        [Sequelize.fn("COUNT", Sequelize.col("idkks")), "total"],
        
      ],
    group: ['idkks'],
    order: [['idot', 'ASC']],    
     include: [{
      
        model: kks, 
        attributes: ['id','kks'],
         required:true,
        
      },{
        model: Ot, 
        where: { idturbina:idturbina},
        attributes: ['id','idturbina'],
         include: [{model:Equipos, required: true, as: 'Turbina',attributes: ['id','nombre']}],
        //  group: ['id'],
      }],  
    }
    ).then(reporte => {res.json(reporte);});
  }catch (error) {
    console.log("kksreporte error_"+error)
  }
})
router.get('/turbinasreporte',isAuthenticated,authRol(["1"]),function(req,res,next){
  try {
    Equipos.findAll({
      attributes: ['id','nombre','estado'],
      // group: ['nombre' ], 
      order: [['nombre', 'ASC']],   
      include: [{
        model: Ot, 
        as: 'Turbina',
        attributes: ['id','idturbina'],
        group: ['idturbina','idot' ],
        required:true,
         include: [{
          model: formularioot, 
           where: { estado:2},
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
/*----------------- RES RENDER VISTAS REPORTES---------------------------- */
/* REPORTE TURBINA - KKS */
router.get('/turbina-kks',isAuthenticated,authRol(["1"]), function(req, res, next) {
  res.render('./reportes/turbina-kks', { title: 'Reporte Turbina - OTDs', page_name:'reporteturbina' });
});
/* REPORTE DETALLe - TURBINA - KKS */
router.get('/detalle-turbina-kks/:idturbina',isAuthenticated,authRol(["1"]), function(req, res, next) {
  
  const idturbina=req.params.idturbina
  const urljson="/detallejson-turbina-kks/"+idturbina;
  // console.log(detallejson);
  res.render('./reportes/detalle-turbina-kks', { title: 'Detalle Turbina - KKs', page_name:'reporteturbina', urljson:urljson });
  
})

/* REPORTE TECNICO - OTD */
router.get('/tecnicos-otd',isAuthenticated,authRol(["1"]), function(req, res, next) {
  res.render('./reportes/tecnicos-otd', { title: 'Reporte Tecnico - OTDs', page_name:'tecnicos-otd' });
});

module.exports = router;