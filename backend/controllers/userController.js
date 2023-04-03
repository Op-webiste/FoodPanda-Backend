const User = require("../models/userModel")
const Shop = require("../models/shopModel")
const Product = require("../models/productModel")
const CatchAsyncError = require("../middleware/CatchAsyncError")
const ErrorHandler = require("../utils/errorHandler")
const sendToken = require("../utils/jwtToken")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const ApiFeatures = require("../utils/apiFeatures")
const sendnewEmail = require("../utils/sendEmail")

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get All Users--Admin Only--Login Required
exports.Get_All_Users_By_Admin = CatchAsyncError(async (req, res,next) => {
    const resultPerPage=10
    const apifeatures = new ApiFeatures(User.find(),req.query).search().pagination(resultPerPage)
    const user = await apifeatures.query.select("-password")
    res.status(200).json({ Success: true, user })
})
// Get Single User--Admin Only--Login Required
exports.Get_Single_User_By_Admin = CatchAsyncError(async (req, res,next) => {

    const user = await User.findById(req.params.id).select("-password")
    res.status(200).json({ Success: true, user })
})
// Update Users--Admin Only--Login Required
exports.Update_Users_By_Admin = CatchAsyncError(async (req,res,next) => {

    let user = await User.findById(req.params.id)
    if(!user){return next(new ErrorHandler("User Not Found",400))}

    user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
  // Getting Ready for Email
  const Url = `${req.protocol}://${req.get("host")}/api/v1/Seller/orders`
  const message = `Your Account Status is Updated to ${capitalizeFirstLetter(user.role)} Account, User Details \n\n Name : ${user.name} | Email : ${user.email} \n\n ${Url} \n\n If you need any help, then please contact us at help@gmail.com`
  
 
 SuccessMessage=`Account Updated!, Email Sent Successfully to : ${user.email} `
 subject="Account Updated"
 sendnewEmail(subject,message,user.email,SuccessMessage,user,req,res,next)

})
// Delete Users--Admin Only--Login Required
exports.Delete_Users_By_Admin = CatchAsyncError(async (req,res,next) => {

    let user = await User.findById(req.params.id)
    if(!user){return next(new ErrorHandler("User Not Found",400))}

    user = await User.findByIdAndDelete(req.params.id)

    // Getting Ready for Email
  const message = req.body.message
  
 
 SuccessMessage=`User Successfully Deleted!, Email Sent Successfully to : ${user.email} `
 subject="Account Deleted"
 sendnewEmail(subject,message,user.email,SuccessMessage,user,req,res,next)

})





// Sign Up--Authentication--No Login Required
exports.SignUp = CatchAsyncError(async (req, res,next) => {

    const user = await User.create(req.body)

     // Getting Ready for Email
 const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
 const message = `Congrats! You Successfully Created Your ${user.role} Account , User Details \n\n Name : ${req.body.name} | Email : ${req.body.email} \n\n ${Url} \n\n If you need any help, then please contact us at help@gmail.com`
 

 try {
    // Setup Email Method
const transporter = nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    auth:{
        user:process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_EMAIL_PASS,
    }
})

const mailOptions = {
    from:process.env.ADMIN_EMAIL,
    to:req.body.email,
    subject:"Congrats Your Account Created",
    text:message
}

// Sending Email
transporter.sendMail(mailOptions,async(error)=>{
 if(error){
    console.error(error)
    res.status(200).json({Success:false,message:"Email Not Sent"})
 }

 sendToken(user,200,res)

 

})

} catch (error) {
   
 
    res.status(400).json({error})
}
   


})
// Login--Authentication--No Login Required
exports.Login = CatchAsyncError(async (req, res,next) => {
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user){return next(new ErrorHandler("Please Enter Valid Credentials",400))}

    const comPass = await user.comparedPassword(password)
    if(!comPass){return next(new ErrorHandler("Please Enter Valid Credentials",400))}

    sendToken(user,200,res)

})
// Forget Password--Authentication--No Login Required
exports.Forget_Password = CatchAsyncError(async (req, res,next) => {
// Verify Email
    const {email}=req.body
   const user = await User.findOne({email})
   if(!user){return next(new ErrorHandler("Invalid Email",400))}

// Generating Token
const token = crypto.randomBytes(20).toString("hex")
 user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")
 user.resetPasswordExpire = new Date(Date.now()+15*60*1000)

// Saving Data
user.save({validateBeforeSave:false})

// Getting Ready for Email
const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${token}`
const message = `Your Reset Password Link is : \n\n ${resetPasswordUrl} \n\n if you don't request this link then please Ignore it.`




try {
    // Setup Email Method
const transporter = nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    auth:{
        user:process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_EMAIL_PASS,
    }
})

const mailOptions = {
    from:process.env.ADMIN_EMAIL,
    to:user.email,
    subject:process.env.SUBJECT_EMAIL,
    text:message
}

// Sending Email
transporter.sendMail(mailOptions,(error)=>{
 if(error){
    console.error(error)
    res.status(400).json({Success:false,message:"Email Not Sent"})
 }
 res.status(200).json({Success:true,message:`Email Sent Successfully to : ${user.email}`})

})

} catch (error) {
    user.resetPasswordExpire=undefined
    user.resetPasswordToken=undefined
    user.save({validateBeforeSave})
    res.status(400).json({error})
}



})
// Reset Password--Authentication--No Login Required
exports.Reset_Password = CatchAsyncError(async (req, res,next) => {
   const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

   const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt : Date.now()}})
   if(!user){return next(new ErrorHandler("Reset Password Token is Invalid Or Expire",400))}

   if(req.body.newPassword !== req.body.confirmPassword){return next(new ErrorHandler("New Password And Confirm Password Not Matched",400))}

   user.password = req.body.newPassword
   user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave:true})

     // Getting Ready for Email
 const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
 const message = `You Successfully Reset Your Password, Your New Pasword is : ${req.body.newPassword}\n\n Account , User Details \n\n Name : ${user.name} | Email : ${user.email} \n\n ${Url} \n\n If you need any help, then please contact us at help@gmail.com`
 

 try {
    // Setup Email Method
const transporter = nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    auth:{
        user:process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_EMAIL_PASS,
    }
})

const mailOptions = {
    from:process.env.ADMIN_EMAIL,
    to:user.email,
    subject:"Password Reset Successfully",
    text:message
}

// Sending Email
transporter.sendMail(mailOptions,async(error)=>{
 if(error){
    console.error(error)
    res.status(200).json({Success:false,message:"Email Not Sent"})
 }

 sendToken(user,200,res)

 

})

} catch (error) {
   
 
    res.status(400).json({error})
}
   

   

})




// Logout User--Users--Login Required
exports.Logout =CatchAsyncError( async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({Success:true,message:"Logged out"})
})
// Get User Details--Users--Login Required
exports.Get_User_Details_By_User =CatchAsyncError( async(req,res,next)=>{

    const user = await User.findById(req.user._id).select("-password")

    res.status(200).json({Success:true,user})

    
})
// Delete Seller Account with Shop And Products--Users--Login Required
exports.Delete_Seller_Account_with_Shop_And_Products =CatchAsyncError( async(req,res,next)=>{

    const product = await Product.findOne({user:req.user._id})

    const deleteproduct = await Product.deleteMany({ObjectId:product.id})

    const shop = await Shop.findOne({user:req.user._id})
    
    const deleteshop = await Shop.findByIdAndDelete(shop.id)
   

    const user = await User.findByIdAndDelete(req.user._id)
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
     // Getting Ready for Email
  const Url = `${req.protocol}://${req.get("host")}/api/v1/Seller/orders`
  const message = `You Deleted Your Account Successfully, User Details \n\n Name : ${user.name} | Email : ${user.email} \n\n ${Url} \n\n If you need any help, then please contact us at help@gmail.com`
  
 
 SuccessMessage=`You Deleted Your Account Successfully!, Email Sent Successfully to : ${user.email} `
 subject="Account Deleted"
 sendnewEmail(subject,message,user.email,SuccessMessage,user,req,res,next)



    
})
// Delete Own User Account--Users--Login Required
exports.Delete_Own_Account_By_User =CatchAsyncError( async(req,res,next)=>{

   

    const user = await User.findByIdAndDelete(req.user._id)
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

      // Getting Ready for Email
  const Url = `${req.protocol}://${req.get("host")}/api/v1/Seller/orders`
  const message = `You Deleted Your Account Successfully, User Details \n\n Name : ${user.name} | Email : ${user.email} \n\n ${Url} \n\n If you need any help, then please contact us at help@gmail.com`
  
 
 SuccessMessage=`You Deleted Your Account Successfully!, Email Sent Successfully to : ${user.email} `
 subject="Account Deleted"
 sendnewEmail(subject,message,user.email,SuccessMessage,user,req,res,next)

    
})
// Update Own User Account--Users--Login Required
exports.Update_Own_Account_By_User =CatchAsyncError( async(req,res,next)=>{

    const user = await User.findByIdAndUpdate(req.user._id,req.body,{new:true,runValidators:true})

     // Getting Ready for Email
  const Url = `${req.protocol}://${req.get("host")}/api/v1/Seller/orders`
  const message = `You Updated Your Account Successfully, User Details \n\n Name : ${user.name} | Email : ${user.email} \n\n ${Url} \n\n If you need any help, then please contact us at help@gmail.com`
  
 
 SuccessMessage=`You Updated Your Account Successfully!, Email Sent Successfully to : ${user.email} `
 subject="Account Updated"
 sendnewEmail(subject,message,user.email,SuccessMessage,user,req,res,next)
    


    
})
// Update Own Account Password--Users--Login Required
exports.Update_Own_Account_Password_By_User =CatchAsyncError( async(req,res,next)=>{

   const user = await User.findById(req.user._id)
   const comPass = await user.comparedPassword(req.body.oldPassword)
   if(!comPass){return next(new ErrorHandler("Incorrect Password",400))}

   if(req.body.newPassword !== req.body.confirmPassword){return next(new ErrorHandler("New Password And Confirm Password Not Matched",400))}
   user.password=req.body.newPassword

   user.save({validateBeforeSave:false})

    // Getting Ready for Email
 const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
 const message = `You Successfully Updated Your Password, Your New Pasword is : ${req.body.newPassword}\n\n Account , User Details \n\n Name : ${user.name} | Email : ${user.email} \n\n ${Url} \n\n If you need any help, then please contact us at help@gmail.com`
 

 try {
    // Setup Email Method
const transporter = nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    auth:{
        user:process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_EMAIL_PASS,
    }
})

const mailOptions = {
    from:process.env.ADMIN_EMAIL,
    to:user.email,
    subject:"Password Updated",
    text:message
}

// Sending Email
transporter.sendMail(mailOptions,async(error)=>{
 if(error){
    console.error(error)
    res.status(200).json({Success:false,message:"Email Not Sent"})
 }

 sendToken(user,200,res)

 

})

} catch (error) {
   
 
    res.status(400).json({error})
}
   

    
})