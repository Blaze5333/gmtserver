const express=require('express')
const app=express()
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
require('dotenv').config()
const otpGenerator=require('otp-generator')
const nodemailer=require('nodemailer')
const port=process.env.PORT || 3000
const cors=require('cors')
app.use(cors())
app.post('/generateOtp',async(req,res)=>{
  try {
    const {email}=req.body
    
    const otp=otpGenerator.generate(4,{specialChars:false,lowerCaseAlphabets:false,upperCaseAlphabets:false,digits:true})
    
    const transport=nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    })
    const mailOptions={
      from:process.env.EMAIL,
      to:email,
      subject: 'Here is your one-time-password',
    text: `Here's the one-time verification code you requested ${otp}.This code expires after 9 minutes`
    }
    transport.sendMail(mailOptions,(error,info)=>{
      if(error){
        console.log(error)
      }else{
        console.log('Email sent: ' + info.response);
        res.send({message:'otp sent successfully',otp:otp})
      }
    })
    res.json({
      otp,
      error:0
    })
    } catch (error) {
    res.json({
      error:1,
      message:"Something went wrong"
    })
  }
})


app.listen(port,()=>{
    console.log('listening on 3000')
})
