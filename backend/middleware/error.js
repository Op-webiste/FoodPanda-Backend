const ErrorHandler = require("../utils/errorHandler")

module.exports = (err,req,res,next)=>{
err.message = err.message;
err.statusCode = err.statusCode;

res.status(err.statusCode).json({
    Success:false,
    message:err.message
})
}