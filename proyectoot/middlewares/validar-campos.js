const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {

  // manejo de errores
  const errors = validationResult( req );
  console.log("----------------------");
  console.log(errors);
  console.log("----------------------");
  if ( !errors.isEmpty() ) {
    console.log("---------Sin Errores-------------");
      return res.status(400).json({
          "ok": false,
          "errors": errors.mapped()
      });
  }


  next();
}

module.exports = {
  validarCampos
}
