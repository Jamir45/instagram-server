const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// User Schema
const UserSchemaData = require('../Model/userModel')
const e = require('express')

// Our Own Middleware
const {requireLogin} = require('../Middleware/requireLogin')

// SignUp Route
router.post('/sing-up', async (req, res) => {
   await console.log(req.body)
   try {
      let {name, email, password} = req.body 
      if(!name || !email || !password){
         return res.send({error:"Please Fill All The Field."})
      }

      let savedUser = await UserSchemaData.findOne({email:email})
      if (savedUser) {
         return res.send({error:"Email is already used Please try another email."})
      }
      
      let hashedPassword = await bcrypt.hash(password, 10)
      const user = new UserSchemaData({
         name,
         email,
         password: hashedPassword
      })
      await user.save()
      res.send({success:"Registration Success"})
   } catch (error) {
      res.send(error.message)
   }
})

const secretKey = process.env.JWT_SECRET
// Login Route
router.post('/login', async (req, res) => {
   const {email, password} = req.body
   console.log(req.body)
   try {
      // Check Email
      const savedUser = await UserSchemaData.findOne({email:email})
      if (!savedUser) {
         res.status(400).send({error:"Email is not correct"})
      }
      // Check Password
      const correctPassword = await bcrypt.compare(password, savedUser.password)
      if (!correctPassword) {
         res.status(400).send({error:"Password is not match"})
      }
      // Generate token from user registration and Login Success message
      const token = jwt.sign({id:savedUser._id}, secretKey)
      // res.cookie('requireLogin', token, {
      //    httpOnly:true,
      //    sameSite:true,
      //    signed:true
      // });
      // savedUser.password = undefined
      const {_id, name, followers, following} = savedUser
      const Email = savedUser.email
      res.status(200).send({token, user:{_id, name, Email, followers, following }})
   } catch (error) {
      res.status(500).send(error.message) 
   }
})


module.exports = router