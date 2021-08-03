const router=require('express').Router()
const userController=require('../Controller/userController')
const middleware = require('../Middleware/auth.js')
router.post("/register",userController.register)
router.post("/login",userController.logIn)
router.get("/logout",userController.logOut)
router.get("/infor",middleware.auth,userController.getUser)
router.get("/refreshtoken",userController.refreshToken,()=>{
    
})

module.exports=router
