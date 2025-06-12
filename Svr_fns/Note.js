const mongoose=require("mongoose");
const {DateTime}=require("luxon")
mongoose.set("strictQuery", false)
const Nschema=new mongoose.Schema({
    Date:{type:String,default:"0"},
    Notes:{type:[{time:{type:String},
        value:{type:String}
    }],default:[]}})
const Note= mongoose.models.Note||mongoose.model("Note",Nschema);

async function addNote(n){
    const time= DateTime.local().setZone("Africa/Lagos").toFormat("LLL dd yyyy hh:mm");
    const exist= await Note.findOne();
    if(!exist){
await Note.create({
    Notes:{time,value:n}
})
console.log(" A Notification have been created")

}
else{
    await Note.updateOne({Date:"0"},{$push:{Notes:{time,value:n}}})
    console.log("Notification have been added")
}
}
module.exports={addNote,Note}