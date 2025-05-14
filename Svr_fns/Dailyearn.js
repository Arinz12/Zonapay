require("dotenv").config()
const mongoose= require("mongoose")
mongoose.set("strictQuery",false)
const Eschema=new mongoose.Schema({
    Date:{type:String,unique:true},
    Earning:{type:Number},
    Airtime_purchases:{type:Number},
    Data_purchases:{type:Number},
Cabletv_purchases:{type:Number},
Electricity_purchases:{type:Number},
Airtime:{type:Number},
Data:{type:Number},
Cable_tv:{type:Number},
Electricity:{type:Number},
Total:{type:Number}

})

const Earning= mongoose.models.Earning|| mongoose.model("Earning",Eschema)
module.exports={Earning}