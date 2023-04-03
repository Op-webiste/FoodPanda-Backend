const mongoose = require("mongoose")


const shopSchema= new mongoose.Schema({
 
    name:{
        type:String,
        required:[true,"Please Enter Name"],
        minLength:[2,"Name Should Exceed 2 Charators"],
        maxLength:[20,"Name Cannot Exceed 20 Charators"]
    },
    description:{
        type:String,
        required:[true,"Please Enter description"],
        minLength:[5,"description Should Exceed 5 Charators"],
        maxLength:[500,"description Cannot Exceed 500 Charators"]
    },
    email:{type:String},
    ratings:{
        type:Number,
        default:0
    },
    numOfReviews:{
     type:Number,
     default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
           
        },
        rating:{
            type:Number,
            
        },
        comment:{
            type:String,
            
        }

    }],
    avatar:[{
        public_id:{
            type:String,
            default:"Sample Avatar ID"
        },
        url:{
            type:String,
            default:"Sample Avatar Url"
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    totalProducts:{
        type:Number,
        default:0
    }
    
})



module.exports = mongoose.model("Shop",shopSchema)