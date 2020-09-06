const express = require('express')
const router = express.Router()

// Our Own Middleware
const {requireLogin} = require('../Middleware/requireLogin')
const UserSchemaData = require('../Model/userModel')
const PostedData = require('../Model/postModel')

router.get('/user-profile/:userId', requireLogin, (req, res) => {
   console.log(req.params.userId)
   UserSchemaData.findOne({_id:req.params.userId})
   .then(user => {
      PostedData.find({postedBy:req.params.userId})
      .populate("postedBy", '_id name')
      .exec((error, post) => {
         if (error) {
            return res.status(422).send({error})
         }
         res.send({user, post})
      })
   })
   .catch (error => {
      res.status(500).send({error:"User is not found"})
   })
})

// Follow and Un-Follow
router.put('/follow', requireLogin, (req, res) => {
   UserSchemaData.findByIdAndUpdate(req.body.followId, {
         $push:{followers:req.user._id}
      },{
         new:true
      },(error, result) => {
      if (error) {
         return res.status(400).send({error})
      }
      UserSchemaData.findByIdAndUpdate(req.user._id, {
            $push:{following:req.body.followId}
         },{
            new:true
         })
         .then(result=> {
            res.send(result)
         })
         .catch(error => {
            return res.status(400).send({error})
         })
      }
   )
})

// Un-Follow
router.put('/un-follow', requireLogin, (req, res) => {
   UserSchemaData.findByIdAndUpdate(req.body.unFollowId, {
      $pull:{followers:req.user._id}
   },{
      new:true
   },(error, result) => {
      if (error) {
         return res.status(400).send(error)
      }
      UserSchemaData.findByIdAndUpdate(req.user._id, {
            $pull:{following:req.body.unFollowId}
         },{
            new:true
         })
         .then(result=> {
            res.send(result)
         })
         .catch(error => {
            return res.status(400).send(error)
         })
      }
   )
})

// Upload Profile Photo
router.put('/upload-profile-photo', requireLogin, (req, res)=> {
   console.log(req.body.profilePhoto)
   UserSchemaData.findByIdAndUpdate(req.user._id, {
      profile:req.body.profilePhoto,
      $push:{allPhoto:req.body.profilePhoto}
   }, {
      new:true
   })
   .exec((error, result) => {
      if (error) {
         res.status(400).send(error)
      }else{
         res.send(result)
      }
   })
})



module.exports = router