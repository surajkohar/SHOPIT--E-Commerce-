const Order=require('../models/orderModel')
const Product=require('../models/fakeProductModel')
const ErrorHandler=require('../utils/errorHandler')
const catchAsyncError=require('../middlewares/catchAsyncError')


//create new order
exports.newOrder=catchAsyncError(async(req,res,next)=>{
    // req.body.user=req.user.id;
    
    const { orderItems,shippingInfo,
        itemsPrice,taxPrice,
        shippingPrice,totalPrice,
        paymentInfo } = req.body
        
        // orderItems[0].user = user;

        const order = await Order.create({
            orderItems,shippingInfo,
            itemsPrice,taxPrice,
             shippingPrice,totalPrice,
             paymentInfo,
             paidAt:Date.now(),
             user:req.user.id
        })

        res.status(200).json({
            success:true,
            order
        })
})

//Get logged in user all order  =>api/orders/me       >>id of logged in user is stored in user while creating order
exports.myOrders=catchAsyncError(async(req,res,next)=>{
    console.log(req.user.id)
    const orders=await Order.find({user:req.user.id})
    
    // if(!order){
    //     return next(new ErrorHandler("No order found with this ID",404))
    // }

    res.status(200).json({
        success:true,
        orders
    })
})

//Get single order 
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("No order found with this ID",404))
    }

    res.status(200).json({
        success:true,
        order
    })
})

//admin get all the orders and their total prices  by -Admin
exports.allOrders=catchAsyncError(async(req,res,next)=>{

    const orders=await Order.find()
   
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount += order.totalPrice;
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

//Update order process and product stock  by -Admin  
exports.updateOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
   
   if(order.orderStatus==='Delivered'){
      return next(new ErrorHandler("You have already delivered this order",400))
   }

   order.orderItems.forEach(async item=>{
       await updateStock(item.product,item.quantity)
   })

     order.orderStatus=req.body.orderStatus;
     order.deliveredAt=Date.now()
     await order.save();

      res.status(200).json({
        success:true,
    })
})

 async function updateStock(id,quantity){
    
    const product=await Product.findById(id);
 
    product.stock=product.stock-quantity;
      await product.save({ validateBeforeSave:false });
}

//delete order by admin
exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("No order found with this ID",404))
    }
   await order.deleteOne();
    res.status(200).json({
        success:true,
        order
    })
})

//Create new Review 
exports.createProductReview=catchAsyncError(async(req,res,next)=>{
   
    const {rating,comment,productId }=req.body;
    // console.log("req.body is",req.body)
    const review={
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    // console.log("review :",review)
    let product=await Product.findById(productId);
    const isReviewd=product.reviews.find(
        r=>r.user.toString()===req.user._id.toString()
    )

    if(isReviewd){                                //updating existing user own review 
       product.reviews.forEach(review =>{
           if(review.user.toString()===req.user.id.toString()){
               review.comment=comment;
               review.rating=rating;
           }
       })
      
    }
    else{                                         //create new review
       product.reviews.push(review)
       console.log(product.reviews)
       product.numOfReviews=product.reviews.length;
    }

    product.ratings=product.reviews.reduce((acc,item)=>item.rating + acc,0)/product.reviews.length;

       await product.save({ validateBeforeSave:false })
        res.status(200).json({
            success:true,
            product
        })
})

//get all the reviews of specific product 
exports.getProductReviews=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.id)
   
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

//delete product reviews
exports.deleteReview=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId)

    const reviews =product.reviews.filter( review=>
        review._id.toString()!==req.query.id.toString() ) ;

        const numOfReviews = reviews.length;
        const ratings = product.reviews.reduce((acc,item)=>item.rating+acc,0)/reviews.length

     await Product.findByIdAndUpdate(req.query.productId,{
         reviews,ratings,numOfReviews },
         { new:true, runValidators:true, useFindAndModify:false })

    res.status(200).json({
        success:true,
        
    })
})


 