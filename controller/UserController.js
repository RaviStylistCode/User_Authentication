const sendMail = require("../utils/sendMail");
const User = require("../models/UserModel");
const sendToken = require("../utils/sendToken");
const asyncError = require("../middleware/asyncError");

// user Registration
exports.register = asyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    res.status(300).json({
      message: "user already exits",
      success: false,
    });
  }

  const otp = Math.floor(Math.random() * 1000000);
  user = await User.create({
    name,
    email,
    password,
    otp,
    otp_expire: new Date(Date.now() + 5 * 60 * 1000),
  });
  await sendMail(
    email,
    "Please verify your account",
    `This is your OTP :  ${otp} for verify your account`
  );
  sendToken(
    user,
    res,
    201,
    "Otp sent to your accout || Please Verify your account"
  );
});

// User Login
exports.login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: "please ente email and password",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "wrong email and password",
    });
  }

  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    return res.send("Invalid usename or password");
  }

  sendToken(user, res, 200, `welcome back ${user.name}`);
});

// My Profile
exports.getMe = asyncError(async (req, res, next) => {
  const user = await User.find(req.user._id);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid user",
    });
  }
  const data = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    verified: req.user.verified,
  };
  res.status(200).json({
    success: true,
    message: `welcome back ${req.user.name}`,
    data,
  });
});

// Verify your acccount
exports.verify = asyncError(async (req, res, next) => {
  const otp = Number(req.body.otp);
  const user = await User.findById(req.user._id);
  if (user.otp !== otp || user.otp_expire < Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Invalid otp or has been expired",
    });
  }

  user.verified = true;
  user.otp = null;
  user.otp_expire = null;
  await user.save();
  sendToken(user, res, 200, "Accound Verified");
});

// user Logout
exports.logout = asyncError((req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Admin get user by Id
exports.singleUser = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user does not exit",
      user,
    });
  }

  res.status(200).json({
    success: true,
    message: "User found successfully",
    user,
  });
});

// update user
exports.UpdateUser = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  user.name = name;
  await user.save();

  res.status(203).json({
    success: true,
    message: "user updated",
    user,
  });
});

// forget password

exports.forgetpassword = asyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid Email",
    })
  }

  const resetotp = Math.floor(Math.random()* 1000000);
    user.resetPasswordotp = resetotp;
    user.resetPassword_expire= new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

   const messages=`This Otp : ${resetotp} for resetting your password .\n\n\n If you didn't messaged the please ignore this\n\n Thank You`;
    sendMail(email,"For Reset Password",messages);

    res.status(200).json({
      success:true,
      message:`email sent to ${user.email}`
    })
});

// Reset password
exports.resetPassword=asyncError(async(req,res,next)=>{

  const {otp,newPassword}=req.body;
  if(!otp || !newPassword){
    return res.status(400).json({
      success:false,
      message:"Please enter all fields"
    })
  }

  const user= await User.findOne({
    resetPasswordotp:otp,resetPassword_expire:{$gt:Date.now()}
  });
   
  if(!user){
    return res.status(400).json({
      success:false,
      message:"Invalid otp or has been expired"
    })
  }

    user.password=newPassword;
    user.resetPasswordotp=null;
    user.resetPassword_expire=null;
    await user.save();
    sendToken(user,res,200,"Password changed successfully");

});

// Delete User
exports.DeleteUser = asyncError(async (req, res, next) => {
  const { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  // user = await User.findByIdAndDelete({id});
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User Deleted",
  });
});

//  Admin Get all user
exports.AllUser = asyncError(async (req, res, next) => {
  const user = await User.find();
  // const ps= await User.aggregate([{$match:{likes:{$gt:1}}}])
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Found All Users",
    user,
  });
});
