const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter your name'],
        maxlength:[30,'your name cannot exceed 30 characters']
    },
    email:{
        type:String,
        required:[true,'please enter your email'],
       unique:true,
       validate:[validator.isEmail,'please enter valid email address']

    },
    password:{
        type:String,
        required:[true,'please enter your password'],
        minlength:[6,'password cannot be less than 6 characters'],
        select:false
    },
    avtar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})


// ----generate password reset token-------

userSchema.methods.getResetPasswordToken = function(){
    // Generate Token
     const resetToken=crypto.randomBytes(20).toString('hex')
     // Hash and set to resetPasswordToken
     this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')
     // Set token expires time 30 minutes
     this.resetPasswordExpire=Date.now() + 30 * 60 * 1000
     return resetToken;
}

module.exports=mongoose.model('User',userSchema)