const jwt = require("jsonwebtoken");

const authenticate = function (req, res, next) {
  const AuthorizationHeader = req.header("Authorization");
  if (!AuthorizationHeader) {
    next(new errorResponse(`Access Denied`, 401));
  }

  const token = AuthorizationHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    console.log("verified",verified);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: `Invalid token/Expired Token`
    });
  }
};

module.exports = { authenticate: authenticate };
