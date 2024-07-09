const express=require('express');
const { registerUser,loginUser,logout, forgotPassword, resestPassword, getUserProfile, isAuthenticatedUesr, 
    updateProfile,updatePassword, authorizeRoles, allUsers, updateUser,getUserDetails,deleteUser } = require('../controllers/userController');
const router=express.Router();



router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',logout);
router.post('/password/forgot',forgotPassword);
router.put('/password/reset/:token',resestPassword);
router.get('/me',isAuthenticatedUesr ,getUserProfile);
router.put('/password/update',isAuthenticatedUesr, updatePassword);
router.put('/me/update',isAuthenticatedUesr, updateProfile);
router.get('/admin/users',isAuthenticatedUesr,authorizeRoles('admin') ,allUsers);
router.get('/admin/user/:id',isAuthenticatedUesr,authorizeRoles('admin') ,getUserDetails);
router.put('/admin/user/:id',isAuthenticatedUesr,authorizeRoles('admin') ,updateUser);
router.delete('/admin/user/:id',isAuthenticatedUesr,authorizeRoles('admin') ,deleteUser);



module.exports = router;
