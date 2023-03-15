const jwe = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
//const conexion = require('../database/db');
const {promisify} = require('util');
const kks = require('../models/kks');
const { body, validationResult, check } = require('express-validator');
const sequelize = require('../database/db');
const { utimes } = require('fs');

exports.registro = async (req, res, next) =>{
  console.log("------------------------------------------------KKS!"+JSON.stringify(req.body));
    try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
        console.log("ERRORES DE VALIUDACION:----------------"+JSON.stringify(errors));
        if (!errors.isEmpty()) {
            console.log(req.body)
            const valores = req.body
            const validaciones = errors.array()
            console.log("validaciones========"+JSON.stringify(validaciones));
            res.render('./kks/nuevo', { page_name:'kks',validaciones:validaciones, valores: valores });
            return;
        }
        var kksNombre=req.body.kks;    
        const kksExists = await kks.findOne({ where: { kks:kksNombre } });

        
        
        if (kksExists) {
           const msgError = "La herramienta kks: " + kksNombre + ", ya se encuentra registrada."
           res.render('./kks/nuevo', { page_name:'kks', msgError:msgError, valores: kksExists });
           return;
         }

         var ultimoOrden = await kks.findAll({attributes: [[sequelize.fn('MAX', sequelize.col('orden')), 'orden'],]});
         ultimoOrden.map(obj => obj.toJSON()).forEach(obj => {console.log(obj.orden);})
         console.log("================OORDENNN:"+JSON.stringify(ultimoOrden[0].orden)+"-----------");
         var kksNombre=req.body.kks;    
         var general=req.body.general;   
         var especifica=req.body.especifica;    
         var orden=ultimoOrden[0].orden+1;    
            await kks.create({
              kks:kksNombre,    
              general:general,
              especifica:especifica,
              orden:orden,
              estado:1,    
            }).then(kks=>{
                const msgok = "KKs: " + JSON.stringify(req.body.kks) + " creado con exito";
                res.render('./kks/kks', { title: 'Herramientas KKs', page_name:'kks', msgok:msgok });
            });

        
    } catch (error) {
        return next(error)
    }
  }
  
exports.estado = async (req, res, next) =>{
    try {
        const id = req.params.id;
        const estadoActual = await kks.findOne({ where: { id:id } });
        
        if(estadoActual.estado===false){
            const result = await kks.update(
                { estado: 1 },
                { where: { id: id } }
            )
            // return res.redirect("/panel/especialidad/"); 
            const msgEstado = "Estado '" + estadoActual.especialidad + "' actualizado con extio." 
            return res.render('./kks/kks', { title: 'Herramientas KKs', page_name:'kks', msgok:msgEstado});
        
      
        }else{
           
        const result = await kks.update(
            { estado: 0 },
            { where: { id: id } }
        )
        // return res.redirect("/panel/especialidad/");
        const msgEstado = "Estado '" + estadoActual.especialidad + "' actualizado con extio." 
        return res.render('./kks/kks', { title: 'Herramientas KKs', page_name:'kks', msgok:msgEstado});
        }
        
      } catch (err) {
        console.log(err);
        return next(err);
        
      }
  }

exports.editar = async (req, res) =>{
    try {
        const id = req.params.id;
        
        const kksEditar = await kks.findOne({ where: { id:id } });
        // return res.redirect("/panel/especialidad/"); 
        res.render('./kks/editar', { page_name:'kks',valores: kksEditar });
        
      } catch (err) {
        console.log(err);
      }
  }

exports.actualizar = async (req, res, next) =>{
    
    try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
        if (!errors.isEmpty()) {
            console.log("-------------------ERRORES DE FORM"+JSON.stringify(req.body));
            const valores = req.body
            const validaciones = errors.array()
            console.log("validaciones========"+JSON.stringify(validaciones));
            return res.render('./kks/editar', { page_name:'kks',validaciones:validaciones, valores: valores });
        }
        const kksExists = await kks.findOne({ where: { kks:req.body.kks } });
         
         if (kksExists){
          if (kksExists.id!=req.body.id){
           const valores = req.body
           const msgError = "La herramienta KKs: " + kksExists.kks + ", ya se encuentra registrada."
           return res.render('./kks/editar', { page_name:'kks', msgError:msgError, valores: req.body });
          
          }
         }
         const result = await kks.update(
            { 
              kks: req.body.kks,
              general:req.body.general,
              especifica:req.body.especifica,
              orden:req.body.orden,   
            
            },
            { where: { id: req.body.id } }
          )
          const espNombre = req.body.kks;
          const msg = "KKs actualizado con exito: " +  JSON.stringify(req.body.kks)+".";
        //   return res.render('./especialidad', { title: 'Especialidades', page_name:'especialidad', msgok:msg });
          return res.render('./kks/kks', { title: 'Herramientas KKs', page_name:'kks', msgok:msg });
        
    } catch (error) {
        return next(error)
    }
  }






   
 





   

exports.login = async (req, res) =>{
    console.log("aqui estoy");
    console.log(req.body);

}