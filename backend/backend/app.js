const express=require('express')
const app=express();
const errorMiddleware=require('./middlewares/error')
const cookieparser=require('cookie-parser')

const bodyparser =require('body-parser')
const fileUpload=require('express-fileupload')


app.use(express.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cookieparser())
app.use(fileUpload())


//import all routes here
const product=require('./routes/product')
const user=require('./routes/user')
const order=require('./routes/order')

app.use('/api',product)
app.use('/api',user)
app.use('/api',order)

//midlleware to handle errors
app.use(errorMiddleware)

module.exports=app