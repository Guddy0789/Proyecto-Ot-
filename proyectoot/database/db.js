  const Sequelize = require('sequelize');
  const { development, production } = require('../config/config');
  //require('dotenv').config(); 
  
  
  const sequelize = new Sequelize(development.database,development.username,development.password,{
      host:development.host,
      dialect:'postgres',
      port: development.port,
      DATABASE_URL: process.env.DATABASE_URL,
  })


  
  //Sync crea las tablas, FORECE:true ==> hace un drop tables
  //  sequelize.sync({ force: true}) NO USAR
  
  //  sequelize.sync({ alter: true })
  //  sequelize.sync({ force: false})
  
  sequelize.sync({ force: false})
    .then(() => {
      console.log('\x1b[32m','Conectado a la base de datos PROYECTO OT.');
    })
    .catch(err => {
      console.error('\x1b[41m','Error al conectar a la base de datos:', err);
    });

    module.exports = sequelize;

//Conexion sin ORM

// const mysql = require('mysql')
// const conexion = mysql.createConnection({
//     host : process.env.DB_HOST,
//     user : process.env.DB_USER,
//     password :  process.env.DB_PASS,
//     database : process.env.DB_DATABASE,
    
    
// })

// conexion.connect((error)=>{

//     if(error){
//         console.log("Error de conexion:"+error);
//         return;
//     }
//     console.log('Conectado con exito a la BDD Mysql');
//     try {
        
//     } catch (error) {
        
//     }

// })

// module.exports = conexion