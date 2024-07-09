const mongoose=require('mongoose')

const productScshema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter product name'],
        trim:true,
        maxLength:[100,'Product name cannot exceed 100 characters']
    },
    price:{
        type:String,
        required:[true,'please enter product price'],
        maxLength:[5,'Product name cannot exceed 100 characters'],
        default:0.0
    },
    description:{
        type:String,
        required:[true,'please enter product description'], 
    },
    ratings:{
        type:Number,
        default:0.0
    },
    images:[{
        public_id:{
            type:String,
            require:true
        },
        url:{
            type:String,
            require:true   
        }
}],
category:{
    type:String,
    required:[true,'please select category from this product'],
    enum:{
       values:[
        'Electronics',
        'Cameras',
        'laptop',
        'Accesories',
        'HeadPhones',
        'food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoors',
        'Home'
       ],
       message:'Please select correct category for product '

    }
},
seller:{
    type:String,
    required:[true,'please enter product seller']
},
stock:{
    type:String,
    required:[true,'Please enter product stock'],
    maxLength:[5,'Product name cannot exceed 5 characters'],
    default:0
},
numOfReviews:{
    type:Number,
    default:0

},
reviews:[
    {
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
    ref:'User',
    required:true
},

createdAt:{
    type:Date,
    default:Date.now
}


})

module.exports=mongoose.model('product',productScshema)