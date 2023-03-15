const Especialidades = require('../models/Especialidades');
const User = require('../models/User');
const Ot = require('../models/Ot');
const Equipos = require('../models/Equipos');
const formularioot = require('../models/FormularioOt');
const kks = require('../models/kks');
const Otc = require('../models/Otc');
// Uno a uno

// Usuario tiene una direccion
// añadir una clave foranea userId a la tabla addresses
// Especialidades.hasOne(User, {foreignKey: "Id_especialidad" });FUNCIONA
// Añade una clave userId a la tabla addresses
//Address.belongsTo(User, { as: "residente", foreignKey: "residente_id" });EJEMPLO
User.belongsTo(Especialidades, {
      foreignKey: "id_especialidad" 
    });
//  Ot.belongsTo(User,{foreignKey:"idtecnico"})
//  Ot.belongsTo(User,{foreignKey:"idsupervisor"})

Ot.belongsTo(User, {
    as: 'Supervisor',
    foreignKey: 'idsupervisor'
  });
  User.hasOne(Ot, {
    as: 'Supervisor',
    foreignKey: 'idsupervisor'
  });
  
Ot.belongsTo(User, {
    as: 'Tecnico',
    foreignKey: 'idtecnico'
  });
User.hasOne(Ot, {
    as: 'Tecnico',
    foreignKey: 'idtecnico'
  });

  Ot.belongsTo(User, {
    as: 'reporte',
    foreignKey: 'idtecnico'
  });
User.hasOne(Ot, {
    as: 'reporte',
    foreignKey: 'idtecnico'
  });








Ot.belongsTo(Equipos, {
    as: 'Turbina',
    foreignKey: 'idturbina'
  });  
Equipos.hasOne(Ot, {
  as: 'Turbina',
  foreignKey: 'idturbina'
});  
  

// RELACION UNO A MUCHOS 
Ot.hasMany(formularioot, {foreignKey: 'idot',constraints: false})
// formularioot.belongsTo(Ot);
formularioot.belongsTo(Ot, { foreignKey: 'idot', constraints: false})
// formularioot.belongsTo(Ot,{
//   as: 'Estado',
//   foreignKey: 'idot'
// });
// formularioot.belongsTo(kks,{
//      as: 'Ot',
//      foreignKey: 'idkks'
//  })
kks.hasMany(formularioot, {foreignKey: 'idkks',constraints: false})
// formularioot.belongsTo(kks)
formularioot.belongsTo(kks, { foreignKey: 'idkks', constraints: false})
// formularioot.belongsTo(kks,{
//      as: 'Ot'})

// OTDIARIA tiene MUCHAS OTCORRECTIVAS
// formularioot.hasMany(Otc, {foreignKey: 'idformularioot', constraints: false})
// Otc.belongsTo(formularioot, {foreignKey: 'idformularioot', constraints: false})
formularioot.hasMany(Otc, {foreignKey: 'idformularioot', constraints: false})
Otc.belongsTo(formularioot, { foreignKey: 'idformularioot', constraints: false})


Otc.belongsTo(User, {
  as: 'Tecnico',
  foreignKey: "idtecnico" 
});


Otc.belongsTo(User, {
  as: 'Supervisor',
  foreignKey: "idsupervisor" 
});



// EJEMPLo
// Team.hasMany(Player, {
//   foreignKey: 'clubId'
// });
// Player.belongsTo(Team);