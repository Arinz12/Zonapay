const mongoose=require("mongoose");
const { User } = require("./createuser");
mongoose.set("strictQuery",false);
async function logout (iddd){
  console.log("about to search for device session")
const sessions= mongoose.connection.db.collection("sessionsforusers");
const device=await User.findOne({Loginid:iddd})
const id=device._id.toString()
console.log("user is ", id)
 await sessions.deleteMany({
    'session': {
      $regex: `"passport":{"user":"${id}"}`
    }
  })
}
module.exports=logout