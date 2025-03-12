const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.protect = async (req,res,next) => {
    let token = req.headers.authorization?.split(" ")[1]; // ✅ Fix split issue
    if (!token) return res.status(401).json({message:"Not authorized, no token"}); // ✅ Fix token check

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    }catch (err){
        res.status(401).json({message:"Not authorized, token failed"});
    }
}
