const Shop = require("../models/shopModel")
const User = require("../models/userModel")
const CatchAsyncError = require("../middleware/CatchAsyncError")
const ErrorHandler = require("../utils/errorHandler")
const nodemailer = require("nodemailer")
const sendnewEmail = require("../utils/sendEmail")

// Get All Shops--Everyone can access--NO LOGIN REQUIRED
exports.Get_All_Shops =CatchAsyncError( async(req,res,next)=>{

    const shop = await Shop.find().populate("user","name email")
    res.status(200).json({Success:true,shop})
})



// ADMIN ONLY--LOGIN REQUIRED

// Get Single Shop--Admin Only--LOGIN REQUIRED
exports.Get_Single_Shop_by_Admin =CatchAsyncError( async(req,res,next)=>{

    const shop = await Shop.findById(req.params.id).populate("user","name email")
    if(!shop){return next(new ErrorHandler("No Shop Found",400))}
    res.status(200).json({Success:true,shop})
})
// Delete Shop--Admin Only--LOGIN REQUIRED
exports.Delete_Shop_by_Admin =CatchAsyncError( async(req,res,next)=>{

    let shop = await Shop.findById(req.params.id)
    if(!shop){return next(new ErrorHandler("No Shop Found",400))}

    shop = await Shop.findByIdAndDelete(req.params.id)

    const user = await User.findById(shop.user)
    if(!user){return next(new ErrorHandler("No User Found",400))}

     

     // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `Due to some reasons, We are deleting your shop: ${shop.name}  \n\n ${Url} \n\n if you need any help then contact us at help@gmail.com`


SuccessMessage=`Shop Successfully Deleted | Email Sent Successfully to : ${user.email}`
subject="Shop Deleted"
sendnewEmail(subject,message,user.email,SuccessMessage,shop,req,res,next)

    // res.status(200).json({Success:true,message:"Shop Successfully Deleted"})
})
// Update Shop--Admin Only--LOGIN REQUIRED
exports.Update_Shop_by_Admin =CatchAsyncError( async(req,res,next)=>{

    let shop = await Shop.findById(req.params.id)
    if(!shop){return next(new ErrorHandler("No Shop Found",400))}

    const user = await User.findById(shop.user)
    if(!user){return next(new ErrorHandler("No User Found",400))}

     
    shop = await Shop.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).populate("user","name email")

      // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `Your Shop Updated Successfully : ${shop.name}  \n\n ${Url} \n\n if you need any help then contact us at help@gmail.com`


SuccessMessage=`Shop Successfully Updated | Email Sent Successfully to : ${user.email}`
subject="Shop Updated"
sendnewEmail(subject,message,user.email,SuccessMessage,shop,req,res,next)

})



// SELLER ONLY--LOGIN REQUIRED

// Get Shop Details--Seller Only--LOGIN REQUIRED
exports.Get_Shop_Details_by_Seller =CatchAsyncError( async(req,res,next)=>{
const userId = await Shop.findOne({user:req.user._id})
if(!userId){return next(new ErrorHandler("No Shop Found",400))}

const shop = await Shop.findById(userId)
res.status(200).json({Success:true,shop})
})
// Create Shop--Seller Only--LOGIN REQUIRED
exports.Create_Shop_by_Seller =CatchAsyncError( async(req,res,next)=>{
    
    let shop = await Shop.findOne({user:req.user._id});
    if (shop) {
      return next(new ErrorHandler("You already have a shop, You cannot create more than 1 shop", 400));
    }
    
    const {name,description,ratings,numOfReviews,avatar,email}=req.body

    shop = await Shop.create({
        name,description,ratings,numOfReviews,avatar,user:req.user._id,email
    })

     // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `Congrats: Your Shop Created Successfully: ${name}  \n\n ${Url} \n\n Go to your shop and add product and start selling`


SuccessMessage=`Shop Successfully Created | Email Sent Successfully to : ${email}`
subject="Congrats! Shop Created"
sendnewEmail(subject,message,email,SuccessMessage,shop,req,res,next)


    
})
// Update Shop--Seller Only--LOGIN REQUIRED
exports.Update_Shop_By_Seller = CatchAsyncError( async(req,res,next)=>{
    const userId = await Shop.findOne({user:req.user._id})
    if(!userId){return next(new ErrorHandler("No Shop Found",400))}
    const shop = await Shop.findByIdAndUpdate(userId,req.body,{new:true,runValidators:true})

            // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `You Updated Your Shop Successfully: ${shop.name}  \n\n ${Url} \n\n If you need any help then contact us at help@gmail.com`


SuccessMessage=`Shop Updated Successfully | Email Sent Successfully to : ${shop.email}`
subject="Shop Updated"

sendnewEmail(subject,message,shop.email,SuccessMessage,shop,req,res,next)

})
// Delete Shop--Seller Only--LOGIN REQUIRED
exports.Delete_Shop_By_Seller = CatchAsyncError( async(req,res,next)=>{
    const userId = await Shop.findOne({user:req.user._id})
    if(!userId){return next(new ErrorHandler("No Shop Found",400))}
    const shop = await Shop.findByIdAndDelete(userId)

        // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `You Deleted Your Shop Successfully: ${shop.name}  \n\n ${Url} \n\n If you need any help then contact us at help@gmail.com`


SuccessMessage=`Shop Deleted Successfully | Email Sent Successfully to : ${shop.email}`
subject="Shop Deleted"
sendnewEmail(subject,message,shop.email,SuccessMessage,shop,req,res,next)
   
})



// USER ONLY--LOGIN REQUIRED

// Add Reviews--User Only--LOGIN REQUIRED
exports.Add_Review_by_User =CatchAsyncError( async(req,res,next)=>{

    const {rating,comment,shopId} = req.body
    const review={
        user:req.body.user,
        name:req.body.name,
        rating:Number(rating),
        comment
    }

    const shop = await Shop.findById(shopId)
    if(!shop){return next(new ErrorHandler("No Shop Found",400))}
    const isReviewed = shop.reviews.find((rev)=> rev.user && rev.user.toString() ===req.user._id.toString())

    if(isReviewed){
    if(rev.user.toString() ===req.user._id.toString()){
        rev.rating = rating,
        rev.comment = comment
    }

    }else{
        shop.reviews.push(review)
        shop.numOfReviews = shop.reviews.length
    }
    let avg=0
    shop.reviews.forEach(rev=>{
        avg+=rev.rating
    })
    shop.ratings = avg/shop.reviews.length
    await shop.save({validateBeforeSave:false})

     // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `A New Review Added In your Shop: ${req.body.name}  \n\n ${Url} \n\n If you need any help then contact us at help@gmail.com`


SuccessMessage=`Review Added Successfully | Email Sent Successfully to : ${shop.email}`
subject="New Review Added"
sendnewEmail(subject,message,shop.email,SuccessMessage,shop,req,res,next)
   

})
