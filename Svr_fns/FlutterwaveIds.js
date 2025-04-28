require("dotenv").config()
const mongoose=require("mongoose");
mongoose.set("strictQuery", false)
const IdSchema= new mongoose.Schema({
Customer:{
type:String,required:true,trim:true
},
Ids:{type:[Number],default:[]}
})
const Flid=mongoose.models.Flid||mongoose.model("Flid",IdSchema);

async function updateFlid(name,id){
   const exist= await Flid.findOne({Customer:name})
   if(exist){
await Flid.updateOne({Customer:name},{$push:{Ids:id}})
console.log("txnid has been saved")
   }
else{ 
    await Flid.create({
    Customer:name,
    Ids:[id]
})
console.log("txnid has been created")
}
}

async function addFlid(name){
 await Flid.create({
 Customer:name,
 Ids:[]
})
}
module.exports={updateFlid}