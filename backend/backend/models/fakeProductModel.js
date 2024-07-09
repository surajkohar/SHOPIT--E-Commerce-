const mongoose=require('mongoose')

const fakeProductScshema=new mongoose.Schema({ 
    id:String,
    title:{
        type:String,
        required:[true,'please enter product name'],
        trim:true,
        maxLength:[100,'Product name cannot exceed 100 characters']
    },
    description:String,
    price:Number,
    discount:Number,
    stock:Number,
    brand:String,
    category:String,
    thumbnail:String,
    images:[
       {
        type:String
    }
     ],
     
     ratings:{
        type:Number,
        default:0.0
    },
     numOfReviews:{
        type:Number,
        default:0
    
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
    
        }
    ],
    
     user:{
        type:mongoose.Schema.ObjectId,
        // ref:'User',
        required:true
    }
})

module.exports=mongoose.model('fakeProduct',fakeProductScshema)