const jwe = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
//const conexion = require('../database/db');
const {promisify} = require('util');
const Especialidades = require('../models/Especialidades');
const { body, validationResult, check } = require('express-validator');

exports.registro = async (req, res) =>{
    try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
        console.log("ERRORES DE VALIUDACION:----------------"+errors);
        if (!errors.isEmpty()) {
            console.log(req.body)
            const valores = req.body
            const validaciones = errors.array()
            console.log("validaciones========"+JSON.stringify(validaciones));
            res.render('./especialidad/nuevo', { page_name:'especialidad',validaciones:validaciones, valores: valores });
            return;
        }
        var espNombre=req.body.especialidad;    
        const espExists = await Especialidades.findOne({ where: { especialidad:espNombre } });
         if (espExists ) {
           const msgError = "La especialidad: " + espNombre + ", ya se encuentra registrada."
           res.render('./especialidad/nuevo', { page_name:'especialidad', msgError:msgError, valores: espExists });
           return;
         }
        
            Especialidades.create({
                especialidad:req.body.especialidad,    
                estado:1,    
            }).then(especialidades=>{
                const msgok = "Especialidad: " + JSON.stringify(req.body.especialidad) + " creada con exito";
                res.render('./especialidad', { title: 'Especialidades', page_name:'especialidad', msgok:msgok });
            });

        
    } catch (error) {
        return next(err)
    }
  }
  
exports.estado = async (req, res, next) =>{
    try {
        const id = req.params.id;
        const estadoActual = await Especialidades.findOne({ where: { id:id } });
        
        if(estadoActual.estado===false){
            const result = await Especialidades.update(
                { estado: 1 },
                { where: { id: id } }
            )
            // return res.redirect("/panel/especialidad/"); 
            const msgEstado = "Estado '" + estadoActual.especialidad + "' actualizado con extio." 
            return res.render('./especialidad', { title: 'Especialidades', page_name:'especialidad', msgok:msgEstado});
        
      
        }else{
           
        const result = await Especialidades.update(
            { estado: 0 },
            { where: { id: id } }
        )
        // return res.redirect("/panel/especialidad/");
        const msgEstado = "Estado '" + estadoActual.especialidad + "' actualizado con extio." 
        return res.render('./especialidad', { title: 'Especialidades', page_name:'especialidad', msgok:msgEstado});
        }
        
      } catch (err) {
        console.log(err);
        return next(err);
        
      }
  }

exports.editar = async (req, res) =>{
    try {
        const id = req.params.id;
        const especilidadEditar = await Especialidades.findOne({ where: { id:id } });
        // return res.redirect("/panel/especialidad/"); 
        res.render('./especialidad/editar', { page_name:'especialidad',valores: especilidadEditar });
        
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
            return res.render('./especialidad/editar', { page_name:'especialidad',validaciones:validaciones, valores: valores });
            
        }
        
        const espExists = await Especialidades.findOne({ where: { especialidad:req.body.especialidad } });
        
         if (espExists){
            console.log("--------------------REPITIENDO UPDATE"+JSON.stringify(req.body));
             console.log("ESPECIALIDAD EXISTE========="+JSON.stringify(espExists));
           const msgError = "La especialidad: " + espExists.especialidad + ", ya se encuentra registrada."
          return res.render('./especialidad/editar', { page_name:'especialidad', msgError:msgError, valores: req.body });
          
         }
        //  console.log("BOBOBOBOBOBOBOBOBOBODDTDDYDYDYDYYDYDYDYD:"+JSON.stringify(req.body));
         
         const result = await Especialidades.update(
            { especialidad: req.body.especialidad },
            { where: { id: req.body.id } }
          )
          const espNombre = req.body.espcialidad;
          const msg = "Especialidad actualizada con exito: " +  JSON.stringify(req.body.especialidad)+".";
        //   return res.render('./especialidad', { title: 'Especialidades', page_name:'especialidad', msgok:msg });
          return res.render('./especialidad', { title: 'Especialidades', page_name:'especialidad', msgok:msg });
        
    } catch (error) {
        return next(error)
    }
  }






   
 





   

exports.login = async (req, res) =>{
    console.log("aqui estoy");
    console.log(req.body);

}