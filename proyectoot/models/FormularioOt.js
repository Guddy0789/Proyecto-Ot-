const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/db');


class FormularioOt extends Model {}
FormularioOt.init({
    idot: DataTypes.INTEGER,
    idkks: DataTypes.INTEGER,
    estado: DataTypes.INTEGER,
    detalle: DataTypes.STRING,
    
        //  bateria: DataTypes.INTEGER,
        //  voltaje: DataTypes.FLOAT,
        //  amperaje: DataTypes.FLOAT,
    
    // caudal: DataTypes.STRING,
    // temperatura: DataTypes.STRING,
    // presion: DataTypes.STRING,
    // nivel: DataTypes.STRING,
    // onof: DataTypes.STRING,
    
    
}, {
    sequelize,
    modelName: "formularioot"
});

module.exports = FormularioOt;