
const Product=require('../models/productModel')
const fakeProduct=require('../models/fakeProductModel')
const ErrorHandler=require('../utils/errorHandler')
const catchAsyncError=require('../middlewares/catchAsyncError')
const APIFeatures=require('../utils/apiFeatures')

exports.newProducts=catchAsyncError(async(req,res,next)=>{

  req.body.user=req.user.id;                // id of 'user' who create or insert new product is saved in user and then in database of product
  console.log("req.user.id",req.user.id)
    console.log(req.body)
 const product=await fakeProduct.create(req.body)
 res.status(201).json({
    success:true,
    product
 })
})

//get all products      api/products / ?keyword=apple /?page=2 /?category=laptop /?price[gte]=1&price[lte]=20
exports.getProducts=catchAsyncError(async(req,res,next)=>{

  // return next(new ErrorHandler('My Error',400))

  const resPerPage=4;
  const productsCount = await fakeProduct.countDocuments();
  const apiFeatures=new APIFeatures(fakeProduct.find(),req.query)
    .search()
    .filter()
    .pagination(resPerPage)

    const products=await apiFeatures.query;
    setTimeout(()=>{
      res.status(200).json({
        success:true,
        count:products.length,
        productsCount,
        resPerPage,
        products
       })
    },1000)
    
})


exports.getSingleProduct=catchAsyncError(async(req,res,next)=>{
const product=await fakeProduct.findById(req.params.id)


if(!product){
    console.log("product is empty")
    return next(new ErrorHandler('Product not found',404))
    
  }

res.status(201).json({
    success:true,
    product
})
})

exports.updateProduct=catchAsyncError(async(req,res,next)=>{
   
    let product=await fakeProduct.findById(req.params.id)
    if(!product){
        console.log("product is empty")
        return res(404).json({
            success:false,
            message:"Product not found"
        })
      }
  
       product=await fakeProduct.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
      })

      res.status(200).json({
        success:true,
        product
      })

})

exports.deleteProduct=catchAsyncError(async(req,res,next)=>{

    console.log("deleteeeeeeeeee")
    const product=await fakeProduct.findById(req.params.id)

    if(!product){
        console.log("product is empty")
        return res(404).json({
            success:false,
            message:"Product not found"
        })
      }

      await product.deleteOne();
      res.status(200).json({
        success:true,
        message:'Product is deleted'
      })
})