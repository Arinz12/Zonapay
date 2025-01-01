require("dotenv").config()
const mongoose=require("mongoose")
mongoose.set("strictQuery",false);
const historySch= new mongoose.Schema(
    {
        User:{type:String},
        TransactionId:{type:String},
        Time:{type:String},
        Amount:{type:Number},
        Phoneno:{type:String},
        Network:{type:String},
        Product:{type:String}
    }
)
const History=mongoose.models.History || mongoose.model("History",historySch)
const dbOptions={
    useNewUrlParser: true,
    useUnifiedTopology: true,}
    
    async function saveHistory(obj){
      try{ 
         await mongoose.connect(process.env.DATABASEURL,dbOptions);
        await History.create({
            User:obj.user,
            TransactionId:obj.tid,
            Time:obj.time,
            Amount:obj.amount,
            Phoneno:obj.phone,
            Network:obj.network,
            Product:obj.product
        })}
        catch(e){
console.log("Something went wrong with saving the history")
        }
    }

    module.exports={saveHistory,History}