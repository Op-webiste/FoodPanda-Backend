const express = require("express")
const app = express()
const middlwareError = require("./middleware/error")
const user = require("./routes/userRoute")
const shop = require("./routes/shopRoute")
const product = require("./routes/productRoute")
const order = require("./routes/orderRoute")
const cookieParser = require("cookie-parser")
const cors = require("cors")

// Data Giving in this Formats
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:[process.env.FRONTEND_URI],
    methods:["GET",'POST','DELETE','PUT'],
    credentials:true
}))


// Errors Handler
app.use(middlwareError)


// APIs
app.use("/api/v1",user)
app.use("/api/v1",shop)
app.use("/api/v1",product)
app.use("/api/v1",order)


module.exports = app