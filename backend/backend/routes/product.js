const express=require('express')
const router=express.Router()
const {getProducts,newProducts,getSingleProduct,updateProduct,deleteProduct}=require('../controllers/productControllers')
const {isAuthenticatedUesr,authorizeRoles}=require('../controllers/userController')
// router.route=('/product').get(getProducts);
router.get('/products',getProducts)
router.get('/product/:id',getSingleProduct)
router.post('/admin/products/new',isAuthenticatedUesr,authorizeRoles('admin'),newProducts)
router.put('/admin/product/:id',isAuthenticatedUesr,authorizeRoles('admin'),updateProduct) 
router.delete('/admin/product/:id',isAuthenticatedUesr,authorizeRoles('admin'),deleteProduct)

module.exports=router;
// export default router;