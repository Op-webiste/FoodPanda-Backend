const Product = require("../models/productModel")
const Shop = require("../models/shopModel")
const User = require("../models/userModel")
const ErrorHandler = require("../utils/errorHandler")
const CatchAsyncError = require("../middleware/CatchAsyncError")
const sendnewEmail = require("../utils/sendEmail")

// Delete Products--Only Admin--LOGIN REQUIRED
exports.Delete_Products_By_Admin =CatchAsyncError( async(req,res,next)=>{
    const product = await Product.findByIdAndDelete(req.params.id)
    if(!product){return next(new ErrorHandler("No Product Found"))}

    const user = await User.findById(product.user)
    if(!product){return next(new ErrorHandler("No User Found"))}

    // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `Due to some reasons, We are Deleting your product, Product Name : ${product.name} \n\n ${Url} \n\n If you need any help then contact us at help@gmail.com.`


SuccessMessage=`Product Successfully Delted, Email Sent Successfully to : ${user.email} `

subject="Product Deleted"
sendnewEmail(subject,message,user.email,SuccessMessage,product,req,res,next)
    

    
})
// Delete All Shops Products--Only Admin--LOGIN REQUIRED
exports.Delete_All_Products_By_Admin =CatchAsyncError( async(req,res,next)=>{
    const product = await Product.deleteMany()
    res.status(200).json({Success:true,product})
})
// Update Products--Only Admin--LOGIN REQUIRED
exports.Update_Products_By_Admin =CatchAsyncError( async(req,res,next)=>{
   let product = await Product.findById(req.params.id)
   if(!product){return next(new ErrorHandler("Product Not Found"))}


    const user = await User.findById(product.user)
    if(!product){return next(new ErrorHandler("No User Found"))}

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})


    // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `We are Updating your Product, Product Name : ${product.name} \n\n ${Url} \n\n If you need any help then contact us at help@gmail.com.`


SuccessMessage=`Product Successfully Updated, Email Sent Successfully to : ${user.email} `

subject="Product Updated"
sendnewEmail(subject,message,user.email,SuccessMessage,product,req,res,next)
   
})
// Get Single Product--Only Admin--LOGIN REQUIRED
exports.Get_Single_Product_By_Admin =CatchAsyncError( async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){return next(new ErrorHandler("No Product Found",400))}
    res.status(200).json({Success:true,product})
})




// Get All Products--NO LOGIN REQUIRED
exports.Get_All_Products =CatchAsyncError( async(req,res,next)=>{
   const product = await Product.find().populate("user","name email")
   res.status(200).json({Success:true,product})
})



// Add Products--Only Seller--LOGIN REQUIRED--Hold for some changes
exports.Add_Products =CatchAsyncError( async(req,res,next)=>{
    let shop = await Shop.findOne({user:req.user._id})
   if(!shop){return next(new ErrorHandler("No Shop Found",400))}

   const {name,description,price,category}=req.body
   const product = await Product.create({
    name,description,price,category,user:req.user._id
   })
   

   shop.totalProducts = shop.totalProducts+1
   shop.save({validateBeforeSave:false})

       // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `Congrats: You Add a new Product : ${name} in Your Shop: ${shop.name} \n\n ${Url} \n\n If you need any help then contact us.`


SuccessMessage=`Product Successfully Created, Email Sent Successfully to : ${shop.email} `

subject="New Product Addded"
sendnewEmail(subject,message,shop.email,SuccessMessage,product,req,res,next)
    
//    res.status(200).json({Success:true,product,message:"Product Successfully Created"})
})
// Update Products--Only Seller--LOGIN REQUIRED
exports.Update_Products =CatchAsyncError( async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){return next(new ErrorHandler("Product Not Found",400))}

    const user = await User.findById(product.user)
    if(!user){return next(new ErrorHandler("User Not Found",400))}

     product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    
     // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `You Successfully Updated your product, Product Name : ${product.name} \n\n ${Url} \n\n If you need any help then contact us at help@gmail.com.`


SuccessMessage=`Product Successfully Updated, Email Sent Successfully to : ${user.email} `

subject="Product Updated"
sendnewEmail(subject,message,user.email,SuccessMessage,product,req,res,next)

})
// Delete Products--Only Seller--LOGIN REQUIRED
exports.Delete_Products=CatchAsyncError( async(req,res,next)=>{
  let product = await Product.findById(req.params.id)
  if(!product){return next(new ErrorHandler("Product Not Found",400))}

  let user = await User.findById(product.user)
  if(!user){return next(new ErrorHandler("User Not Found",400))}

    let shop = await Shop.findOne({user:req.user._id})
   if(!shop){return next(new ErrorHandler("No Shop Found",400))}

   shop.totalProducts = shop.totalProducts-1
   shop.save({validateBeforeSave:false})

     product = await Product.findByIdAndDelete(req.params.id)
 // Getting Ready for Email
 const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
 const message = `You Successfully Deleted your product, Product Name : ${product.name} \n\n ${Url} \n\n If you need any help then contact us at help@gmail.com.`
 
 
 SuccessMessage=`Product Successfully Deleted, Email Sent Successfully to : ${user.email} `
 
 subject="Product Deleted"
 sendnewEmail(subject,message,user.email,SuccessMessage,product,req,res,next)

})
// Get Single Product--Only Seller--LOGIN REQUIRED
exports.Get_Single_Product =CatchAsyncError( async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){return next(new ErrorHandler("No Product Found",400))}
    res.status(200).json({Success:true,product})
})