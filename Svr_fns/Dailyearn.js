require("dotenv").config()
const mongoose= require("mongoose")
mongoose.set("strictQuery",false)
const Eschema=new mongoose.Schema({
    Date:{type:String,unique:true}, 
    Earning:{type:Number},
    Airtime_purchases:{type:Number,default:0},
    Data_purchases:{type:Number,default:0},
Cabletv_purchases:{type:Number,default:0},
Electricity_purchases:{type:Number,default:0},
Airtime:{type:Number,default:0},
Data:{type:Number,default:0},
Cable_tv:{type:Number,default:0},
Electricity:{type:Number,default:0},
Total:{type:Number,default:0}

})

const Earning= mongoose.models.Earning|| mongoose.model("Earning",Eschema)
module.exports={Earning}