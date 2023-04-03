const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter Name"],
        minLength:[2,"Name Should Exceed 2 Charactors"],
        maxLength:[30,"Name Should Exceed 30 Charactors"]
    },
    description:{
        type:String,
        required:[true,"Please Enter description"],
        minLength:[5,"description Should Exceed 5 Charactors"],
        maxLength:[500,"description Should Exceed 500 Charactors"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter price"]
    },
    images:[{
        public_id:{
            type:String,
            default:"Sample Product Image ID"
        },
        url:{
            type:String,
            default:"Sample Product Url"
        }
    }],
    category:{
        type:String,
        required:[true,"Please Enter Category"]
    },
    size:{
        type:String,
        default:"Medium"
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
    

})

module.exports = mongoose.model("Product",productSchema)