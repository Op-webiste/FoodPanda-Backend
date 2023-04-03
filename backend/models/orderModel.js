const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

    ShippingInfo:{
        address:{type:String,required:[true,"Please Enter Address"]},
        city:{type:String,required:[true,"Please Enter city"]},
        state:{type:String,required:[true,"Please Enter state"]},
        country:{type:String,required:[true,"Please Enter country"]},
        phoneNo:{type:Number,required:[true,"Please Enter phoneNo"]},
        pinCode:{type:Number,required:[true,"Please Enter pinCode"]}
    },
    orderItems:[{
        product:{
           type:String,required:true
        },
        name:{type:String,required:[true,"Please Enter Name"]},
        price:{type:Number,required:[true,"Please Enter price"]},
        quantity:{type:Number,required:[true,"Please Enter quantity"]},
        image:{type:String}   
    }],
    shop:String,
    totalPrice:{type:Number,required:[true,"Please Enter TotalPrice"]},
    taxPrice:{type:Number,required:[true,"Please Enter tax Price"]},
    shippingPrice:{type:Number,required:[true,"Please Enter shipping Price"]},

    paymentInfo:{
        id:{type:String,default:"Sample payment id"},
        status:{type:String,default:"succed"}
    },
    orderStatus:{
        type:String,
        default:"Processing"
    },
    paidAt:{type:Date},
    buyerName:{
        type:String,
        required:[true,"Please Enter Your Name"]
    },
    buyerEmail:{type:String,required:[true,"Please Enter Your Email"]},
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    shop:{
        type:mongoose.Schema.ObjectId,
        ref:"Shop",
        required:true
    }
    
})

module.exports= mongoose.model("Order",orderSchema)