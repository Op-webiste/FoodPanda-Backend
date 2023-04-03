const mongoose = require("mongoose")

const DatabaseConnected = ()=>{
    mongoose.connect(process.env.MONGODB_CLOUD,{useNewUrlParser:true,useUnifiedTopology:true}).then((c)=>{
        console.log(`Database Connected Successfully to : ${c.connection.host}`)
        })
}

module.exports = DatabaseConnected