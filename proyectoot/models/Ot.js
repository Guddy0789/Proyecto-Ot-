const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/db');


class Ot extends Model {}
Ot.init({
    idsupervisor: DataTypes.INTEGER,
    idtecnico: DataTypes.INTEGER,
    idturbina: DataTypes.INTEGER,
    inicia: DataTypes.DATE,
    finaliza: DataTypes.DATE,
    estadotecnico: DataTypes.INTEGER,
    estasupervisor: DataTypes.INTEGER,
    
}, {
    sequelize,
    modelName: "ot"
});

module.exports = Ot;