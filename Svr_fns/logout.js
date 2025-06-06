const mongoose=require("mongoose");
const { User } = require("./createuser");
mongoose.set("strictQuery",false);
const sessions=mongoose.connection.db.collection("sessionsforusers");
const logout=async (email)=>{
const device=await User.findOne({Email:email})
const id=device._id.toString()
 await sessions.deleteMany({
    'session': {
      $regex: `"passport":{"user":"${id}"}`
    }
  })
}
module.exports=logout