const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

class Especialidades extends Model {}
Especialidades.init({
    especialidad: DataTypes.STRING,
    estado: DataTypes.BOOLEAN,
    }, {
    sequelize,
    modelName: "especialidades"
});

module.exports = Especialidades;
