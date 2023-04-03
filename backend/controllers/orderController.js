const Shop = require("../models/shopModel")
const Order = require("../models/orderModel")
const User = require("../models/userModel")
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const CatchAsyncError = require("../middleware/CatchAsyncError")
const sendnewEmail = require("../utils/sendEmail")
const ApiFeatures = require("../utils/apiFeatures")



// Only Admin Allowed
// Get All Orders--Admin--LOGIN REQUIRED
exports.Get_All_Orders_By_Admin =CatchAsyncError( async(req,res,next)=>{

    const shop = await Shop.findById(req.params.id)
    if(!shop){return next(new ErrorHandler("No Shop Found",400))}

    const order = await Order.find({shop:shop._id}).populate("shop","name email")
    if(!order){return next(new ErrorHandler("No Shop Found",400))}
    
    res.status(200).json({Success:true,order})
})
// Delete All Orders--Admin--LOGIN REQUIRED
exports.Delete_All_Orders_By_Admin =CatchAsyncError( async(req,res,next)=>{
    const shop = await Shop.findById(req.params.id)
    if(!shop){return next(new ErrorHandler("No Shop Found",400))}
    
    const user = await User.findById(shop.user)
    if(!user){return next(new ErrorHandler("No User Found",400))}



    const order = await Order.deleteMany({shop:shop._id})
    if(!order){return next(new ErrorHandler("No Order Found",400))}

    // Getting Ready for Email
 const Url = `${req.protocol}://${req.get("host")}/api/v1/Users/orders`
 const message = `Due to some reason, We are deleting all of your Orders of you shop : ${shop.name} | ${shop.email} \n\n ${Url} \n\n If you need any help, then please contact us at help@gmail.com`
 
 
 SuccessMessage=`All Order Deleted, Email Sent Successfully to : ${user.email} `

subject="All Orders Deleted"
sendnewEmail(subject,message,user.email,SuccessMessage,order,req,res,next)

})
// Delete All Orders of all shops--Admin--LOGIN REQUIRED
exports.Delete_All_Orders_Of_All_Shops_By_Admin =CatchAsyncError( async(req,res,next)=>{

    const order = await Order.deleteMany()
    res.status(200).json({Success:true,order})
})
// Delete Single Order--Admin--LOGIN REQUIRED
exports.Delete_Single_Order_By_Admin =CatchAsyncError( async(req,res,next)=>{
    let order = await Order.findById(req.params.id)
    if(!order){return next(new ErrorHandler("Order Not Found",400))}

    const shop = await Shop.findById(order.shop)
    if(!shop){return next(new ErrorHandler("No Shop Found",400))}

    const user = await User.findById(shop.user)
    if(!shop){return next(new ErrorHandler("No User Found",400))}

     // Getting Ready for Email
 const Url = `${req.protocol}://${req.get("host")}/api/v1/Users/orders`
 const message = `Due to some reason, We are deleting  your Order : ${order.id}  \n\n ${Url} \n\n If You need any help, then please contact us at help@gmail.com`
 
 
 SuccessMessage=`Order Deleted, Email Sent Successfully to : ${user.email} `

subject="Order Deleted"
sendnewEmail(subject,message,user.email,SuccessMessage,order,req,res,next)

     order = await Order.findByIdAndDelete(req.params.id)
    res.status(200).json({Success:true,message:"Order Successfully Deleted"})
})



// Only User Allowed
// Add Order--User--LOGIN REQUIRED
exports.Add_Orders_By_User =CatchAsyncError( async(req,res,next)=>{
    const {ShippingInfo,orderItems,totalPrice,taxPrice,productName,shippingPrice,itemPrice,paymentInfo,buyerEmail,buyerName}= req.body
   
    
    const newproduct = await Product.findById(orderItems[0].product)
if(!newproduct){return next(new ErrorHandler("Product Not Found",400))}


const newshop = await Shop.findOne({user:newproduct.user})
if(!newshop){return next(new ErrorHandler("Shop Not Found",400))}

    const order = await Order.create({
        ShippingInfo,orderItems,totalPrice,taxPrice,productName,shippingPrice,itemPrice,paymentInfo,buyerEmail,buyerName,paidAt:Date.now(),user:req.user._id
        ,shop:newshop.id
    })


    // Getting Ready for Email
const Url = `${req.protocol}://${req.get("host")}/api/v1/login`
const message = `Congrats: A NEW ORDER HERE: ${buyerName} is Order Your product ${productName} : \n\n ${Url} \n\n Please Process the Order As Soon As Possible.`


SuccessMessage=`Order Placed, Email Sent Successfully to : ${newshop.email} `

subject="New Order"
sendnewEmail(subject,message,newshop.email,SuccessMessage,order,req,res,next)

    
})
// Get All Orders--User--LOGIN REQUIRED
exports.Get_All_Orders_By_User =CatchAsyncError( async(req,res,next)=>{
    
    const order = await Order.find({user:req.user._id})
    if(!order){return next(new ErrorHandler("No Order Found",400))}

    res.status(200).json({Success:true,order})
})
// Get All Orders by searching orderStatus i.e  Processing, Cancelled, Delivered--User--LOGIN REQUIRED
exports.Get_All_Orders_By_Searching_By_User =CatchAsyncError( async(req,res,next)=>{
    
    const order = await Order.find({user:req.user._id,orderStatus:req.body.search})
    if(!order){return next(new ErrorHandler("No Order Found",400))}

    res.status(200).json({Success:true,order})
})
// Delete Single Order--User--LOGIN REQUIRED
exports.Cancel_Order_By_User =CatchAsyncError( async(req,res,next)=>{
    let order = await Order.findById(req.params.id)
    if(!order){return next(new ErrorHandler("No Order Found",400))}

    if(!order.orderStatus==="Processing"){
       return next(new ErrorHandler("You do not Cancel the Order at this time",400))
    }
    else if(order.orderStatus ==="Processing"){
        const shopId = await Shop.findById(order.shop)
        if(!shopId){return next(new ErrorHandler("Shop Not Found",400))}
        // Getting Ready for Email
 const Url = `${req.protocol}://${req.get("host")}/api/v1/Seller/orders`
 const message = `User Canceled The Order, User Details \n\n Name : ${order.buyerName} | Email : ${order.buyerEmail} \n\n ${Url} \n\n If you need any help, then please contact us at help@gmail.com`
 
 
 let cancel_Order="Cancelled";
 order.orderStatus = cancel_Order
order.save({validateBeforeSave:false})

SuccessMessage=`Order Cancelled!, Email Sent Successfully to : ${shopId.email} `
subject="Order Cancelled"
sendnewEmail(subject,message,shopId.email,order,SuccessMessage,req,res,next)
 
    }

})




// Only Seller Allowed
// Get All Orders--Seller--LOGIN REQUIRED
exports.Get_All_Orders_By_Seller = CatchAsyncError(async(req,res,next)=>{
    const shop = await Shop.findOne({user:req.user._id})
    if(!shop){return next(new ErrorHandler("No Order yet",400))}
    
    const order = await Order.find({ shop: shop._id })
    if(!order){return next(new ErrorHandler("No Order yet",400))}

    res.status(200).json({Success:true,order})
})
// Update Order Status--Seller--LOGIN REQUIRED
exports.Update_Order_Status_By_Seller = CatchAsyncError(async(req,res,next)=>{
const order = await Order.findById(req.params.id)
if(!order){return next(new ErrorHandler("No Order Found",400))}

if(order.orderStatus === "Delivered"){return next(new ErrorHandler("You already Delivered this Product",400))}
if(order.orderStatus === "Cancelled"){return next(new ErrorHandler("You Cannot Change the OrderStatus of Cancelled Order",400))}

order.orderStatus = req.body.status
order.save({validateBeforeSave:false})


 // Getting Ready for Email
 
 const message = req.body.message
 SuccessMessage=`Order Delivered, Email Sent Successfully to : ${order.buyerEmail} `

subject="Order Updated"
sendnewEmail(subject,message,order.buyerEmail,SuccessMessage,order,req,res,next)
 
 
     
})
// Delete Single Order--Seller--LOGIN REQUIRED
exports.Delete_Single_Order_By_Seller =CatchAsyncError( async(req,res,next)=>{
    
    const order = await Order.findByIdAndDelete(req.params.id)
    res.status(200).json({Success:true,message:"Order Successfully Deleted"})
})
// Get All Orders by searching orderStatus i.e  Processing, Cancelled, Delivered--Seller--LOGIN REQUIRED
exports.Get_All_Order_By_Searching_By_Seller =CatchAsyncError( async(req,res,next)=>{
    const shop = await Shop.findOne({user:req.user._id})
    if(!shop){return next(new ErrorHandler("No Order yet",400))}
    
    const order = await Order.find({ shop: shop._id,orderStatus:req.body.search})
    if(!order){return next(new ErrorHandler("No Order yet",400))}

    res.status(200).json({Success:true,order})
})