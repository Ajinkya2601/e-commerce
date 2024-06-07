import jwt from 'jsonwebtoken'
import User from '../models/userModel'
import asyncHandler from './asyncHandler'

const authenticate=asyncHandler(async(req,res,next)=>{
    let token;
})