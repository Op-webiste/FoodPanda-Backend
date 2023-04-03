const JWT = require("jsonwebtoken")
const ErrorHandler = require("../utils/errorHandler")
const User = require("../models/userModel")

exports.isAuthenticateUser = async(req,res,next)=>{
    
    const {token}=  req.cookies;
    if(!token){return next(new ErrorHandler("Please Login First",400))}

    const decodedData =  JWT.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)
    next()
}

exports.isAuthenticateAdmin = (...roles)=>{
    
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){return next(new ErrorHandler("You Do Not Have Permissions",400))}
        next()
    }
}