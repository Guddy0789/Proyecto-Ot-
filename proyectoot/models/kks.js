const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

class Kks extends Model {}
Kks.init({
        kks: DataTypes.TEXT,
        // general:DataTypes.STRING,
        general: {
            type: DataTypes.TEXT,
            
        },
        especifica:DataTypes.STRING,
        orden: DataTypes.SMALLINT,
        estado: DataTypes.BOOLEAN,
    }, {
    sequelize,
    modelName: "kks"
});
module.exports = Kks;