const mongoose = require('mongoose')
const validator =  require('validator')
 

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please Enter Your Title"],
        maxlength:[30,"Title can not exceed 30 charcter"],
        minlength:[4,"Title should have more the 4 charcter"]
    },
    body_data:{
        type:String,
        required:[true,"Please Enter Your Email"],
    },
    createdBy:{
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true
      },
   location:{
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
   }
},{
    timestamps: true,
  });

postSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("post",postSchema)