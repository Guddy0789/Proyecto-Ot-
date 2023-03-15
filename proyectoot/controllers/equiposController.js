const jwe = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
//const conexion = require('../database/db');
const {promisify} = require('util');
const Equipos = require('../models/Equipos');
const { body, validationResult, check } = require('express-validator');

exports.registro = async (req, res, next) =>{
    
  try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
        if (!errors.isEmpty()) {
            const valores = req.body
            const validaciones = errors.array()
           return res.render('./equipos/nuevo', { page_name:'equipos', validaciones:validaciones, valores: valores });
             
        }
        var equipoId=req.body.numeroid;    
        const equipoExists = await Equipos.findOne({ where: { numeroid:equipoId } });
         if (equipoExists ) {
          const valores = req.body
           const msgError = "La turbina: " + equipoId + ", ya se encuentra registrada, utilice otro NUMERO DE IDENTIFICACION"
          return res.render('./equipos/nuevo', { page_name:'equipos', msgError:msgError, valores: valores });
           
         }
        
            Equipos.create({
              nombre: req.body.nombre,
              marca:req.body.marca,
              modelo: req.body.modelo,
              numeroid:req.body.numeroid,
              velocidad: req.body.velocidad,
              combustible: req.body.combustible,
              potenciaiso:req.body.potenciaiso,
              potenciainstalada:req.body.potenciainstalada,
              potenciaefectiva:req.body.potenciaefectiva,
              estado:1,    
            }).then(equipos=>{
                const msgok = "Turbina: " + JSON.stringify(req.body.nombre) + " creada con exito";
               return res.render('./equipos/equipos', { title: 'Turbinas', page_name:'equipos', msgok:msgok });
            });

        
    } catch (error) {
        return next(error)
    }
}


exports.actualizar = async (req, res, next) =>{
  console.log("--------------------INDA FUKING UPDATEEE"+JSON.stringify(req.body));
  try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
      if (!errors.isEmpty()) {
          console.log("-------------------ERRORES DE FORM"+JSON.stringify(req.body));
          console.log(req.body)
          const valores = req.body
          const validaciones = errors.array()
          console.log("validaciones========"+JSON.stringify(validaciones));
          return res.render('./equipos/editar', { title: 'Turbinas', page_name:'equipos',validaciones:validaciones, valores: valores });
          
      }
      
      const turbinaExists = await Equipos.findOne({ where: {numeroid:req.body.numeroid } });
       
      if (turbinaExists){
       if (turbinaExists.id!=req.body.id){
        console.log("ID DEL FORMULARIO============>"+req.body.id);
        console.log("ID DE LA CONSULTA EXISTS=====>"+turbinaExists.id);
        const msgError = "El numero de indentificacion: "+turbinaExists.numeroid+" ya existe."
        const valores = req.body
       return res.render('./equipos/editar', {title: 'Turbinas', page_name:'equipos', msgError:msgError, valores: valores });
       }
      }
       console.log("entro al ifffffffffffff");
       await Equipos.update(
         { 
           nombre: req.body.nombre,
           marca:req.body.marca,
           modelo: req.body.modelo,
           numeroid:req.body.numeroid,
           velocidad: req.body.velocidad,
           combustible: req.body.combustible,
           potenciaiso:req.body.potenciaiso,
           potenciainstalada:req.body.potenciainstalada,
           potenciaefectiva:req.body.potenciaefectiva,
                     
         },{ where: { id: req.body.id } }
       )
       
       const msg = "Turbina actualizada con exito: " +  JSON.stringify(req.body.nombre)+".";
     //   return res.render('./especialidad', { title: 'Especialidades', page_name:'especialidad', msgok:msg });
       return res.render('./equipos/equipos', { title: 'Turbinas', page_name:'equipos', msgok:msg });
       
       
      
  } catch (error) {
      return next(error)
  }
}

exports.editar = async (req, res) =>{
    try {
      console.log("EDITANDO UNA TURBINAAAAAAAAAAAAAAAAAAAAAAAAA");
        const id = req.params.id;
        const equipoExists = await Equipos.findOne({ where: { id:req.params.id } });
        
        console.log("EDITANDO UNA TURBINAAAAAAAAAAAAAAAAAAAAAAAAA=======>"+id);
        const title="Editando: "+equipoExists.nombre;
      return  res.render('./equipos/editar', {title:title, page_name:'equipos',valores: equipoExists });
        
      } catch (err) {
        console.log(err);
      }
  }
  

exports.detalle = async (req, res, next) =>{
  
    try {
      
        const id = req.params.id;
        
          // const result = await Equipos.findOne({ where: { id: id }})
          const result = await Equipos.findOne({where:{id: id}})
          
          const equipoURL = "/equipos/turbina/"+id; 
          const idturbina = id; 
        
          return res.render('./equipos/detalle', { title: "Equipo: "+result.nombre, page_name:'equipos', equipo:result, equipoURL:equipoURL, idturbina:idturbina});
      } catch (err) {
        console.log(err);
        return next(err);
        
      }
  }  


exports.estado = async (req, res, next) =>{
    try {
        const id = req.params.id;
        const estadoActual = await Equipos.findOne({ where: { id:id } });
        
        if(estadoActual.estado==false){
            const result = await Equipos.update(
                { estado: 1 },
                { where: { id: id } }
            )
            // return res.redirect("/panel/especialidad/"); 
            const msgEstado = "Estado '" + estadoActual.nombre + "' actualizado con extio." 
            return res.render('./equipos/equipos', { title: 'Turbinas', page_name:'equipos', msgok:msgEstado});
        
      
        }else{
           
        const result = await Equipos.update(
            { estado: 0 },
            { where: { id: id } }
        )
        // return res.redirect("/panel/especialidad/");
        const msgEstado = "Estado '" + estadoActual.nombre + "' actualizado con extio." 
        return res.render('./equipos/equipos', { title: 'Turbinas', page_name:'equipos', msgok:msgEstado});
        }
        
      } catch (err) {
        console.log(err);
        return next(err);
        
      }
  }





   