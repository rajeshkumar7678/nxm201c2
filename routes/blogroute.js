const express=require("express")
const { middleware } = require("../middleware/usermiddleware")
const { blogmodel } = require("../model/blogmodel")

const blog=express.Router()


blog.post("/post",async (req,res)=>{


    try {
        
        let data=new blogmodel(req.body)
        data.userid=req.id
        await data.save()
        res.status(200).send("post created")
    } catch (error) {
        console.log(error)
       res.send(error) 
    }
} )

blog.get("/get",async(req,res)=>{
    try {
        let data=await blogmodel.find()
        res.status(200).send(data)
    } catch (error) {
        res.send(error) 
    }

})

blog.put("/update/:id",middleware,async (req,res)=>{
    try {
        let {id}=req.params
        let data=blogmodel.findById({_id:id})
        if(req.id==data.userid){
            data.updateOne(req.body)
            res.status(200).send("data updated")
        }else{
            res.status(400).send("not authorised")
        }
    } catch (error) {
        res.send(error) 
    }
   

})

blog.delete("/delete/:id",middleware,async (req,res)=>{
    try {
        let {id}=req.params
        let data=blogmodel.findById({_id:id})
        if(req.id==data.userid|| req.role=="Moderator"){
            data.deleteOne()
            res.status(200).send("data deleted")
        }else{
            res.status(400).send("not authorised")
        }
    } catch (error) {
        res.send(error) 
    }
   

})









module.exports={
    blog
}