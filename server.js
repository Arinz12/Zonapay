// server.js
const express = require('express');
const {createUser, User}= require("./Svr_fns/createuser")
const multer= require("multer")
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const { Socket } = require('net');
const cookieParser = require('cookie-parser');
const {URL} =require("url")
const path= require("path")
const dev = process.env.NODE_ENV !== 'production';
const mongoose=require("mongoose")
const app = next({ dev });
const handle = app.getRequestHandler();
const upload=multer()
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore=require("connect-mongo");
const sendd = require('./flib/mailsender');
const { v4: uuidv4 } = require('uuid');
const {DateTime} =require("luxon");
const { saveHistory } = require('./Svr_fns/saveHistory');
const vet = require('./Svr_fns/verifyT');
const {body,validationResult}= require("express-validator");
const { error } = require('console');
const bcrypt=require("bcrypt")
const cors= require("cors")


mongoose.set("strictQuery",false)
//DB CONNECTION
mongoose.connect(process.env.DATABASEURL , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.prepare().then(() => {
  const server = express();

  const httpServer = http.createServer(server);
  const io = new Server(httpServer);
Userss={}
  // Socket.IO setup
  io.on('connection', (socket) => {
    console.log('A user connected'+socket.id);
    Userss["123"]=socket.id
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  server.use(express.json()); // Parse JSON bodies
server.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
server.use(cookieParser());
// Session management
server.use(session({
  store: MongoStore.create({
     mongoUrl:process.env.DATABASEURL,
     collectionName:"sessionsforusers",
     ttl: 1 * 24 * 60 * 60,  // Session TTL in MongoDB (1 day)
autoRemove:"native",
  }),
  secret: 'Niceone',
  resave: false,
  saveUninitialized: false,
cookie:{
  httpOnly:true,
  sameSite:"lax",
  maxAge: 2*12*3600 * 1000,  // Cookie expires 
  secure:false,
  path:"/"
}
}));

// Passport session initialization
server.use(passport.initialize());
server.use(passport.session());


passport.use(new LocalStrategy({
  usernameField: 'email'},
  
  async (username, password, done) => {
    try {
      // Step 1: Find the user by username
      const user = await User.findOne({ Email:username });

      // Step 2: If user doesn't exist, return an error
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isit= bcrypt.compareSync(password,user.Password)
      // Step 3: Compare the provided password with the stored hash
      //const isMatch = await user.comparePassword(password);

      // Step 4: If passwords don't match, return an error
      if (!isit) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      // Step 5: Authentication successful, return the user object
      return done(null, user);
    } catch (err) {
      console.log(" Error From passport auth")
      return done(err);
    }
  }
));

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only the user ID in the session
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Fetch user from DB by ID
    done(null, user); // Attach the full user object to the request as req.user
  } catch (err) {
    done(err);
  }
});






const fundvals = [
  // Name Validation
  body("name")
    .trim() // First trim whitespace
    .escape() // Escape any HTML characters
    .notEmpty().withMessage("Name field Cannot be empty") // Check that it's not empty
    .isLength({ min: 3, max: 10 }).withMessage("Character must be between 3 to 10 characters long")
    ,

  // Email Validation
  body("email")
    .trim()
    .escape()
    .notEmpty().withMessage("Email Cannot be empty")
    .isEmail().withMessage("Please enter a valid email"),

  // Amount Validation
  body("amount")
    .trim()
    .escape()
    .notEmpty().withMessage("Please input amount")
    .isNumeric().withMessage("Must be a number")
    .isInt({ min: 200, max: 300000 }).withMessage("Amount must be between 200 to 300000"),

  // Phone Validation
  body("phone")
    .trim()
    .escape()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^(070|080|081|090|091|093)[0-9]{8}$/).withMessage('Invalid Nigerian phone number')
    .isLength({ min: 11, max: 11 }).withMessage('Phone number must be 11 digits long'),
];


//  API routes
  server.post("/validatefundform",fundvals,(req,res)=>{
    console.log(req.body)
 const errors= validationResult(req);
 console.log(errors)
 if(!errors.isEmpty()){
   return res.status(404).json({errors:errors.array()});
 }
res.status(200).json({guid:uuidv4()})
  })

  server.get('/api/some-endpoint', (req, res) => {
    res.json({ message: 'Hello from API' });
  });

  //for buying airtime
  server.post("/zonapay/airtime", upload.none(),async (req,res)=>{
    if(!req.isAuthenticated()){
      res.redirect("/signup")
      return;
    }
    const url=new URL("https://vtu.ng/wp-json/api/v1/airtime?username=ArinzechukwuGift&password=ari123Ari@vv")
const {nid,amount,Phoneno} =req.body;
//url.searchParams.append("username","ArinzechukwuGift")
//url.searchParams.append("password","ari123Ari@vv")
const Id = mongoose.Types.ObjectId(req.user._id);
const usernow=  await User.findById(Id)
const balance=usernow.Balance
const isFundsSufficient= balance>amount
if(!isFundsSufficient){
res.status(400).json({code:"insufficientFund"})
return;
}

url.searchParams.append("phone", Phoneno)
url.searchParams.append("network_id", nid)
url.searchParams.append("amount", amount)
try{
const result= await fetch(url.toString(),{method:"GET"})
const result2= await result.json()
console.log(result2);
if(result2.code=="success"){
  //update balance at Database
  await User.findByIdAndUpdate(Id, { $inc: { Balance: -amount } },  { new: true } )
const msg=`${Phoneno} successfully purchased an airtime of ${amount} `;
//create an object to save as history
const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
const history={user:req.user.Email,tid:uuidv4(),time:timeinNigeria,amount:amount,phone:Phoneno,network:nid,product:"Airtime"}
await saveHistory(history);
sendd("igwebuikea626@gmail.com",msg)}
res.status(200).json(result2)}
catch(e){
console.log(e+"wronggg")
}
  })
// validate user for login
  server.post("/zonapay/valUser",async (req,res)=>{
const {email,password}=req.body;
console.log(email+" and "+ password)
try{
const detail= await User.findOne({Email:email,Password:password});
console.log(detail)
if(detail){
  console.log("verified..");
  return res.status(200).send("verified");
}
else{
  console.log("Not verified")
  return res.status(400).send("verificatin failed")
}}
catch(e){
  console.log("connection error: "+e)
}
  })
// logout
  server.get("/zonapay/logout",(req,res,next)=>{
req.logout((err)=>{
if(err){
  next(err);
}
res.redirect("/")
});
  })



//signup a user
const validateInfo=[
  body("Username")
  .trim() // First trim whitespace
  .escape() // Escape any HTML characters
  .notEmpty().withMessage("Name field Cannot be empty") // Check that it's not empty
  .isLength({ min: 3, max: 10 }).withMessage("Character must be between 3 to 10 characters long")
  ,

// Email Validation
body("Email")
  .trim()
  .escape()
  .notEmpty().withMessage("Email Cannot be empty")
  .isEmail().withMessage("Please enter a valid email"),

  body('Password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (e.g., @$!%*?&)'),
]
  server.post("/signup",validateInfo ,async (req,res)=>{
    const errors=validationResult(req);
    console.log(errors.isEmpty())
    console.log(errors)
    if(errors.isEmpty()){
    const {Username,Email,Password}=req.body;
try{
  
  await createUser(Username,Email,Password);
console.log("Done")

setTimeout(()=>{
  res.redirect("/login")
},1000);
return;

}
catch(e){
  console.log("something went wrong")

  setTimeout(()=>{
    res.redirect("/signup")
  },1000);

  }
    }
    else{
      return res.status(400).json({errors:errors.array()})
    }
})


//login for a user
server.post("/login",passport.authenticate("local",{
  failureRedirect:"/signup",
  successRedirect:"/dashboard"
}))
//Data purchase
server.post("/zonapay/data",upload.none() ,async (req,res)=>{

  const url=new URL("https://vtu.ng/wp-json/api/v1/data?username=ArinzechukwuGift&password=ari123Ari@vv")
  const {nid,plan,Phoneno} =req.body;
  //url.searchParams.append("username","ArinzechukwuGift")
  //url.searchParams.append("password","ari123Ari@vv")
  const Id = mongoose.Types.ObjectId(req.user._id);
const usernow=  await User.findById(Id)
const balance=usernow.Balance
const isFundsSufficient= balance>500
  if(!isFundsSufficient){
  res.status(400).json({code:"insufficientFund"})
  return;
  }
  
  url.searchParams.append("phone", Phoneno)
  url.searchParams.append("network_id", nid)
  url.searchParams.append("variation_id", plan)
  try{
    const result= await fetch(url.toString(),{method:"GET"})
    const result2= await result.json()
    console.log(result2);
    if(result2.code=="success"){
      const newamount= eval(result2.data.amount.replace(/\D/g,""))

      await User.findByIdAndUpdate(Id, { $inc: { Balance: -newamount } },  { new: true } )

      //history object
      const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
      const history={user:req.user.Email,tid:uuidv4(),time:timeinNigeria,amount:newamount,phone:Phoneno,network:nid,product:result2.data.data_plan}
     await  saveHistory(history)
      const msg=`${Phoneno} successfully purchased data of ${plan} at ${newamount} `
      sendd("igwebuikea626@gmail.com",msg);
    }
    
    res.status(200).json(result2)}
    catch(e){
    console.log(e+"wronggg")
    }
    
      }
)

//Cable tv
server.post("/zonapay/cable",async (req,res)=>{
const url = new URL("https://vtu.ng/wp-json/api/v1/tv?username=ArinzechukwuGift&password=ari123Ari@vv")
const {cableprovider,iuc,phone,variation_id}= req.body;
console.log(iuc)
const Id = mongoose.Types.ObjectId(req.user._id);
const usernow=  await User.findById(Id)
const balance=usernow.Balance
const isFundsSufficient= balance>500
  if(!isFundsSufficient){
  res.status(400).json({code:"insufficientFund"})
  return;
  }
  url.searchParams.append("phone",phone)
  url.searchParams.append("service_id",cableprovider)
  url.searchParams.append("smartcard_number",iuc)
  url.searchParams.append("variation_id",variation_id)

  try{
const data=await fetch(url.toString(),{method:"GET"})
if(data.ok){
  
  const data2=await data.json()
  console.log(data2)
  if(data2.code==="failure"){
    throw new Error("request failure");
  }
  res.status(200).json(data2)
}
else{
  throw new Error("response was not ok");
}
  }
  catch(e){
console.log(e)
res.status(400).json({message:"check your connection"});
return;
  }
})

//Setting pin
server.post("/zonapay/setpin", async (req,res)=>{
  if(!req.isAuthenticated()){
console.log("YOU HAVE TO LOG IN FIRST!!!");
return;
  }

  const pin =req.body.pin
  const pinrefined=bcrypt.hashSync(pin, 10)
  try{await User.findByIdAndUpdate(req.user._id,{$set:{Pin:pinrefined}},{new:true})
console.log("pin has been set")
res.status(200).json({status:"success"})
}
  catch(e){
    res.status(400).send("failed")
  }


})
//confirming pin
server.post("/zonapay/confirmPin",(req,res)=>{
  if(!req.isAuthenticated()){
    console.log("login please")
    return
  }
  const pin= req.body.pinn
  
  const okay= bcrypt.compareSync(pin,req.user.Pin);
  if(okay){
    res.status(200).json({status:"success"})
  }
  else{
    res.status(401).send("failed");
  }
})


//funding
server.get("/dashboard/fund",(req,res)=>{
  const filePath = path.join(__dirname, 'TestFlutter.html');
  
  // Send the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.log("Error sending the file:", err);
      res.status(500).send("Error sending the file.");
    }
})})

//Server sent events
server.get("/stream",cors(),(req,res)=>{
res.writeHead(200,
  {'Content-Type':"text/event-stream",
"cache-control":"no-cache",
"Connection":"keep-alive"

})
const data="Connection to server is maintained"
const interval = setInterval(()=>{res.write(`data:${data}\n\n`)}, 3000);

    // Cleanup when the connection is closed
    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });

})


//verifying flutterwave transactions
server.get("/done",async (req,res)=>{
  console.log("done path has been entered")
  const Id = mongoose.Types.ObjectId(req.user._id);
  const tx_ref=req.query.tx_ref;
  const transaction_id= req.query.transaction_id;
  console.log(tx_ref)
  console.log(transaction_id)
    try{await vet(tx_ref,transaction_id,Id)
  res.redirect("/dashboard");
  }
  catch(e){
    res.send("VERIFICATION FAILED");
  }
  
})

  // Next.js page handling
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
