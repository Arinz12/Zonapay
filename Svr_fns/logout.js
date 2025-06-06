const mongoose=require("mongoose");
const { User } = require("./createuser");
mongoose.set("strictQuery",false);
const logout=async (email)=>{
const sessions= mongoose.connection.db.collection("sessionsforusers");
const device=await User.findOne({Email:email})
const id=device._id.toString()
console.log("user is ", id)
 await sessions.deleteMany({
    'session': {
      $regex: `"passport":{"user":"${id}"}`
    }
  })
}
module.exports=logout