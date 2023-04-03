const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const userSchema= new mongoose.Schema({
 
    name:{
        type:String,
        required:[true,"Please Enter Name"],
        minLength:[2,"Name Should Exceed 2 Charators"],
        maxLength:[20,"Name Cannot Exceed 20 Charators"]
    },
    email:{
        type:String,
        required:[true,"Please Enter email"],
        validate:[validator.isEmail,"Please Enter Valid Email"],
        unique:[true,"User Already Exists with this Email Address"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Password"],
        minLength:[2,"Password Should Exceed 2 Charators"],
        maxLength:[20,"Password Cannot Exceed 20 Charators"]
    },
    avatar:{
        public_id:{
            type:String,
            default:"Sample Avatar ID"
        },
        url:{
            type:String,
            default:"Sample Avatar Url"
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

// Securing Password Before Register the User
userSchema.pre("save",async function(){
    const RoundSalt = 10;
    this.password =await bcrypt.hash(this.password,RoundSalt)
})

// Creating JsonWebToken
userSchema.methods.getJWTToken = function(){
    return JWT.sign({id:this._id},process.env.JWT_SECRET)
}

// Comparing Password
userSchema.methods.comparedPassword = async function(enteredPassword){
  return bcrypt.compare(enteredPassword,this.password)
}

module.exports = mongoose.model("User",userSchema)