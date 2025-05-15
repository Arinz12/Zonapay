require("dotenv").config()
const mongoose=require("mongoose");
mongoose.set("strictQuery",false);
const Oschema= new mongoose.Schema({
    Email:{type:String,unique:true},
    Otp:{type:String,unique:true}
})
const Otpmodel= mongoose.models.Otpmodel || mongoose.model("Otpmodel",Oschema);
module.exports={Otpmodel}