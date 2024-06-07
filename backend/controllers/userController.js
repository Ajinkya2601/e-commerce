import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import generateToken from "../utills/createToken.js";

const createUser=asyncHandler(async(req,res)=>{
   const {username,email,password}=req.body;
   if(!username || !email || !password){
       throw new Error("pleasefill all inputs");
   }

   const userExists = await User.findOne({email})
   if(userExists) res.status(400).send("User already exist")
   const saltRounds = 10;
   var hashedpassword;
   await bcrypt
  .genSalt(saltRounds)
  .then(salt => {
    console.log('Salt: ', salt)
    return bcrypt.hash(password, salt)
  })
  .then(hash => {
    hashedpassword=hash
  })
  .catch(err => console.error(err.message))
   const newUser=new User({username,email,password:hashedpassword})
   try{
    console.log(newUser)
    await newUser.save();    
    generateToken(res,newUser._id)
    res.status(201).json(newUser)
   }
   catch(error){
    res.status(400)
    console.log(error)
    throw new Error("Invalid data")
   }
})

const loginUser=asyncHandler(async(req,res)=>{
  const {email,password}=req.body
  const existingUser=await User.findOne({email})
  if(existingUser){
    const isPasswordValid=await bcrypt.compare(password,existingUser.password)
    if(isPasswordValid){
      generateToken(res, existingUser._id)
      res.status(201).json({
        _id:existingUser._id,
        username:existingUser.username,
        email:existingUser.emal,
        isAdmin:existingUser.isAdmin,
      })
      return; 
    }
    else{
    res.status(400)
    throw new Error("Wrong password")
    }
  }
  else{
    console.error("user does not exist");
    return;
  }
  
})


const logoutUser=asyncHandler(async(req,res)=>{
  res.cookie('jwt','',{
    httpOnly:true,
    expires:new Date(0),
  })
  res.status(200).json({message:"Logged out"})
})
export {createUser,loginUser,logoutUser}