const {response}=require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req,res=response,next) =>{
    
    //x-token headers
    const token = req.header('x-token');
    
  if(!token)
  {
        return res.status(401).json({
            ok:false,
            msg:'no hay token en la peticion'
        })
  }

  try {
      const {uid,email} =  jwt.verify(
          token,
          process.env.SECRET_JWT_SEED
      );
      
      req.uid=uid;
      req.email=email;
      console.log(uid+email);




      
  } catch (error) {
      return res.status(401).json({
          ok:false,
          msg:'Token no valido'
      })
  }
    
    next();



}

module.exports={
    validarJWT,
}