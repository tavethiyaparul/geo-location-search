const ErrorHander = require('../utils/errorheandler')
const catchAsyncError = require("../middleware/catchAsyncError")
const User = require('../models/user.model')
const sendToken = require("../utils/jwtToken")

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password,
    })
    sendToken(user, 201, res)
})

exports.loginUser = catchAsyncError(async (req, res, next) => {
    console.dir(req.ip);
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHander("Please Enter email & password", 400))
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHander("Invalid email & password"))
    }

    const ismatched = await user.comparePassword(password)

    if (!ismatched) {
        return next(new ErrorHander("Invalid email & password"))
    }
    sendToken(user, 200, res)
})
