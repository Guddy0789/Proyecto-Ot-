const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/db');


class Otc extends Model {}
Otc.init({
    idformularioot: { 
        type:DataTypes.INTEGER,
        // foreignKey: true,
    },
    idot: DataTypes.INTEGER,
    idtecnico: DataTypes.INTEGER,
    idsupervisor: DataTypes.INTEGER,
    tarea:DataTypes.STRING,
    reporte:DataTypes.STRING,
    estadotecnico:DataTypes.INTEGER,
    estadosupervisor:DataTypes.INTEGER,
    inicia:{ 
        type: DataTypes.DATE,
        defaultValue: null
    },
    finaliza:{ 
        type: DataTypes.DATE,
        defaultValue: null
    },
  

}, {
    sequelize,
    modelName: "otc"
});

module.exports = Otc;