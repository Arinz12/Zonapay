// server.js
require("dotenv").config()
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
const upload=multer();
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
const bcrypt=require("bcrypt");
const cors= require("cors");
const { otp } = require('./flib/forgotPass');
const { verif } = require("./Svr_fns/verifyBills");
const { updateFlid,Flid } = require("./Svr_fns/FlutterwaveIds");
const { Earning } = require("./Svr_fns/Dailyearn");
mongoose.set("strictQuery",false)
//DB CONNECTION

mongoose.connect(process.env.DATABASEURL , { useNewUrlParser: true, useUnifiedTopology: true,connectTimeoutMS: 50000,serverSelectionTimeoutMS:5000,socketTimeoutMS:45000 })
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

//using passport localstrategy
passport.use(new LocalStrategy({
  usernameField: 'email'},
  async (username, password, done) => {
    try {
      // Step 1: Find the user by username
      const user = await User.findOne({ Email:username.trim().toLowerCase()});

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
    .isInt({ min: 50, max: 300000 }).withMessage("Amount must be between 200 to 300000"),

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
const {nid,amount,Phoneno} =req.body;
const Id = mongoose.Types.ObjectId(req.user._id);
const usernow=  await User.findById(Id)
const balance=usernow.Balance
const isFundsSufficient= balance>amount
if(!isFundsSufficient){
res.status(400).json({code:"insufficientFund"})
return;
}
  const resp= await fetch('https://api.flutterwave.com/v3/billers/BIL099/items/AT099/payment', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
    'Content-Type': 'application/json',
    'accept': 'application/json'
  },
  body: JSON.stringify({
    country: 'NG',
    customer_id: Phoneno,
    amount: amount,
    reference: req.user.Email.split("@")[0]+"split"+req.user.Email.split("@")[1].split(".")[0]+"split"+uuidv4(),
    callback_url: 'https://zonapay.onrender.com/webhook'
  })
})
if(resp.ok){
  const resp2= await resp.json();
  console.log(resp2)
  if(resp2.status=="success"){
    const amt=resp2.data.amount
    await User.findByIdAndUpdate(Id, { $inc: { Balance: -amt } },  { new: true } )
    setTimeout( async ()=>{
      const day= DateTime.local().setZone("Africa/Lagos").toFormat("LLLL dd yyyy");

      const found= await Earning.findOne({Date:day});
  if(found){
    console.log("Day found")
    await Earning.updateOne({Date:day},{$inc:{
      Earning:(3/100)*amt,
      Total:amt,
      Airtime:amt,
      Airtime_purchases:1
  }});
    console.log("Earning updated for airtime")

  }
  else{
console.log("Day will now be created")
await Earning.create({
Date:day,
Earning:(3/100)*amt,
Total:amt,
Airtime:amt,
Airtime_purchases:1
})
console.log("Earning updated for airtime for the first time in the day")
  }
  return;
    },2000)
  return res.status(200).json(resp2);
    
  }

  else{
    res.status(400).json(resp2)
  }
}
else{
  const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
  const history={user:req.user.Email,
    tid:undefined,
    time:timeinNigeria,
    amount:amount,
    phone:Phoneno,
    network:nid,
    product:"Airtime",
  status:"failed"}
  saveHistory(history);
  const resp2= await resp.json();
  if(resp2.status==="error"){
    res.status(400).json(resp2)
    }
    else{
      res.status(400).json(resp2) 
    }
}
res.status(400).end()})



//fetch data plans
server.post("/zonapay/fdp", async (req,res)=>{
if(!req.isAuthenticated()){
  res.redirect("/login")
}
const biller=req.body.bille
console.log(biller);
try{
const resp= await fetch(`https://api.flutterwave.com/v3/billers/${biller}/items`,{
  method:"get",
  headers:{"Authorization":`Bearer ${process.env.FLW_SECRET_KEY}`,"Content-Type":"application/json","accept":"application/json"}
});
if(resp.ok){
  const resp1=await resp.json();
  // console.log(resp1)
  res.status(200).json(resp1);
}
else{
  res.status(400).send("failed to fetch plans")
}}
catch(e){
  console.log("data plans fetch failed because "+e)
}
})

// validate user for login
  server.post("/zonapay/valUser",async (req,res)=>{
const {email,password}=req.body;
try{
const detail= await User.findOne({Email:email});
console.log(detail)
if(detail){
  if(!bcrypt.compareSync(password,detail.Password)){
    return res.status(400).send("verificatin failed")
  }
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
res.redirect("/login")
});
  })



//signup a user
const validateInfo=[
  body("Username").toLowerCase()
  .trim() // First trim whitespace
  .escape() // Escape any HTML characters
  .notEmpty().withMessage("Name field Cannot be empty") // Check that it's not empty
  .isLength({ min: 3, max: 10 }).withMessage("Character must be between 3 to 10 characters long")
  ,

// Email Validation
body("Email")
  .trim().toLowerCase()
  .escape()
  .notEmpty().withMessage("Email Cannot be empty")
  .isEmail().withMessage("Please enter a valid email"),

  body('Password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&.,;+-:#=><~"'^_|{}`]/).withMessage('Password must contain at least one special character (e.g., @$!%*?&)'),
]
  server.post("/signup",validateInfo ,async (req,res)=>{
    const errors=validationResult(req);
    console.log(errors.isEmpty())
    console.log(errors)
    if(errors.isEmpty()){
    const {Username,Email,Password}=req.body;
try{
  await createUser(Username,Email,Password);
  sendd("igwebuikea626@gmail.com",`An account has been created ${Email}`)
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
//check if email is alreay existing
server.post("/zonapay/ValEmail", async (req,res)=>{
const val= req.body.val;
try{

const ans = await User.findOne({Email:val});
if(!ans){
  res.status(200).send("Done..")
}
else{
  res.status(400).send("failed")
}}
catch(e){
  res.status(400).send("internet connection error "+e)
}
  })
  const logged=(req,res,next)=>{
if(req.isAuthenticated()){
  return res.redirect("/dashboard");
}
else{
  next();
}
  }

//login for a user
server.post("/login",logged,passport.authenticate("local",{
  failureRedirect:"/signup",
  successRedirect:"/dashboard"
}))
//Data purchase
server.post("/zonapay/data",upload.none() ,async (req,res)=>{
  const {nid,plan,Phoneno,amount,type,billcode,itemcode} =req.body
    console.log(amount)
  console.log(parseInt(amount))
  const Id = mongoose.Types.ObjectId(req.user._id);
const usernow=  await User.findById(Id)
const balance=usernow.Balance
const isFundsSufficient= balance>parseInt(amount)
  if(!isFundsSufficient){
    const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
      const history={user:req.user.Email,
        tid:undefined,
        time:timeinNigeria,
        amount:parseInt(amount),
        phone:Phoneno,
        network:nid,
        product:type,
      status:"failed"}
      saveHistory(history);
  res.status(400).json({code:"insufficientFund"})
  return;
  }
  try{
    const result= await fetch(`https://api.flutterwave.com/v3/billers/${billcode}/items/${itemcode}/payment`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        country: 'NG',
        customer_id: Phoneno,
        amount: parseInt(amount),
        type:type,
        reference: req.user.Email.split("@")[0]+"split"+req.user.Email.split("@")[1].split(".")[0]+"split"+uuidv4(),
        callback_url: 'https://zonapay.onrender.com/webhook'
      })
    })
    const result2= await result.json()
    console.log(result2);
    if(result2.status=="success"){
      const newamount=result2.data.amount;
      await User.findByIdAndUpdate(Id, { $inc: { Balance: -newamount } },  { new: true } );
      setTimeout( async ()=>{
        const day= DateTime.local().setZone("Africa/Lagos").toFormat("LLLL dd yyyy");
  
        const found= await Earning.findOne({Date:day});
    if(found){
      console.log("Day found")
      await Earning.updateOne({Date:day},{$inc:{
        Earning:(3/100)*newamount,
        Total:amt,
      Data:amt,
      Data_purchases:1
      }})
      console.log("Earning updated for data")
    }
    else{
  console.log("Day will now be created")
  await Earning.create({
  Date:day,
  Earning:(3/100)*amt,
  Total:amt,
      Data:amt,
      Data_purchases:1
  })
  console.log("Earning updated for data for the first time in the day")
    }
    return;
      },2000)
      return res.status(200).json(result2);
    }
    else{
      const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
      const history={user:req.user.Email,
        tid:undefined,
        time:timeinNigeria,
        amount:parseInt(amount),
        phone:Phoneno,
        network:nid,
        product:type,
      status:"failed"}
      saveHistory(history);
      sendd("igwebuikea626@gmail.com",result2.message)
      res.status(400).json({message:"Purchase failed",code:""})
    }
    
    }
    catch(e){
    console.log(e+"wronggg")
    res.status(400).json({message:"Check your connection",code:""})
    }
    
      }
)

//Cable tv
server.post("/zonapay/cable",async (req,res)=>{
const {iuc,amount,biller,item}= req.body;
console.log("payload",req.body)
const Id = mongoose.Types.ObjectId(req.user._id);
const usernow=  await User.findById(Id)
const balance=usernow.Balance
const isFundsSufficient= balance>100
  if(!isFundsSufficient){
  res.status(400).json({code:"insufficientFund"})
  return;
  }
  try{
const data=await fetch(`https://api.flutterwave.com/v3/billers/${biller}/items/${item}/payment`,{method:"Post",
body:JSON.stringify({
  country:"NG",
  customer_id:iuc,
  amount:amount,
  reference: req.user.Email.split("@")[0]+"split"+req.user.Email.split("@")[1].split(".")[0]+"split"+uuidv4(),
  callback_url:"https://zonapay.onrender.com/webhook"
}),
headers:{
  "Content-Type":"application/json",
  "Authorization":`Bearer ${process.env.FLW_SECRET_KEY}`,
  "accept":"application/json"
}
})

  if(data.ok){
    const data2= await data.json();
    console.log(data2)
   if(data2.status=="success"){
    const newamount=data2.data.amount;
    await User.findByIdAndUpdate(Id, { $inc: { Balance: -newamount } },  { new: true } );
    setTimeout( async ()=>{
      const day= DateTime.local().setZone("Africa/Lagos").toFormat("LLLL dd yyyy");
      const found= await Earning.findOne({Date:day});
  if(found){
    console.log("Day found")
    await Earning.updateOne({Date:day},{$inc:{
      Earning: -70,
      Total:amt,
      Cable_tv:amt,
     Cabletv_purchases:1
    }})
    console.log("Earning updated for cable tv")

  }
  else{
console.log("Day will now be created")
await Earning.create({
Date:day,
Earning: -70,
Total:amt,
Cable_tv:amt,
Cabletv_purchases:1
})
console.log("Earning updated for cable tv for the first time in the day")

  }
  return;
    },2000)
   return res.status(200).json(data2)}
    else{
      console.log("returned  200 ok response but failed");
    }
  }
  else{
    const now=DateTime.local()
    const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
      const history={user:req.user.Email,
        tid:undefined,
        time:timeinNigeria,
        amount:amount,
        phone:iuc,
        network:"cable",
        product:"Cable tv",
      status:"failed"}
      saveHistory(history);
res.status(400).end();
  }
 }
  catch(e){
console.log(e)
res.status(400).json({message:"check your connection"});
return;
  }
})
//fetch tv plans

server.post("/zonapay/ftp", async (req,res)=>{
const {bille}=req.body;
const result= await fetch(`https://api.flutterwave.com/v3/billers/${bille}/items`,{
  method:"get",
  headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${process.env.FLW_SECRET_KEY}`,
  }
})

if(result.ok){
const result2= await result.json();
res.status(200).json(result2);
}
else{
  res.status(400).end()
}
})

//Electricity
server.post("/zonapay/electricity",async (req,res)=>{
  console.log(req.body)
  const {iuc,provider,amount,kind}=req.body;
  const Id = mongoose.Types.ObjectId(req.user._id);
const usernow=  await User.findById(Id)
const balance=usernow.Balance
const isFundsSufficient= balance>amount
  if(!isFundsSufficient){
    console.log("balance issue")
  res.status(400).json({code:"insufficientFund"})
  return;
  }
  try{
    const resp=await fetch(`https://api.flutterwave.com/v3/billers/${provider}/items/${kind}/payment`,{method:"Post",
    body:JSON.stringify({
      country:"NG",
      customer_id:iuc,
      amount:parseInt(amount),
      reference: req.user.Email.split("@")[0]+"split"+req.user.Email.split("@")[1].split(".")[0]+"split"+uuidv4(),
      callback_url:"https://zonapay.onrender.com/webhook"
    }),
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${process.env.FLW_SECRET_KEY}`,
      "accept":"application/json"
    }
    }) 
     if(resp.ok){
const result=await resp.json();
console.log(result)
if(result.status=="success"){
  // console.log(
  //   `token ${result.data.token} units ${result.data.units} amount ${result.data.amount}`);
  console.log(result);
  const newamount= result.data.amount;
      await User.findByIdAndUpdate(Id, { $inc: { Balance: -newamount } },  { new: true } )
      setTimeout( async ()=>{
        const day= DateTime.local().setZone("Africa/Lagos").toFormat("LLLL dd yyyy");
        const found= await Earning.findOne({Date:day});
    if(found){
      console.log("Day found")
      await Earning.updateOne({Date:day},{$inc:{
        Earning: -70,
        Total:amt,
      Electricity:amt,
      Electricity_purchases:1
      }})
      console.log("Earning updated for electricity")
    }
    else{
  console.log("Day will now be created")
  await Earning.create({
  Date:day,
  Earning: -70,
  Total:amt,
      Electricity:amt,
      Electricity_purchases:1
  })
  console.log("Earning updated for the first time in the day")
    }
    return;
      },2000)
 return res.status(200).json(result);
}

else{
  console.log(result.code);
  res.status(400).send("purchase failed")
}
  }
  else{
    const now=DateTime.local()
    const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
      const history={user:req.user.Email,
        tid:undefined,
        time:timeinNigeria,
        amount:parseInt(amount),
        phone:iuc,
        network:"",
        product:"Electricity",
      status:"failed"}
      saveHistory(history);
      console.log("else",resp)
res.status(400).end();  }
}
  catch(e){
return res.status(400).send("conerror  : "+e)
  }
})
//fetching electricity billers
server.post("/zonapay/elects",async (req,res)=>{
const resp= await fetch("https://api.flutterwave.com/v3/bills/UTILITYBILLS/billers?country=NG",{
  method:"GET",headers:{
  "Content-Type":"application/json",
  "Authorization":`Bearer ${process.env.FLW_SECRET_KEY}`}
})
if(resp.ok){
  res.status(200).json(await resp.json())
}
else{
  res.status(400).send("failed")
}
})
//fetch electricity biller item code
server.post("/zonapay/eitemcode",async (req,res)=>{
  try{
const {data}= req.body
const resp= await fetch(`https://api.flutterwave.com/v3/billers/${data}/items`,{
  method:"GET",headers:{
  "Content-Type":"application/json",
  "Authorization":`Bearer ${process.env.FLW_SECRET_KEY}`}
})
if(resp.ok){
  const final=await resp.json();
  res.status(200).json(final);
}
else{
  res.status(400).send("failed");
}}
catch(e){
  res.status(400).send(e)
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
server.post("/done",cors(),async (req,res)=>{
  console.log("done path has been entered")

  // Here req.body.data is ued to check requests coming from outside Billsly frontend
  // console.log(req);
//check if request came from a webhook
  if(req.body.data&&!req.isAuthenticated()){
    console.log("request came from a webhook flutterwave to be supposed")
  if((req.headers["verif-hash"]!=="ariwa"||!req.headers["verif-hash"])){
    console.log("correct header was not passed");
    return res.status(200).end()
  }}
  //handle failed transactions
  if(req.body.data&&!req.isAuthenticated()){
  if(req.body.data.status!="successful"){
    sendd("igwebuikea626@gmail.com",`This top up txn failed for ${req.body.data.customer.email}`)
return res.status(200).end()
  }}
  else{
    if(!req.isAuthenticated()){
      return res.end()}
  }
  let userEmail;
      userEmail= (req.isAuthenticated())? req.user.Email : req.body.data.customer.email
  let tx_ref;
  let transaction_id;
  let usernow;
  if(!req.isAuthenticated()){
   usernow=await User.findOne({Email:req.body.data.customer.email})}
   console.log("USERPASSPORT",usernow)
  const Id = (req.isAuthenticated())? mongoose.Types.ObjectId(req.user._id): usernow._id;
  console.log(Id)
  if(req.body.data&&!req.isAuthenticated()){
    tx_ref=req.body.data.tx_ref;
    transaction_id= req.body.data.id;
  }else{
   tx_ref=req.body.tx_ref;
 transaction_id= req.body.transaction_id;}
  console.log(tx_ref)
  //check if id has been verified before.
  let flidObj;
  flidObj=await Flid.findOne({Customer:userEmail})
  if(!flidObj){
    await Flid.create({
      Customer:userEmail,
      Ids:[]
  })
  }
  flidObj=await Flid.findOne({Customer:userEmail})
  if(flidObj.Ids.includes(transaction_id)){
    console.log("This transaction has already been settled")
    sendd("igwebuikea626@gmail.com","An already verified txn_id  attempted to be verified")
   return  res.status(500).json({message:"this transaction has alrady been settled"})
  }
  console.log(transaction_id)
    try{
      await vet(tx_ref,transaction_id,Id,userEmail)
  res.status(200).json({message:"Payment successfull"})
  }
  catch(e){
console.log("Error caught...")
    res.status(500).json({message:"payment failed..."})
  } 
  
})

//changing pin/password

let otps=[]
server.post("/change",async (req,res)=>{
  console.log(req.body);
const otp_matcher= otp();
otps.push(otp_matcher);
const msg=` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Password</title>
    <style>
        /* Base styles */
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }
        
        /* Container */
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        /* Header */
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
        }
        
        /* OTP Box */
        .otp-box {
            background-color: #f5f9ff;
            border: 1px dashed #4a90e2;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #2c7be5;
            letter-spacing: 3px;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
            margin-top: 20px;
        }
        
        /* Security Notice */
        .security {
            background-color: #fff8f8;
            border-left: 4px solid #ff6b6b;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Your One-Time Password</h2>
        </div>
        
        <p>Hello,</p>
        
        <p>Your one-time password (OTP) for authentication is:</p>
        
        <div class="otp-box">
            ${otp_matcher}
        </div>
        
        <p>This code will expire in <strong>5 minutes</strong>. Please do not share it with anyone.</p>
        
        <div class="security">
            <strong>Security notice:</strong> Our team will never ask for this code. Do not share it with anyone, as it could give them access to your account.
        </div>
        
        <p>If you didn't request this code, please secure your account immediately by changing your password.</p>
        
        <p>Best regards,<br>
        The Security Team</p>
        
        <div class="footer">
            <p>© 2025 Your Company Name. All rights reserved.</p>
            <p>N0 24 nwogbo nkwomma lane Awka</p>
            <p>
                <a href="https://zonapay.onrender.com/#privacy" style="color: #4a90e2;">Privacy Policy</a> | 
                <a href="https://zonapay.onrender.com/#contact" style="color: #4a90e2;">Contact Us</a>
            </p>
        </div>
    </div>
</body>
</html>`
// sendd("arize1524@gmail.com",req.body.email)
sendd(req.body.email,undefined,msg)
setTimeout(()=>{
  delete otps[otps.indexOf(otp_matcher)];
  otps=otps.filter((ele)=>ele!==undefined)

},300000);
res.end()

})
server.post("/change2",cors(),async (req,res)=>{
  console.log(req.body);
  const newpass=req.body.newpass;
const otp=req.body.otp;
const newpin=req.body.newpin
if(newpin){
  if(!req.isAuthenticated()){
res.redirect("/login");
  }
}
if(newpass){
  try{
if(otps.includes(otp)){
const found=await User.updateOne({Email:(req.isAuthenticated())? req.user.Email:req.body.email},{$set:{Password:bcrypt.hashSync(newpass,10)}},{upsert:false})
if(!found.acknowledged){
  throw new Error("User not found");
}
console.log("password changed")
res.status(200).end();
}
else{
  console.log("failed to equate to otp password");
  res.status(400).end();

}
}
catch(e){
  console.log("e...."+e)
res.status(400).end();
}
}

else{
  try{
  if(otps.includes(otp)){
  const found=await User.updateOne({Email:req.user.Email},{$set:{Pin:bcrypt.hashSync(newpin,10)}},{upsert:false})
  if(!found.acknowledged){
    throw new Error("User not found");
  }
  console.log("pin changed")
  res.status(200).end();
  }else{
    console.log("failed to equate to otp pin")
    res.status(400).end();
  }
  }
  catch(e){
    console.log("e...."+e)
  res.status(400).end();
  }}
}
)

server.post("/webhook",cors(), async (req,res)=>{
// await verif(req.body.data.tx_ref)
console.log("THIS IS THE USER",req.user)
const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
const obj=req.body.data 
console.log("webhook",obj)
if(obj.status=="success"){
try{ 
sendd("arize1524@gmail.com",` ${obj.customer} has successfully purchased ${obj.network} of ${obj.amount}`);
const init_user=obj.customer_reference.split("split")[0]+"@"+obj.customer_reference.split("split")[1]+".com"
const history={user:init_user,
  tid:obj.flw_ref,
  time:timeinNigeria,
  amount:obj.amount,
  phone:obj.customer,
  network:obj.network,
  product:obj.network,
status:obj.status}
saveHistory(history);
console.log(req.body)}
catch(e){
  sendd("arize1524@gmail.com",e)
}}
res.status(200).end()
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
