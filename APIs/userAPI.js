import exp from 'express'
import {hash,compare} from 'bcryptjs'
import {config} from 'dotenv'
import jwt from 'jsonwebtoken'
config()
import { verifyToken } from '../middlewares/tokenVerificationMiddleware.js'
import { allowedRoles } from '../middlewares/allowedRolesMiddleware.js'
import { UserModel } from '../models/userModel.js'
export const userRouter = exp.Router()

//register
userRouter.post('/users', async(req,res)=>{
    //get user object from req
    let newUser = req.body
    if(newUser.role==="ADMIN") {
        return res.status(401).json({success:false,message:"You cannot register as admin"})
    }
    //hash the password
    let hashedPassword = await hash(newUser.password,12)
    newUser.password = hashedPassword
    //save in db
    let userDocument = await UserModel.create(newUser)
    res.status(201).json({success:true,message:"User created",data:userDocument})
})

//login 
userRouter.post('/users/login', async(req,res)=>{
    //get user cred object from req
    let credObj = req.body
    //verify the email
    let user = await UserModel.findOne({email:credObj.email})
    if(user===null) {
        res.status(401).json({success:false,message:"Invalid email"})
    } else {
        //verify password
        let result = await compare(credObj.password,user.password)
        if(result===false) {
            res.status(401).json({success:false,message:"Invalid password"})
        } else {
            //create jwt and encode it
            let signedToken = jwt.sign({id:user._id,role:user.role},process.env.SECRET_KEY,{expiresIn:'10d'})
            //store in cookie as httpOnly cookie
            res.cookie("accessToken",signedToken,{
                httpOnly:true,
                secure:false,
                sameSite:"lax"
            })
            res.status(200).json({success:true,message:"Login success"})
        }
    }
})

//logout
userRouter.post('/users/logout', async(req,res)=>{
    res.clearCookie("accessToken",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })
    res.status(200).json({success:true,message:"Logout success"})
})

//view profile 
userRouter.get('/users/:id',verifyToken,allowedRoles("JOBSEEKER","ADMIN"),async(req,res)=>{
    //check logged in user id and id in url parameter are same or not
    let idOfParam=req.params.id
    let currentUserId=req.user.id
    if(idOfParam!==currentUserId) {
        return res.status(401).json({success:true,message:"You are not allowed to access other's account"})
    }
    //get object id from url parameter
    let objectIdOfUrl=req.params.id
    //get user by id
    let user= await UserModel.findById(objectIdOfUrl)
    if(user===null) {
        res.status(404).json({success:false,message:"User not found"})
    } else {
        res.status(200).json({success:true,message:"User found",data:user})
    }
})

//update user by id 
userRouter.put('/users/:id',verifyToken,allowedRoles("JOBSEEKER"),async(req,res)=>{
    //check logged in user id and id in url parameter are same or not
    let idOfParam=req.params.id
    let currentUserId=req.user.id
    if(idOfParam!==currentUserId) {
        return res.status(401).json({success:true,message:"You are not allowed to access other's account"})
    }
    //get modified user from client
    let modifiedUser=req.body
    //get object id from url parameter
    let objectId=req.params.id
    //update user
    let updatedUser= await UserModel.findByIdAndUpdate(objectId,
        {$set:{...modifiedUser}},
        {new:true,runValidators:true}
    )
    res.status(200).json({success:true,message:"User profile updated",data:updatedUser})
})

//view all users
userRouter.get('/users',verifyToken,allowedRoles("ADMIN"),async(req,res)=>{
    //get all users
    let users = await UserModel.find()
    res.status(200).json({success:true,message:"All users",data:users})
})

//update a user's status
userRouter.put('/users/status/:id',verifyToken,allowedRoles("ADMIN"),async(req,res)=>{
    //get user id from url
    let userId = req.params.id
    let newStatus = req.body.status
    //update the status
    let updatedUser = await UserModel.findByIdAndUpdate(userId,
        {$set:{status:newStatus}},
        {new:true,runValidators:true}
    )
    res.status(200).json({success:true,message:"User status updated",data:updatedUser})
})

//delete a user
userRouter.delete('/users/:id',verifyToken,allowedRoles("ADMIN",async(req,res)=>{
    //get user id from url
    let userId = req.params.id
    //delete the user
    let deletedUser = await UserModel.findByIdAndDelete(userId)
    res.status(200).json({success:true,message:"User deleted",data:deletedUser})
}))
