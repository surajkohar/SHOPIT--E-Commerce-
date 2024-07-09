const ErrorHandler=require('../utils/errorHandler')

module.exports=(err,req,res,next)=>{
  err.statusCode = err.statusCode || 500;
//   err.message = err.message || 'Internal Server Error'

  if(process.env.NODE_ENV=='DEVELOPMENT'){
    res.status(err.statusCode).json({
        success:false,
        error:err,
        errMessage:err.message,
        stack:err.stack
    })
   }

    if(process.env.NODE_ENV=='PRODUCTION'){
      console.log("production error")
        let err={...err}
        error.message=err.message

        //wrong mongoose id error
        if(err.name=='castError'){
            const message=`Resources not found.Invalid:${err.path}`
            error=new ErrorHandler(message)
        }

        if(err.code===11000){
          const message=`Duplicate ${Object.keys(err.keyValue)} entered`
          error=new ErrorHandler(message,400)
        }
        
        res.status(error.statusCode).json({
            success:false,
            error:err.stack || 'Internal Server Error'
          })
         }

  
}