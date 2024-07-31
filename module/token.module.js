const jwt=require("jsonwebtoken")

const generateToken=(payload)=>{
    const token=jwt.sign(payload,process.env.JWT_SECRET_KEY);
    return token;
}

module.exports=generateToken;