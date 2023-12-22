const sendToken = (user, res, statusCode, message) => {
  const token = user.getJwt();

  const option = {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
  };

  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    message,
    userData,
    token,
  });
};

module.exports = sendToken;
