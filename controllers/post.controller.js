const ErrorHander = require("../utils/errorheandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../models/post.model");
var geoip = require("geoip-lite");

exports.createPost = catchAsyncError(async (req, res, next) => {
  const { title, body_data, active } = req.body;

    //ip address
  console.log("ipaddress: ", req.ip);
  var geo = geoip.lookup(req.ip);
  const location = {
    type: 'Point',
    coordinates: [ geo.ll[0], geo.ll[1]]
  }

  const post = await Post.create({
    title,
    body_data,
    active,
    createdBy: req.user.id,
    location:location,
  });

  res.status(201).json({
    success: true,
    post,
    message:post && "Post created successfully",
  });
});

exports.activeAndInactiveCount = catchAsyncError(async (req, res, next) => {
  const allPosts = await Post.find({createdBy:req.user.id}); // Retrieve all the posts from the database
  const activePosts = allPosts.filter(post => post.active); // Filter the active posts
  const inactivePosts = allPosts.filter(post => !post.active); // Filter the inactive posts
  const postCounts = {
    active: activePosts.length,
    inactive: inactivePosts.length
  };
  return res.status(200).json({
    success: true,
    postCounts
  });
});

exports.updatePost = catchAsyncError(async (req, res, next) => {
  const {title, body_data, active } = req.body;

  //chaked post is exists or not
  let postExists = await Post.findById(req.params.id);

  if (!postExists) {
    return next(new ErrorHander("Post Not found", 404));
  }

  //ip address
  console.log("ipaddress: ", req.ip);
  var geo = geoip.lookup(req.ip);

  //update post
  const post = await Post.findByIdAndUpdate(req.params.id,{
    title,
    body_data,
    active,
    createdBy: req.user.id,
    latitude: geo.ll[0],
    longitude: geo.ll[1],
  },{new:true}).populate({path:"createdBy" ,select:'name'})
  res.status(200).json({
    success: true,
    post,
  });
});

exports.deletePost = catchAsyncError(async (req, res, next) => {

  //chaked post is exists or not
  let postExists = await Post.findById(req.params.id);

  if (!postExists) {
    return next(new ErrorHander("Post Not found", 404));
  }

  //delete post
  const post = await Post.findByIdAndDelete(req.params.id)
  console.log("post",post);
  res.status(200).json({
    success: true,
    post,
    message: post && "Post deleted successfully"
  });
});

exports.searchPost = catchAsyncError(async (req, res, next) => {

  const { latitude, longitude } = req.query; // Retrieve the latitude, longitude, and radius query parameters
  const itemperpage =  req.query.itemperpage || 10;
  const currentpageno = req.query.currentpageno || 1;
  let currpage,itempage

  if (currentpageno && itemperpage) {
    currpage = itemperpage * currentpageno - itemperpage;
    itempage = parseInt(itemperpage);
  }

  if(!latitude || !longitude) {
    return next(new ErrorHander("Enter latitude and longitude", 404));
  }

  const query=[
    {
      $geoNear: {
         near: { type: "Point", coordinates: [ parseFloat(latitude),parseFloat(longitude)] },
         key:"location",
         distanceField: "dist.calculated",
         maxDistance: parseFloat(1000)*1609,
         spherical: true
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: {
        path: "$createdBy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      "$project": {
        "createdBy.updatedAt":0,
        "createdBy.createdAt":0,
        "createdBy.password":0,
        "createdBy.email":0,
        "createdBy._id":0,
        "createdBy.__v":0
      }
    },
    {
      $skip: currpage,
    },
    {
      $limit: itempage,
    }
 ]

 let posts = await Post.aggregate(query);
 
  res.status(200).json({
    success: true,
    posts
  });
});

