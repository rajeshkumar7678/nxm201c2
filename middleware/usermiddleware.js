const jwt=require("jsonwebtoken")
const cookies=require("cookie-parser")
const { blackmodel } = require("../model/blacklist")

const middleware=async (req,res,next)=>{
    try {
        let {token,refreshtoken}=req.cookies
        console.log(token)
        let istoken=await blackmodel.findOne({token})
        if(istoken){
            return res.status(400).send("not authorise")
        }
        let decoded=jwt.verify(token,"masai")
        if(!decoded){
            return res.status(400).send("not authorise")
        }
        req.id=decoded.id
        req.role=decoded.role
        console.log(decoded.id,decoded.role)
        next()

    } catch (error) {
        res.send(error)
    }

}

module.exports={
    middleware
}