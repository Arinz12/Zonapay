require("dotenv").config()
const mongoose=require("mongoose")
mongoose.set("strictQuery",false)
const Userschema= new mongoose.Schema(
    {
        Username:{type:String},
        Email:{type:String},
        Password:{type:String},
        Balance:{type:Number}
    })
    const User = mongoose.models.User || mongoose.model("User", Userschema);

const dbOptions={
    useNewUrlParser: true,
    useUnifiedTopology: true,}
    
   async function createUser(username,email,password){
    try{
       await mongoose.connect(process.env.DATABASEURL, dbOptions);
console.log("Db connected")
    await User.create({
    Username:username,
    Email:email,
    Password:password,
    Balance:1000
})
console.log("user saved successfully...")
}
catch(e){
console.log("User creation failed!!!")
}
finally{
   await mongoose.disconnect((err)=>{
if(err){
    console.log("error occured during Db disconnection")
}
else{
console.log("db disconnected")
    }})
}

}

module.exports={User,createUser}