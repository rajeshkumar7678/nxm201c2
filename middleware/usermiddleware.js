const jwt=require("jsonwebtoken")
const {blackmodel}=require("../model/blacklist")


const middleware=async(req,res,next)=>{

    try {
        let {token,refreshtoken}=req.cookies
    let istokenpresent=await blackmodel.findOne({token})
    if(istokenpresent){
        return res.status(400).send({msg:"not authorized"})
    }
let decoded=jwt.verify(token,"masai")
if(!decoded){
    return res.status(400).send({msg:"Unauthorized"})


}

let id=decoded.id
let role=decoded.role
req.id=id
res.role=role
next()
    } catch (error) {
        console.log(error)
    }
}


module.exports={middleware}
