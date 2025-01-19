require("dotenv").config()
const mongoose=require("mongoose")
mongoose.set("strictQuery",false)
const Userschema= new mongoose.Schema(
    {
        Username:{type:String},
        Email:{type:String},
        Password:{type:String},
        Balance:{type:Number},
        Pin:{type:String}
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
    Balance:500,
    Pin:null,
})
console.log("user saved successfully...")
}
catch(e){
console.log("User creation failed!!!")
}
finally{
   console.log("DONE...")
}

}

module.exports={User,createUser}