const User=require("../models/UserModel");
const jwt=require("jsonwebtoken");
const asyncError=require("../middleware/asyncError");

exports.isAuthenticated = asyncError(async(req,res,next)=>{
        const {token}=req.cookies;
        // console.log(token)
        if(!token){
            return res.status(400).json({
                success:false,
                message:"invalid user"
            })
        }

        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user= await User.findById(decoded._id);
        next();
});