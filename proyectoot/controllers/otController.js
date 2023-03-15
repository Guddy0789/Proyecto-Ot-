const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require('dotenv').config(); 
const { Op } = require("sequelize");
//const conexion = require('../database/db');
// const {promisify} = require('util');
const {validationResult} = require('express-validator');
const Especialidades = require('../models/Especialidades');
const User = require('../models/User');
const Equipos = require('../models/Equipos');
const Ot = require('../models/Ot');
const detalleot= require('../models/FormularioOt');
const kks= require('../models/kks');
const otc= require('../models/Otc');
//============REGISTRO DE OTS NUEVAS======================
exports.nuevo = async (req, res, next) =>{
   
   try {
    const idSupervisor = req.user.id;
    const idTecnico = req.params.id;
    const supervisor = await User.findOne({where:{id:idSupervisor}});
    const tecnico = await User.findOne({where: {id:idTecnico}});
    const turbinas = await Equipos.findAll({where: {estado: {[Op.notIn]: [0]}}});
    
    console.log("USUARIO SUPERVISOR:"+JSON.stringify(supervisor)); 
    console.log("USUARIO TECNICO"+JSON.stringify(tecnico)); 
    console.log("USUARIO TECNICO"+JSON.stringify(turbinas)); 

        return res.render('./ot/nuevo', { supervisor:supervisor, tecnico: tecnico, equipos:turbinas, page_name:"ot"});

    } catch (error) {
        console.log(error);
        return next(error)
    }
}
exports.registro=async(req,res,next)=>{
    
    try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
        console.log("POR SALVAR UNA ORDEN OT ASDASD id SUP"+JSON.stringify(req.body.idsupervisor));
        console.log("POR SALVAR UNA ORDEN OT ASDASD id TEC"+JSON.stringify(req.body.idtecnico));
        const idSupervisor = req.body.idsupervisor;
        const idTecnico = req.body.idtecnico;
        const idTurbina = req.body.turbina;
        const supervisor = await User.findOne({where:{id:idSupervisor}});
        const tecnico = await User.findOne({where: {id:idTecnico}});
        const turbinas = await Equipos.findAll();

        if (!errors.isEmpty()) {
            const valores = req.body
            const validaciones = errors.array()
            return res.render('./ot/nuevo', { validaciones:validaciones, valores: valores,page_name:"ot", supervisor:supervisor, tecnico: tecnico, equipos:turbinas});
            
        }        
        console.log("LLEGAMOS A GRABAR LA OT!!");
        Ot.create({
            idsupervisor: idSupervisor,
            idtecnico: idTecnico,
            idturbina: idTurbina,
            inicio: '',
            fin: '',
            estadotecnico:0, 
            estasupervisor:0,
        }).then(users=>{
            const msgok = "Orden de trabajo creada con exito";
            console.log("CREADUUU");
            return res.render('./ot/ordenes', {msgok:msgok,page_name:'ot',title:'Ordenes de Trabajo'});
        });


    } catch (error) {
        console.log(error);
        return next(error)
    }
}
exports.asignarotc=async(req,res,next)=>{
    const idformularioot = req.params.idformularioot
    const idot = req.params.idot
    const idkks = req.params.idkks
    const idtecnico = req.params.idtecnico
    const detalle = req.params.detalle
    const userEsp = await User.findAll({where: {id: idtecnico}});
    const espExists = await Especialidades.findAll({order: [['updatedAt', 'DESC']]});
    const esponly = await Especialidades.findAll({where: {id: userEsp[0].id_especialidad}});
    return res.render('./tecnicos/asignarotc', {title:"ASIGNAR OTC",page_name:"ot",idformularioot:idformularioot,idot:idot,idkks:idkks,esp:espExists,userEsp:userEsp,esponly:esponly,detalle:detalle});
}


exports.registrootc = async (req,res,next)=>{
    const idot = req.body.idot
    const idformularioot=req.body.idformularioot
    const idkks = req.body.idkks
    const detalle = req.body.detalle
    const idtecnico = req.body.tecnicos
// Rescato el id del supervisor de la session
        const idsupervisor = req.user.id;
        console.log('📕📕📕📕 error message5=================>'+JSON.stringify(idsupervisor));
    try {
        const userEsp = await User.findAll({where: {id: idtecnico}});
        const esponly = await Especialidades.findAll({where: {id: userEsp[0].id_especialidad}});
        const espExists = await Especialidades.findAll({order: [['updatedAt', 'DESC']]});
        const detalleOriginal = await detalleot.findAll({where: {idot: idot,idkks:idkks}});
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
        if (!errors.isEmpty()) {
            console.log("-------------------ERRORES DE FORM"+JSON.stringify(errors));
            const valores = req.body
            const validaciones = errors.array()
            console.log("validaciones========"+JSON.stringify(validaciones));
            return res.render('./tecnicos/asignarotc', {title:"ASIGNAR OTC",page_name:"ot",idformularioot:idformularioot,idot:idot,idkks:idkks,esp:espExists,userEsp:userEsp,esponly:esponly,detalleOriginal:detalleOriginal,detalle:detalleOriginal[0].detalle,validaciones:validaciones,valores: valores});
            
        }
        console.log("FREEEEEEEEEEEE OF ERRORSSSSSSSSSSSSSSSSSSSSSSSSS");
        await detalleot.update({estado: 2},{where:{id:idformularioot}})
        await otc.create({
            idformularioot:idformularioot,
            idot: idot,
            idtecnico:idtecnico,
            idsupervisor:idsupervisor,
            tarea:detalle,
            estadotecnico:0,
            estadosupervisor:0,
           
        }).then(orden=>{
            console.log("CREADUUUUUUUUUUUUU");
            const msgok = "Orden de trabajo correctiva creada con exito";
            const kksmsgok=true;
            
            return res.redirect('/ot/ordenesc/')
        });
    } catch (error) {
        console.log("Error al guardar OTC: "+error);
    }
}
exports.reporteotc = async (req,res,next)=>{
    const idotc = req.body.idotc
    const reporte = req.body.reporte
    // console.log("idotc:"+idotc+"-reporte:"+reporte);
    try {
        await otc.update({
            estadotecnico: 2,
            finaliza:Date.now(),
            reporte:reporte,
        },{where:{id:idotc}}).then(orden=>{
            console.log("CREADUUUUUUUUUUUUU");
            const msgok = "Orden de trabajo correctiva creada con exito";
            const kksmsgok=true;
            return res.redirect('/ot/pendientes-correctivas')
        });
    } catch (error) {
        console.log("Error al guardar OTC: "+error);
    }
}
exports.estadootc = async (req,res,next)=>{
    const idotc = req.params.idotc
    try {
        // await Ot.update({ estadotecnico: 1, inicia:Date.now(), },{ where: { id: idot } })
        await otc.update({
            estadotecnico: 1, inicia:Date.now()
        },{ where: { id: idotc} }).then(orden=>{
            console.log("Actualizado");
            const msgok = "Orden de trabajo correctiva creada con exito";
            const kksmsgok=true;
            return res.redirect('/ot/pendientes-correctivas/')
        });
    } catch (error) {
        console.log("Error al guardar OTC: "+error);
    }
}
exports.infpos = async (req,res,next)=>{
    const idotc = req.params.idotc
    try {
        // await Ot.update({ estadotecnico: 1, inicia:Date.now(), },{ where: { id: idot } })
        //0->Espera
        //1->Cancelado por el supervisor antes de iniciar SIN FALTA
        //2->Cancelado por el supervisor CON falta
        //3->Procesado por el supervisor SIN FALTA POSITIVO
        //4->Procesado por el supervisor CON FALTA NEGATIVO
        await otc.update({
            estadosupervisor: 3, inicia:Date.now()
        },{ where: { id: idotc} }).then(orden=>{
            console.log("Actualizado");
            const msgok = "Orden de trabajo correctiva modificada con exito";
            const kksmsgok=true;
            return res.redirect('/ot/ordenesc/')
        });
    } catch (error) {
        console.log("Error al guardar OTC: "+error);
    }
}
exports.infneg = async (req,res,next)=>{
    const idotc = req.params.idotc
    try {
        // await Ot.update({ estadotecnico: 1, inicia:Date.now(), },{ where: { id: idot } })
        await otc.update({
            estadosupervisor: 4, inicia:Date.now()
        },{ where: { id: idotc} }).then(orden=>{
            console.log("Actualizado");
            const msgok = "Orden de trabajo correctiva modificada con exito";
            const kksmsgok=true;
            return res.redirect('/ot/ordenesc/')
        });
    } catch (error) {
        console.log("Error al guardar OTC: "+error);
    }
}
exports.cerrarpos = async (req,res,next)=>{
    const idotc = req.params.idotc
    try {
        // await Ot.update({ estadotecnico: 1, inicia:Date.now(), },{ where: { id: idot } })
        //0->Espera
        //1->Cancelado por el supervisor antes de iniciar SIN FALTA
        //2->Cancelado por el supervisor CON falta
        //3->Procesado por el supervisor SIN FALTA POSITIVO
        //4->Procesado por el supervisor CON FALTA NEGATIVO
        await otc.update({
            estadosupervisor: 1, inicia:Date.now()
        },{ where: { id: idotc} }).then(orden=>{
            console.log("Actualizado");
            const msgok = "Orden de trabajo correctiva modificada con exito";
            const kksmsgok=true;
            return res.redirect('/ot/ordenesc/')
        });
    } catch (error) {
        console.log("Error al guardar OTC: "+error);
    }
}
exports.cerrarneg = async (req,res,next)=>{
    const idotc = req.params.idotc
    try {
        // await Ot.update({ estadotecnico: 1, inicia:Date.now(), },{ where: { id: idot } })
        await otc.update({
            estadosupervisor: 2, inicia:Date.now()
        },{ where: { id: idotc} }).then(orden=>{
            console.log("Actualizado");
            const msgok = "Orden de trabajo correctiva modificada con exito";
            const kksmsgok=true;
            return res.redirect('/ot/ordenesc/')
        });
    } catch (error) {
        console.log("Error al guardar OTC: "+error);
    }
}
exports.infposotd = async (req,res,next)=>{
    const idotd = req.params.idotd
    try {
        // await Ot.update({ estadotecnico: 1, inicia:Date.now(), },{ where: { id: idot } })
         //0->Espera
        //1->Cancelado por el supervisor antes de iniciar SIN FALTA
        //2->Cancelado por el supervisor CON falta
        //3->Procesado por el supervisor SIN FALTA POSITIVO
        //4->Procesado por el supervisor CON FALTA NEGATIVO
        await Ot.update({
            // estasupervisor: 3, inicia:Date.now()
            estasupervisor: 3,
        },{ where: { id: idotd} }).then(orden=>{
            console.log("Actualizado");
            const msgok = "Orden de trabajo correctiva modificada con exito";
            const kksmsgok=true;
            return res.redirect('/ot/ordenes/')
        });
    } catch (error) {
        console.log("Error al guardar OTC: "+error);
    }
}
exports.infnegotd = async (req,res,next)=>{
    const idotd = req.params.idotd
    try {
        // await Ot.update({ estadotecnico: 1, inicia:Date.now(), },{ where: { id: idot } })
         //0->Espera
        //1->Cancelado por el supervisor antes de iniciar SIN FALTA
        //2->Cancelado por el supervisor CON falta
        //3->Procesado por el supervisor SIN FALTA POSITIVO
        //4->Procesado por el supervisor CON FALTA NEGATIVO
        await Ot.update({
            // estasupervisor: 4, inicia:Date.now()
            estasupervisor: 4, 
        },{ where: { id: idotd} }).then(orden=>{
            console.log("Actualizado");
            const msgok = "Orden de trabajo correctiva modificada con exito";
            const kksmsgok=true;
            return res.redirect('/ot/ordenes/')
        });
    } catch (error) {
        console.log("Error al guardar OTC: "+error);
    }
}
exports.cancelarotd=async(req,res,next)=>{
    const idot = req.params.idot
    try {
        const estadoTecnico=await Ot.findAll({where: {id: idot}});

        if(estadoTecnico[0].estadotecnico!=0){
            return res.render('./ot/ordenes', { title: 'Ordenes de Trabajo Diarias', page_name:'ot',msgok:0 });
        }
        await Ot.update({ estasupervisor: 1},{ where: { id: idot } })
        return res.render('./ot/ordenes', { title: 'Ordenes de Trabajo Diarias', page_name:'ot',msgok:1 });
    } catch (error) {
        console.log("Error cancelando la OTD:"+error);
    }
}
exports.cancelarotdinforme=async(req,res,next)=>{
    const idot = req.params.idot
    try {
        const estadoTecnico=await Ot.findAll({where: {id: idot}});

        if(estadoTecnico[0].estadotecnico!=0){
            return res.render('./ot/ordenes', { title: 'Ordenes de Trabajo Diarias', page_name:'ot',msgok:0});
        }
        await Ot.update({ estasupervisor: 2},{ where: { id: idot } })
        return res.render('./ot/ordenes', { title: 'Ordenes de Trabajo Diarias', page_name:'ot',msgok:1 });
    } catch (error) {
        console.log("Error cancelando la OTD:"+error);
    }
}

//==============FORMULARIO PARA OTS========================
exports.formulario = async (req,res,next)=>{
    console.log("EN EL FORMULARIO!!!!!!!!!!!"+req.params.idot);
    const idot = req.params.idot
    const kkslistaURL = "/ot/kkslista/"+idot; 
    const kksmsgok="false";

    await Ot.update({ estadotecnico: 1, inicia:Date.now(), },{ where: { id: idot } })
    console.log("sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
    return res.render('./tecnicos/formulario', {title:"OT Diaria",page_name:"ot",idot:idot,kkslistaURL:kkslistaURL,kksmsgok:kksmsgok});
}
exports.formularioreanudar = async (req,res,next)=>{
    const idot = req.params.idot
    const kkslistaURL = "/ot/kkslista/"+idot; 
    const kksmsgok="false";
    return res.render('./tecnicos/formulario', {title:"OT Diaria",page_name:"ot",idot:idot,kkslistaURL:kkslistaURL,kksmsgok:kksmsgok});
}

exports.cerrarotdiaria=async(req,res,next)=>{
    const idot=req.params.idot;
    // console.log('📕: idot:'+req.params.idot);
      try {
        const kkslistaURL = "/ot/kkslista/"+idot; 
        const kksmsgok="OT Diaria finalizada con exito.";
        const kksmsgError="Debe concluir todos los KKs para cerrar esta OT.";
        const kkscount = await kks.count();
        const kkssolved = await detalleot.count({
            where: { idot: idot },
          });
          console.log('📕: kkscount:'+kkscount);
          console.log('📕: kkssolved:'+kkssolved);
          if(kkssolved==kkscount){
            console.log('📕: entra al if:');
            await Ot.update({ estadotecnico: 2, finaliza:Date.now(), },{ where: { id: idot } })
            return res.render('./tecnicos/ordenes', {title:"OT Diaria",page_name:"ot",idot:idot,kkslistaURL:kkslistaURL,kksmsgok});
          }
          return res.render('./tecnicos/formulario', {title:"OT Diaria",page_name:"ot",idot:idot,kkslistaURL:kkslistaURL,kksmsgError});
          
        
      } catch (error) {
        console.log('📕: Error cerrar ot:'+error);
      }
}
exports.informeotd=async(req,res,next)=>{
    console.log("INFORME OTD");
    const idot = req.params.idot;
    const idtecnico = req.params.idtecnico;
    const kkslistaURL = "/ot/kkslistasup/"+idot; 
    // await Ot.update({ estadotecnico: 1, inicia:Date.now(), },{ where: { id: idot } })
    try {
        return res.render('./tecnicos/informeotd', {title:"OT Diaria",page_name:"ot",idot:idot,kkslistaURL:kkslistaURL,idtecnico:idtecnico});    
    } catch (error) {
        console.log("error al desplegar informeOTD"+error);
    }
    
}

// exports.tecnicosjson=async(req,res,next)=>{
//     const userEsp = await User.findAll({where: {id_especialidad: 2}});
//     return res.render('./tecnicos/asignarotc', {title:"Asignar Orden Correctiva",page_name:"ot",idot:idot,esp:espExists,userEsp:userEsp});
// }

exports.registroot = async (req,res,next)=>{
    try {
    console.log("idot:"+req.params.idot+"dataid:"+req.params.dataid+"ok:"+req.params.ok);
    const kkslistaURL = "/ot/kkslista/"+req.params.idot; 
    const idot = req.params.idot;
    const dataid = req.params.dataid;
    const ok = req.params.ok;
    const error = req.params.error;
    console.log("*******************************************************EL OOOOOOOOOOOOOOOOOK:"+ok);
    // let estado=1;
    // if(ok==0)
    // {estado=0;}
    
    //Verificando para no registrar mas de una vez el ESTADO:OK
    // const kksOk = await detalleot.findOne({ where: { idkks:dataid,idot:idot } });
    // if (kksOk.estado==1){
    //    console.log("----------YA ESTA EN ESTADO OOOOKKKKKKKKKKKKK");
    //     console.log("ESPECIALIDAD EXISTE========="+JSON.stringify(espExists));
    //   const msgError = "La especialidad: " + espExists.especialidad + ", ya se encuentra registrada."
    //  return res.render('./especialidad/editar', { page_name:'especialidad', msgError:msgError, valores: req.body });
    // }
    
    await detalleot.create({
        idot: idot,
        idkks: dataid,
        estado: ok,
       
    }).then(users=>{
        const msgok = "Orden de trabajo creada con exito";
        console.log("CREADUUU");
        // return res.render('./tecnicos/formulario', {title:"OT Diaria",page_name:"ot",idot:idot});
        const kksmsgok=true;
       
        // return res.render('./tecnicos/formulario', {title:"OT Diaria",page_name:"ot",idot:idot,kkslistaURL:kkslistaURL,kksmsgok:kksmsgok});
        return res.redirect('/ot/formularioreanudar/'+idot+'')
        
        // return res.redirect('/ot/formulario/'+idot+'/'+kksmsgok+'')
        
    });
    
        
    } catch (error) {
        console.log("ERROR AL GRABAR FORM : "+error);
        
    }
    
}

exports.registroerror = async (req,res,next)=>{
    try {
        const detalle = req.body.detalle;
        const idot = req.body.idot;
        const idkks = req.body.idkks;
        console.log("-REGISTRO-----------------------------------------------datealle:"+detalle+"-idot:"+idot+"-idkks:"+idkks);
        await detalleot.create({
            idot: idot,
            idkks: idkks,
            estado: 0,
            // ok: DataTypes.INTEGER,
             detalle: detalle,
            // caudal: caudal,
            // temperatura: temperatura,
            // presion: presion,
            // nivel: nivel,
            // onof: onof,
        }).then(users=>{
            return res.redirect('/ot/formularioreanudar/'+idot+'')
        });
    } catch (error) {
            console.log("ERROR AL GRABAR FORM : "+error);
        
    }
    
}
exports.updateot = async (req,res,next)=>{
    try {
    console.log("idot:"+req.params.idot+"dataid:"+req.params.dataid+"ok:"+req.params.ok);
    const kkslistaURL = "/ot/kkslista/"+req.params.idot; 
    const idot = req.params.idot;
    const dataid = req.params.dataid;
    const ok = req.params.ok;
    const error = req.params.error;
    console.log("*******************************************************EL OOOOOOOOOOOOOOOOOK:"+ok);
    await detalleot.update({
        estado: 1,
        detalle:""
        
      }, {
        where: {idkks : dataid,idot:idot  },
        // returning: true,
        // plain: true
      })
      .then(users=>{
        const msgok = "Orden de trabajo creada con exito";
        return res.redirect('/ot/formularioreanudar/'+idot+'')
    });
    
        
    } catch (error) {
        console.log("ERROR AL GRABAR FORM : "+error);
        
    }
    
}
exports.updateerror = async (req,res,next)=>{
    try {
    console.log("UPDATEE ERRRORR YEEEEYYYYYYYYYYYYYY");
    console.log("idot:"+req.params.idot+"dataid:"+req.params.dataid+"ok:"+req.params.ok);
    const kkslistaURL = "/ot/kkslista/"+req.params.idot; 
    const detalle = req.body.detalle;
    const idot = req.body.idot;
    const idkks = req.body.idkks;
    await detalleot.update({
        estado: 0,
        detalle:detalle},{
        where: {idkks : idkks,idot:idot},})
    .then(users=>{
        return res.redirect('/ot/formularioreanudar/'+idot+'')
    });
    
        
    } catch (error) {
        console.log("ERROR AL GRABAR FORM : "+error);
        
    }
    
}
exports.cambioaerror = async (req,res,next)=>{
    try {
    console.log("UPDATEE ERRRORR YEEEEYYYYYYYYYYYYYY");
    console.log("idot:"+req.params.idot+"dataid:"+req.params.dataid+"ok:"+req.params.ok);
    const kkslistaURL = "/ot/kkslista/"+req.params.idot; 
    const detalle = req.body.detalle;
    const idot = req.body.idot;
    const idkks = req.body.idkks;
    await detalleot.update({
        estado: 0,
        detalle:detalle},{
        where: {idkks : idkks,idot:idot},})
    .then(users=>{
        return res.redirect('/ot/formulario/'+idot+'')
    });
    
        
    } catch (error) {
        console.log("ERROR AL GRABAR FORM : "+error);
        
    }
    
}
exports.registrodetalle = async (req,res,next)=>{
    
    try {
        const idot = req.body.idotdetalle;
        const idkks = req.body.idkksdetalle;
        const voltaje =req.body.voltaje;
        const amperaje =req.body.amperaje;
        const detalle = req.body.detalletext;
        const estado = req.body.estado;
        let bateria;
        (req.body.checkOk==1) ? bateria=1 : bateria=0;
        // console.log("REGISTROOO DETALLLE!!!!!!!!!!!!!!!!!!!!!!!!"+idot+"!"+idkks+"!");
        // console.log('%c Oh my batery! ', 'background: #222; color: #bada55'+bateria);
        
        
        console.log('📕: error message:'+estado);
    await detalleot.create({
        idot: idot,
        idkks: idkks,
        estado: estado,
        bateria: bateria,
        voltaje:voltaje,
        amperaje:amperaje,
        detalle: detalle,
        // caudal: caudal,
        // temperatura: temperatura,
        // presion: presion,
        // nivel: nivel,
        // onof: onof,
    }).then(users=>{
        return res.redirect('/ot/formulario/'+idot+'')
    });
    } catch (error) {
        console.log("ERROR AL GRABAR FORM : "+error);
    }
}
exports.updateregistrodetalle = async (req,res,next)=>{
    console.log("updateregistrodetalle----------------------------");
    try {
    let bateria;
    (req.body.checkOk==1) ? bateria=1 : bateria=0;
    console.log("bateriaaaaaaaaaaaaa:"+bateria);
    const kkslistaURL = "/ot/kkslista/"+req.params.idot; 
    const idot = req.body.idotdetalle;
    const idkks = req.body.idkksdetalle;
    
    const voltaje =req.body.voltaje;
    const amperaje =req.body.amperaje;
    const detalle = req.body.detalletext;
    await detalleot.update({
        estado: bateria,
        bateria: bateria,
        voltaje:voltaje,
        amperaje:amperaje,
        detalle:detalle
        },
        {
        where: {idkks : idkks,idot:idot},})
    .then(users=>{
        return res.redirect('/ot/formulario/'+idot+'')
    });
    
        
    } catch (error) {
        console.log("ERROR AL GRABAR FORM : "+error);
        
    }
    
}




