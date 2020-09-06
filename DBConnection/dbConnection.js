require('dotenv').config()
const mongoose = require('mongoose');

const uri = process.env.DB_PATH;
module.exports.DBConnection = async () => {
   try {
      await mongoose.connect( uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
      console.log("Database is successfully connected")
   } catch (error) {
      console.log("Connection Failed, Internal Server Error")
   }
}