const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    const tokens = req.headers.authorization;
    
    if (tokens) {
   
      const token = tokens.slice(7, tokens.length);
      
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.status(400).json({ msg:err.message});
          req.user = user;
          next();
        }

      );
    } else {
      res.status(404).json({ msg: "bạn không có quyền" });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};
const createAccessToken = (user) => {
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10s",
    });
  };

  const createRefreshToken = (user) => {
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  };
module.exports = { auth,createAccessToken,createRefreshToken};
