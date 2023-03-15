const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/db');


class User extends Model {}
User.init({
    correo: DataTypes.STRING,
    password: DataTypes.STRING,
    nombre: DataTypes.STRING,
    carnet: DataTypes.STRING,
    sangre: DataTypes.STRING,
    direccion: DataTypes.STRING,
    celular: DataTypes.STRING,
    id_especialidad:DataTypes.INTEGER,
    celempresa:DataTypes.STRING,
    rol:DataTypes.INTEGER,
    estado:DataTypes.INTEGER,
}, {
    sequelize,
    modelName: "user"
});

module.exports = User;