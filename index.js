const express=require('express')
const app=express()
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
require('dotenv').config()
const otpGenerator=require('otp-generator')
const nodemailer=require('nodemailer')
app.post('/generateOtp',async(req,res)=>{
  try {
    const {email}=req.body
    console.log("email",email)
    const otp=otpGenerator.generate(4,{specialChars:false,lowerCaseAlphabets:false,upperCaseAlphabets:false,digits:true})
    console.log("otp",otp)
    const transport=nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user:"do-not-reply@doklink.in",
        pass: process.env.EMAIL_PASSWORD
      }
    })
    const mailOptions={
      from:"do-not-reply@doklink.in",
      to:email,
      subject: 'Here is your one-time-password',
    text: `Here's the one-time verification code you requested ${otp}.This code expires after 9 minutes`
    }
    transport.sendMail(mailOptions,(error,info)=>{
      if(error){
        res.send({error:error})
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


app.listen(3000,()=>{
    console.log('lidtening on 3000')
})
