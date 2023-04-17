const mongoose=require("mongoose")

let blacklistschema=mongoose.Schema({
    token:String,
    refreshtoken:String
})

let blackmodel=mongoose.model("blacklist",blacklistschema)

module.exports={
    blackmodel
}