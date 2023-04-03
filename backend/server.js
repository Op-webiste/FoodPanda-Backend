const app = require("./app")
const dotenv = require("dotenv")
const DatabaseConnected= require("./config/database")

// uncaughtException Error Solver
process.on("uncaughtException",(error)=>{
    console.log(`Error : ${error}`)
    console.log("Shutting Down ther Server...")
    server.close(()=>{
        process.exit(1)
    })
})

// Config env file
dotenv.config({path:"backend/config/config.env"})

// Connecting Database
DatabaseConnected()

const server = app.listen(process.env.PORT,()=>{
    console.log(`App Running Fine on PORT : ${process.env.PORT}`)
})

// unhandledRejection Error Solver
process.on("unhandledRejection",(error)=>{
    console.log(`Error : ${error}`)
    console.log("Shutting Down ther Server...")
    server.close(()=>{
        process.exit(1)
    })
})