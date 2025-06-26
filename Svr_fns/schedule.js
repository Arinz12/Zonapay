const mongoose= require("mongoose")
mongoose.set("strictQuery",false);
const Schema=new mongoose.Schema({
    User:{type:String},
    Idd:{type:String},
    Bill:{type:String},
    Nid:{type:String},
    Time:{type:String},
    Type:{type:String},
    Details:{
        biller_code:{type:String},
        item_code:{type:String},
        customer:{type:String},
        amount:{type:Number}
    },
    Status:{type:String,default:"not completed"}
})
const Schedule=mongoose.models.Schedule||mongoose.model("Schedule",Schema)
module.exports= Schedule