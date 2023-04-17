const express=require("express")
const { usermodel } = require("../model/usermodel")
const bcrypt=require("bcrypt")
const userroute=express.Router()
const jwt=require("jsonwebtoken")
let cookies=require("cookie-parser")
const { blackmodel } = require("../model/blacklist")

userroute.get("/",(req,res)=>{
    res.send("user route")
})


userroute.post("/register",async(req,res)=>{
    try {
        let {email,password,role,name}=req.body
        let isuser=await usermodel.findOne({email})
        if(isuser){
            return res.status(400).send({"mas":"already user !!"})
        } 
        let decoded=bcrypt.hashSync(password,4)
        let user=new usermodel({email,password:decoded,name,role})
        await user.save()
        res.status(200).send("user registerd")
    } catch (error) {
        res.status(400).send(error)
    }
})

userroute.post("/login",async(req,res)=>{
    try {
        let {email,password}=req.body
        let user=await usermodel.findOne({email})
        if(!user){
            return res.status(400).send("register first")
        }
        let comppass=bcrypt.compare(password,user.password)
        if(!comppass){
            return res.status(400).send("wrong password")
        }
        let token=jwt.sign({id:user._id,role:user.role},"masai",{expiresIn:"1hr"})
        let refreshtoken=jwt.sign({id:user._id,role:user.role},"masai",{expiresIn:"3m"})
        res.cookie("token",token,{maxAge:20000*60})
        res.cookie("refreshtoken",refreshtoken,{maxAge:20000*60*5})
        res.status(200).send("login sucessfull")
    } catch (error) {
        res.status(400).send(error)
    }
})


userroute.get("/logout",async (req,res)=>{
    try {
        let {token,refreshtoken}=req.cookies
        let blacklisttoken= new blackmodel({token})
        await blacklisttoken.save()
        let blacklistreftoken= new blackmodel({refreshtoken})
        await blacklistreftoken.save()
        res.status(200).send("logout sucessfull")
    } catch (error) {
        res.status(400).send(error)
    }
})

userroute.get("/refresh",async (req,res)=>{
    try {
        let {refreshtoken}=req.cookies
        let blacklisted=blackmodel.findOne({refreshtoken})
        if(blacklisted){
            return res.status(400).send("login again")
        }
        let decoded=jwt.verify(refreshtoken,"masai")
        if(!decoded){
            return res.status(400).send("login again")
        }
        let {id,role}=decoded
        let token=jwt.sign({id:user._id,role:user.role},"masai",{expiresIn:"1m"})
        res.cookie("token",token,{maxAge:20000*60})
        res.status(200).send("token refreshed")

        
    } catch (error) {
        res.status(400).send(error)
    }
})






module.exports={
    userroute
}