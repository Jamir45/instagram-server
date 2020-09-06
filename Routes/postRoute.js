const express = require('express')
const router = express.Router()

// Our Own Middleware
const {requireLogin} = require('../Middleware/requireLogin')
const PostedData = require('../Model/postModel')
// const { populate } = require('../Model/postModel')

// Post Data
router.post('/create-post', requireLogin, async (req, res) => {
   const {title, postBody, image} = req.body
   console.log(req.body)
   try {
      req.user.password = undefined
      const post = new PostedData({
         title,
         postBody,
         image,
         postedBy:req.user
      })
      await post.save()
      res.status(200).send({success:"Post is successfully posted"})
      console.log(req.user)
   } catch (error) {
      res.status(500).send(error.message)
   }
})

// Delete Post
router.delete('/delete-post/:postId', requireLogin, (req, res) => {
   PostedData.findOne({_id:req.params.postId})
   .populate("postedBy", "_id")
   .exec((error, post)=>{
      if (error || !post) {
         return res.status(400).send(error)
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
         post.remove()
         .then(result => {
            res.send(result)
         })
         .catch(error => {
            console.log(error)
         })
      }

   })
})

// To Get All the post
router.get('/all-post', requireLogin, async (req, res) => {
   try {
      const posts = await PostedData.find()
      .populate("postedBy", "_id name email")
      .populate("comments.commentedBy", "_id name")
      res.send(posts)
   } catch (error) {
      res.status(500).send(error.message)
   }
})

// To Get All the post
router.get('/following-user-post', requireLogin, async (req, res) => {
   try {
      const posts = await PostedData.find({postedBy:{$in:req.user.following}})
      .populate("postedBy", "_id name email")
      .populate("comments.commentedBy", "_id name")
      res.send(posts)
   } catch (error) {
      res.status(500).send(error.message)
   }
})

// To Get a single post for a Specific user.
router.get('/my-post', requireLogin, async (req, res) => {
   try {
      const myPost = await PostedData.find({postedBy:req.user._id})
      res.send(myPost)
   } catch (error) {
      res.send(error.message)
   }
})

// For add like on post
router.put('/like', requireLogin, (req, res) => {
   PostedData.findByIdAndUpdate(req.body.postId, {
      $push:{likes:req.user._id}
   },{
      new:true
   })
   .populate("postedBy", "_id name email")
   .populate("comments.commentedBy", "_id name")
   .exec((err, result) => {
      if (err) {
         return res.status(400).send({error:err})
      }else{
         res.send(result)
      }
   })
})

// For add unlike on post
router.put('/unlike', requireLogin, (req, res) => {
   PostedData.findByIdAndUpdate(req.body.postId, {
      $pull:{likes:req.user._id}
   },{
      new:true
   })
   .populate("postedBy", "_id name email")
   .populate("comments.commentedBy", "_id name")
   .exec((err, result) => {
      if (err) {
         return res.status(400).send({err})
      }else{
         res.send(result)
      }
   })
})

// For add comment on post
router.put('/comment', requireLogin, (req, res) => {
   const comment = {
      text:req.body.text,
      commentedBy:req.user._id
   }
   PostedData.findByIdAndUpdate(req.body.postId, {
      $push:{comments:comment}
   },{
      new:true
   })
   .populate("postedBy", "_id name email")
   .populate("comments.commentedBy", "_id name")
   .exec((err, result) => {
      if (err) {
         return res.status(400).send({err})
      }else{
         res.send(result)
      }
   })
})



module.exports = router