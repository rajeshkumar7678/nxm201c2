const mongoose=require("mongoose")

const userschema=({
    name:String,
    email:{
        type:String,
        unique:true,

    },
    password:String,
    role:{
        type:String,
        default:"user",
        enum:["user","moderator"]
    }
})

const usermodel=mongoose.model("user",userschema)

module.exports={
    usermodel
}