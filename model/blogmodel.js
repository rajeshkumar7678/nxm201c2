const mongoose=require("mongoose")

let blogschema=mongoose.Schema({
    title:String,
    description:String,
    userid:String
})

let blogmodel=mongoose.model("blog",blogschema)

module.exports={
    blogmodel
}