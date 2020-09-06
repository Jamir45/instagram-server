const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// User Schema
const UserSchemaData = require('../Model/userModel')
// Secret Key
const secretKey = process.env.JWT_SECRET

module.exports.requireLogin = (req, res, next) => {
   const {authorization} = req.headers
   if (!authorization) {
      return res.status(401).send({error:"You are not sing in user"})
   }
   const token = authorization.replace("Bearer", "")
   jwt.verify(token, secretKey,(error, payload) => {
      if (error) {
         return res.status(401).send({error:"Sign in require"})
      }
      const {id} = payload
      UserSchemaData.findById(id).then(userData=> {
         req.user = userData
         next()
      })    
   })

   // if (req.signedCookies) {
   //    try {
   //       // Accessing cookie token from localStorage
   //       const cookieToken = req.signedCookies['requireLogin']
   //       // Verifying User 
   //       const verified = jwt.verify(cookieToken, secretKey)
   //       // Verified User
   //       const verifiedUser = await UserSchemaData.findById(verified.id)
   //       req.user = verifiedUser
   //       next()
   //    } catch (error) {
   //       res.status(401).send({error:"You are not sing in user"})
   //    }
   // }else{
   //    res.status(401).send({error:'You are not Sing In user'})
   // }
}