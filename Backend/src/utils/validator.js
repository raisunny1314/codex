const validator = require("validator");

const validate = (data)=>{
  const mandotaryField = ["first_name","email_id","password"];
  const isAllowed  = mandotaryField.every((k)=>Object.keys(data).includes(k));
  if(!isAllowed)
    throw new Error("some field missing");
 if(!validator.isEmail(data.email_id))
    throw new Error("email is not valid");
if(!validator.isStrongPassword(data.password))
    throw new Error("weak Password");
  
}

module.exports = validate;