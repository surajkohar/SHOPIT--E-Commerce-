const express=require('express')
const router=express.Router()
const {newOrder, myOrders, getSingleOrder, allOrders, updateOrder,
     deleteOrder, createProductReview, getProductReviews, deleteReview}=require('../controllers/orderController')
const { isAuthenticatedUesr, authorizeRoles } = require('../controllers/userController')
 
router.post('/order/new',isAuthenticatedUesr, newOrder)
router.get('/order/:id',isAuthenticatedUesr, getSingleOrder)
router.get('/orders/me',isAuthenticatedUesr, myOrders)
router.get('/admin/order',isAuthenticatedUesr,authorizeRoles('admin'),allOrders)
router.put('/admin/updateOrder/:id',isAuthenticatedUesr,authorizeRoles('admin'),updateOrder)
router.delete('/admin/deleteOrder/:id',isAuthenticatedUesr,authorizeRoles('admin'),deleteOrder)

router.put('/review',isAuthenticatedUesr,createProductReview)
router.get('/review',isAuthenticatedUesr,getProductReviews)
router.delete('/review',isAuthenticatedUesr,deleteReview)




module.exports=router