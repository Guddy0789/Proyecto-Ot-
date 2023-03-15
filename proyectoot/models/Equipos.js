const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/db');


class Equipos extends Model {}
Equipos.init({
    nombre: DataTypes.STRING,
    marca: DataTypes.STRING,
    modelo: DataTypes.STRING,
    // numeroid: DataTypes.STRING,
    numeroid: {type: DataTypes.STRING,allowNull: false,unique: true},
    velocidad: DataTypes.STRING,
    combustible: DataTypes.STRING,
    potenciaiso: DataTypes.STRING,
    potenciainstalada:DataTypes.STRING,
    potenciaefectiva:DataTypes.STRING,
    estado:DataTypes.INTEGER,
    
}, {
    sequelize,
    modelName: "equipos"
});

module.exports = Equipos;