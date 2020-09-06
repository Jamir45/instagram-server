const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
   name:{
      type:String,
      required:true
   },
   email:{
      type:String,
      required:true,
      unique:true
   },
   password:{
      type:String,
      required:true,
      minlength: [8, "Password Will Be Minimum 8 Character"],
   },
   profile:{type:String},
   allPhoto:[{type:String}],
   followers:[{type:ObjectId, ref:"UserSchemaData"}],
   following:[{type:ObjectId, ref:"UserSchemaData"}]
})

const UserSchemaData = mongoose.model("UserSchemaData", userSchema)
module.exports = UserSchemaData