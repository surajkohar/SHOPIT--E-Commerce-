const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto=require('crypto')
const sendEmail=require('../utils/sendEmail')

const cloudinary=require('cloudinary')

exports.registerUser = catchAsyncError(async (req, res, next) => {
    
    const result=await cloudinary.v2.uploader.upload(req.body.avtar,{
        folder:'avtars',
        width:150,
        crop:'scale'
    })

    let { name, email, password } = req.body;
    console.log("register is :", req.body)
    password = bcrypt.hashSync(password, 12)
    const user = await User.create({
        name, email, password,
        avtar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })
        //generating jwt token while registering user and sending into cookies
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })

    const options={
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(200).cookie('token',token,options).json({
        success:true,
        token,
        user
        
    })

})

exports.loginUser = catchAsyncError(async (req, res, next) => {
    let { email, password } = req.body;
    // console.log("body is :",email)
    let enteredPassword = password;
    if (!email || !password) {
        return next(new ErrorHandler('please enter email & password', 400))
    }
    //finding data of user by email from database
    const user = await User.find({ email }).select('+password')
    console.log("password from database is :", user[0].password)
    if (!user) {
        return next(new ErrorHandler('please enter email & password', 401))
    }
    //check if password is correct or not
    const isPasswordMatached = await bcrypt.compareSync(enteredPassword, user[0].password)
    if (!isPasswordMatached) {
        return next(new ErrorHandler('please enter email & password', 403))
    }

    //generating jwt token while registering user and sending into cookies
    const token = jwt.sign({id:user[0]._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })

    const options={
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(200).cookie('token',token,options).json({
        success:true,
        token,
        user
        
    })

})
 
//Logout user
exports.logout=catchAsyncError(async(req,res,next)=>{
    console.log("logout")
     res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
     })

     res.status(200).json({
        success:true,
        message:'Logged Out'
     })

})


//--------verify jwt token when want to perform any actions------------- 
exports.isAuthenticatedUesr = catchAsyncError(async(req,res,next)=>{ 

   const {token}=req.cookies 
//    console.log("req.cookies :",req.cookies )

  if(!token){
    return next(new ErrorHandler("Login first to acces this resources.",401))
  }

   const decoded=jwt.verify(token,process.env.JWT_SECRET);
//    console.log('decoded value is ', decoded);  //id of person who register or logged in
    req.user=await User.findById(decoded.id)    ///details of person who register or logged in find and store in req.user
//    console.log('req.user isAuthenticatedUesr value is ', req.user);
    next();
})

//Handling users roles
exports.authorizeRoles=(...roles)=>{

     return (req,res,next)=>{
          if(!roles.includes(req.user.role)){
             return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resources`,403))
            }  

            next();
       }
}


// Forgot password--------when user click on forgot password then they enter their recovery email
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    
    const user=await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler("user not found with this email",404))
    }

    //Get reset token from userModel file
    const resetToken=user.getResetPasswordToken();
         await user.save({ validateBeforeSave : false })
    
      //create reset password url
      const resetUrl=`${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`

      const message=`your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not 
      requested this email,then ignore it `
      try {
        await sendEmail({
            email:user.email,
            subject:"ShopIT Password Recovery",
            message
        })
         res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`
         })
        
      } catch (error) {
        user.resestPasswordToken=undefined;
        user.resestPasswordToken=undefined;
        await user.save({ validateBeforeSave : false })
        return next(new ErrorHandler(error.message,500))
      
      }
})

//Reset password----matching resetPasswordToken from database and token sent to email to save new password
exports.resestPassword=catchAsyncError(async(req,res,next)=>{
   console.log("reset psassworddddddddddd")
     const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
    //  console.log("reset resetPasswordToken::",resetPasswordToken)
     let user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt : Date.now() }
     })
    
    
     if(!user){
        return next(new ErrorHandler('pasword reset token is invalid or has been expired',400))
     }

     if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler('pasword doesnot match',400))
     }
    
     user.password=req.body.password;
     user.resetPasswordToken=undefined;
     user.resetPasswordExpire=undefined;
     user.password = bcrypt.hashSync(user.password, 12) //encrypt password before save
       await user.save();

       sendToken(user,200,res) //update or set new token into cookie when we reset the password
})
 

//sendToken function
     function sendToken(user,statusCode,res){
    console.log("user parameter of sendToken :",user)
        //generating token
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
   
    const options={
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
     
    //set token into cookie
    res.status(200).cookie('token',token,options).json({
        success:true,
        token,
        user
        
    })
}

//Get currently logged in user details
exports.getUserProfile=catchAsyncError(async(req,res,next)=>{
    console.log("hii profile")
    console.log("req.user is:",req.user)
     const user= await User.findById(req.user.id)
     console.log(user)
     res.status(200).json({
        success:true,
        user
     })
})

//update or change the password
exports.updatePassword=catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');
   console.log("user is",user.password)
    const isMatched= bcrypt.compareSync(req.body.oldPassword,user.password) 
    console.log("isMatched",isMatched)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect',400))
    }

    console.log("req.body.newPassword",req.body.newPassword)
    user.password=req.body.newPassword
    user.password=await bcrypt.hashSync(user.password,12);
    await user.save();
    sendToken(user,200,res)
})

//update user profile
exports.updateProfile=catchAsyncError(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false

    })
    res.status(200).json({
        success:true,
        user
    })
})

//Get all users by only admin
exports.allUsers=catchAsyncError(async(req,res,next)=>{
     const users=await User.find();

     res.status(200).json({
        suceess:true,
        users
     })
})

//getUserDetails by admin
exports.getUserDetails=catchAsyncError(async(req,res,next)=>{
   
    let user=await User.findById(req.params.id)
     console.log("user iiodjb",user)
    if(!user){
        return next(new ErrorHandler(`user doesnot found with id:${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user
    })
})

//update user  only by admin  
exports.updateUser=catchAsyncError(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false

    })
    res.status(200).json({
        success:true,
        user
    })
})

//delete user by admin
exports.deleteUser=catchAsyncError(async(req,res,next)=>{

    let user=await User.findById(req.params.id)
     console.log("user iiodjb",user)
    if(!user){
        return next(new ErrorHandler(`user doesnot found with id:${req.params.id}`))
    }

    //remove avtar from cloudinary-TODO
    await user.deleteOne();

    res.status(200).json({
        success:true,
        
    })
})
