const nodemailer = require("nodemailer")

const sendnewEmail = async(subject,message,email,SuccessMessage,sendingDetails,req,res,next)=>{
    try {
        // Setup Email Method
    const transporter = nodemailer.createTransport({
        service:process.env.EMAIL_SERVICE,
        auth:{
            user:process.env.ADMIN_EMAIL,
            pass:process.env.ADMIN_EMAIL_PASS,
        }
    })
    
    const mailOptions = {
        from:process.env.ADMIN_EMAIL,
        to:email,
        subject:subject,
        text:message
    }
   
    // Sending Email
    transporter.sendMail(mailOptions,async(error)=>{
     if(error){
        console.error(error)
        res.status(200).json({Success:false,message:"Email Not Sent"})
     }
    
     res.status(200).json({Success:true,sendingDetails,SuccessMessage})
    
    })
    
    } catch (error) {
       
     
        res.status(400).json({error})
    }
       
   
}

module.exports = sendnewEmail