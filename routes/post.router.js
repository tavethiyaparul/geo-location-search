const express = require('express')
const router = express.Router()
const passport= require('passport')
require('../middleware/passport')(passport)

const { createPost,activeAndInactiveCount,updatePost,deletePost,searchPost } = require('../controllers/post.controller')

router.route("/createpost").post(passport.authenticate('jwt',{session:false}),createPost)
router.route("/editpost/:id").put(passport.authenticate('jwt',{session:false}),updatePost)
router.route("/removepost/:id").delete(passport.authenticate('jwt',{session:false}),deletePost)
router.route("/activecount").get(passport.authenticate('jwt',{session:false}),activeAndInactiveCount)
// post retrive latitude and longitude
router.route("/searchpost").post(searchPost)
module.exports= router 