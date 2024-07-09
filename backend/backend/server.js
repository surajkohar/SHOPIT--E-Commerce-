const app=require('./app')
const dotenv=require('dotenv')
const connectDatabase=require('./config/database')

const cloudinary =require('cloudinary')

//handling uncaught exception
process.on('uncaughtException',err =>{
    console.log(`ERROR: ${err.message}`)
    console.log(`shutting down the server due to uncaught exception`);
    
        process.exit(1)
    
})


//setting up config files
dotenv.config({path:'config/config.env'})

//setting up cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//connecting to database
connectDatabase();

const server=app.listen(process.env.PORT,()=>{
    console.log("server is running on port:"+process.env.PORT+" in "+process.env.Node_ENV+" mode")
})

//handling unhandled promise rejection
process.on('unhandledRejection',err=>{
    console.log(`ERROR: ${err.message}`)
    console.log(`shutting down the server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1)
    })

})