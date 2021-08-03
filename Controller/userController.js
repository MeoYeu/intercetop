const bcrypt = require("bcrypt");
const Users = require("../Model/usersModel");
const jwt = require("jsonwebtoken");
const middleware=require('../Middleware/auth.js')
const userController = {
  register: async (req, res) => {
    
    
    try {
      const { name, email, password } = req.body;
      
      const user = await Users.findOne({ email: req.body.email });
      if (user) return res.status(400).json({ msg: "email đã tồn tại" });
      if (password.length < 6)
        return res.status(400).json({ msg: "mật khẩu cần nhiều hơn 6 ký tự" });
      //encript password
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });
      const successUser = newUser.save();
      const accessToken =middleware.createAccessToken({ id: successUser._id });
      const refreshtoken =middleware.createRefreshToken({ id: successUser._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/api/user/refreshtoken",
      });

      successUser
        ? res.json({ msg: `Đăng ký thành công ${accessToken}` })
        : res.json({ msg: "Đăng ký không thành công" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logIn: async (req, res) => {
    try {
      const {email,password } = req.body;
    
      const userLogin = await Users.findOne({email});
      if (!userLogin) {
        return res.status(400).json({ msg: "Tài khoản không tồn tại" });
      } else {
        const isMath = await bcrypt.compare(password, userLogin.password);
        
        if (!isMath) 
          return res.status(400).json("Tên đăng nhập hoặc mật khẩu không đúng");
     
          const accessToken =middleware.createAccessToken({ id: userLogin._id });
          const refreshtoken =middleware.createRefreshToken({ id: userLogin._id });
          res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            maxAge:24 * 60 * 60 * 1000 ,
           // consume:true 
          });
         
          return res.status(200).json({accessToken})
        }
      
    } catch (error) {
      res.status(400).json({msg:'lỗi login'+error.message})
    }
  },
  logOut:async(req,res)=>{
    res.clearCookie('refreshtoken')
    return res.json('Đăng xuất thành công',)
  },
  getUser: async(req,res)=>{
    try {
      const user=await Users.findById(req.user.id).select('-password')
      res.json(user)
    } catch (error) {
      res.json({code:'404'})
    }
  },
  refreshToken: (req, res) => {
    try {
      
      const rf_Token = req.cookies.refreshtoken;
      // console.log({rftoken:rf_Token});
      if (!rf_Token)
        return res.json({ msg: "đăng nhập hoặc đăng ký tài khoản" });
      jwt.verify(rf_Token,process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res
            .status(400)
            .json({ msg: "đăng nhập lại tài khoản nếu có" });
        const accesstoken =middleware.createAccessToken({ id: user.id });
      return  res.json({accesstoken });
      });
     
    } catch (error) {
      res.status(404).json({msg:'lỗi rồi'+error.message})
    }
  },
};

module.exports = userController;
