const mongoose= require("mongoose")
mongoose.set("strictQuery",false);
const Schema=new mongoose.Schema({
    User:{type:String},
    Bill:{type:String},
    Time:{type:String},
    Details:{
        biller_code:{type:String},
        item_code:{type:String},
        customer:{type:String},
        amount:{type:Number}
    },
    Status:{type:String,default:"Not completed"}
})
const Schedule=mongoose.models.Schedule|| mongoose.model("Schedule",Schema)
module.exports= Schedule