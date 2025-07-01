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
const { Otpmodel } = require("./Svr_fns/otps");
const cron= require("node-cron");
const Schedule = require("./Svr_fns/schedule");
const logout = require("./Svr_fns/logout");
const { addNote } = require("./Svr_fns/Note");
const bill = require("./Svr_fns/bill");
const CryptoJs=require("crypto-js");
const { emailHash, emailHashRvsl } = require("./flib/emailhash");
mongoose.set("strictQuery",false)
//DB CONNECTION

mongoose.connect(process.env.DATABASEURL , { useNewUrlParser: true, useUnifiedTopology: true,connectTimeoutMS: 50000,serverSelectionTimeoutMS:20000,socketTimeoutMS:45000 })
.then(() => {console.log('MongoDB connected successfully');
loadScheduledBills().then(()=>{  console.log("Scheduled bills have been loaded successfully")
}).catch(err=> console.error("failed to load scheduled bills",err));
})
.catch(err => console.error('MongoDB connection error:', err));

// /**
//  * Converts a date string to a cron expression in UTC timezone
//  * @param {string} dateString - Date string (e.g., 'Fri, 27 Jun 2025 11:39:50 GMT')
//  * @returns {string} - Cron expression string in UTC
//    **/
 function convertToCronExpression(dateString) {
  const date = new Date(dateString);
  // Convert to UTC components
  const seconds = '0'; // Cron typically starts with seconds (0)
  const minutes = date.getUTCMinutes();
  const hours = date.getUTCHours();
  const dayOfMonth = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Months are 0-indexed in JS
  const dayOfWeek = date.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
  
  // Return as space-separated UTC-based string
  return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

async function loadScheduledBills(){
  const bills= await Schedule.find();
  for(ScheduledDoc of bills){
    cron.schedule(convertToCronExpression(ScheduledDoc.Time), async ()=>{bill(ScheduledDoc)})
  }
  
}

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
    .isInt({ min: 100, max: 1000000 }).withMessage("Amount must be between 100 to 1000000"),

  // Phone Validation
  body("phone")
    .trim()
    .escape()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^(070|080|081|090|091|093)[0-9]{8}$/).withMessage('Invalid Nigerian phone number')
    .isLength({ min: 11, max: 11 }).withMessage('Phone number must be 11 digits long'),
];


//Scheduling bills
server.post("/schedule",cors(),async (req,res)=>{
  if(!req.isAuthenticated()){
    res.redirect("/login");
  }
  console.log("ready to schedule.",req.body)
  const {billcode,itemcode,customer,amt,billtype,time,id,nid,repeat}= req.body;
  try{
  //save to db
  await Schedule.create({
User:req.user.Email,
Idd:id,
Bill:billtype,
Nid:nid,
Time:time,
Type:"",
Details:{
  biller_code:billcode,
  item_code:itemcode,
  customer:customer,
  amount:amt
},
Status: (repeat=="on")?"continue" :"not completed"
  })
  //get it by idd and then load it
  const ScheduledDoc=await Schedule.findOne({Idd:id})
  console.log("sobj found",ScheduledDoc)
  console.log(convertToCronExpression(ScheduledDoc.Time))
  cron.schedule(convertToCronExpression(ScheduledDoc.Time), async ()=>{bill(ScheduledDoc)});
  console.log("scheduled")
  const bill_schedule_msg=`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Scheduled Bill Payment Confirmation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            margin: 20px auto;
            overflow: hidden;
        }
        .header {
            background-color: #ffffff;
            color: #0056b3;
            padding: 25px 20px;
            text-align: center;
            border-bottom: 1px solid #e0e0e0;
        }
        .content {
            padding: 25px 20px;
            background-color: #ffffff;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #ffffff;
        }
        .details-table th {
            background-color: #f8f8f8;
            text-align: left;
            padding: 12px 15px;
            width: 35%;
            font-weight: normal;
            border: 1px solid #e0e0e0;
        }
        .details-table td {
            padding: 12px 15px;
            border: 1px solid #e0e0e0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
            text-align: center;
            padding: 15px;
            background-color: #f8f8f8;
            border-top: 1px solid #e0e0e0;
        }
        .highlight {
            font-weight: bold;
            color: #0056b3;
        }
        .logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Add your logo here if needed -->
             <img src="https://billsly.co/cicon24.png" alt="Company Logo" class="logo"> -->
            <h2>Scheduled Bill Payment Confirmation</h2>
        </div>
        
        <div class="content">
            <p>Dear <span class="highlight">${req.user.Username}</span>,</p>
            
            <p>Your bill payment has been successfully scheduled. Below are the details:</p>
            
            <table class="details-table">
                <tr>
                    <th>Bill Type:</th>
                    <td>${ScheduledDoc.Bill}</td>
                </tr>
                <tr>
                    <th>Customer:</th>
                    <td>${ScheduledDoc.Details.customer}</td>
                </tr>
                <tr>
                    <th>Amount:</th>
                    <td class="highlight">${ScheduledDoc.Details.amount}</td>
                </tr>
                <tr>
                    <th>Scheduled Date:</th>
                    <td>${new Date(ScheduledDoc.Details.time).toLocaleString("en-US",{timeZone:"Africa/Lagos",month:"long",day:"numeric",year:"numeric"})}</td>
                </tr>
                <tr>
                    <th>Scheduled Time:</th>
                    <td>${new Date(ScheduledDoc.Details.time).toLocaleString("en-US",{timeZone:"Africa/Lagos"}).split(",")[1] }</td>
                </tr>
                
                <tr>
                    <th>Network/Provider:</th>
                    <td>${ScheduledDoc.Nid}</td>
                </tr>
                <tr>
                    <th>Reference code:</th>
                    <td>${ScheduledDoc.Idd}</td>
                </tr>
            </table>
            
            <p>This payment will be processed automatically at the scheduled time. Please ensure your account has sufficient funds.</p>
            
            <p><strong>Important:</strong> If you did not authorize this payment, please contact our support team immediately.</p>
        </div>
        
        <div class="footer">
            <p>©  ${DateTime.local().setZone("Africa/Lagos").toFormat("yyyy")} Billsly. All rights reserved.</p>
            <p>Awka Anambra State Nigeria</p>
            <p>Contact us: support@billsly.co | 08166041953</p>
        </div>
    </div>
</body>
</html>`
  sendd(req.user.Email,undefined,bill_schedule_msg,"Bill Scheduled")
  res.status(200).json({message:"successful",time:new Date()})}
  catch(e){
    console.log("schedule failed ",e)
    res.status(400).json({message:"failed"})
  }
})

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

    try{
     console.log("header val",req.headers["passid"])
    if(!req.isAuthenticated()&&req.headers["passid"]!=="ariwa"){
      console.log("redirected to signup")
      res.redirect("/signup")
      return;
    }
     
  
const {nid,amount,Phoneno,user} = (req.headers["passid"]=="ariwa")? req.body.data : req.body;
console.log(req.body)
let device= null
if(req.headers["passid"]=="ariwa"){
  console.log("from schedule",user)
  device=await User.findOne({Email:user})
  }
console.log("device is ",device)
const altid=device?._id
console.log("altid",altid)
const Id = (req.headers["passid"]=="ariwa")? altid: mongoose.Types.ObjectId(req.user._id) ;
console.log("userfound",Id)
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
    reference:(req.user)? emailHash(req.user.Email)+"--"+uuidv4() :emailHash(user)+"--"+uuidv4(),
    callback_url: 'https://www.billsly.co/webhookb'
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
   res.status(200).json(resp2);
    
  }

  else{
    res.status(400).json(resp2)
  }
}
else{
  const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
  const history={user:(req.user)? req.user.Email:user,
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
res.status(400).end()

}
catch(e){
  console.log("error on airtime",e)
}})



//fetch data plans
server.post("/zonapay/fdp", async (req,res)=>{
if(!req.isAuthenticated()){
  return res.redirect("/login")
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
 return  res.status(200).json(resp1);
}
else{
  res.status(400).json({status:"failed",message:"failed to load data plans"})
}}
catch(e){
  console.log("data plans fetch failed because "+e)
}
})

server.get("/autologout/:id",async(req,res)=>{
  try{
    console.log("req params is",req.params)
await logout(req.params.id)
return res.status(200).send("successfully logged out")}
catch(e){
 return res.status(400).send("logout was not successfull")
}
})
// validate user for login
  server.post("/zonapay/valUser",async (req,res)=>{
const {email,password}=req.body;
try{
const detail= await User.findOne({Email:email});
//This logs a user found
// console.log(detail);
const message=`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login Notification</title>
    <style type="text/css">
        /* Client-specific styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Reset styles */
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
        
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        
        /* Main styles */
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #333333;
            background-color: #f4f4f4;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            padding: 20px 0;
        }
        
        .logo {
            max-width: 150px;
            height: auto;
        }
        
        .content {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #999999;
        }
        
        .button {
            background-color: #007bff;
            color: #ffffff !important;
            display: inline-block;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 15px 0;
        }
        
        .info-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
        }
        
        .info-table td {
            padding: 10px;
            border-bottom: 1px solid #eeeeee;
        }
        
        .info-table td:first-child {
            font-weight: bold;
            width: 30%;
        }
        
        .alert {
            background-color: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Replace with your logo -->
            <img src="https://www.billsly.co/cicon192.png" alt="Company Logo" class="logo" />
        </div>
        
        <div class="content">
            <h1>New Login Detected</h1>
            <p>Hello,</p>
            <p>We noticed a recent login to your account. Here are the details:</p>
            
            <table class="info-table">
                <tr>
                    <td>Date & Time:</td>
                    <td>${DateTime.local().setZone("Africa/Lagos").toFormat("dd LLL, hh:mm a")}</td>
                </tr>
                <tr>
                    <td>Device:</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Browser:</td>
                    <td>[Browser Type]</td>
                </tr>
                <tr>
                    <td>Location:</td>
                    <td>[Approximate Location] (IP: [IP Address])</td>
                </tr>
            </table>
            
            <div class="alert">
                <strong>Was this you?</strong> If you recognize this activity, you can ignore this message. If not, please secure your account immediately.
            </div>
            
            <p>
                <a href="https://www.billsly.co/autologout/${email}" class="button">Logout</a>
            </p>
            
            <p>For your security, we recommend:</p>
            <ul>
                <li>Using a strong, unique password</li>
                <li>Enabling two-factor authentication</li>
                <li>Updating your password regularly</li>
            </ul>
            
            <p>If you have any questions or concerns, please contact our support team.</p>
            
            <p>Thanks,<br />[Billsly] Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; ${DateTime.local().setZone("Africa/Lagos").toFormat("yyyy")} [Billsly]. All rights reserved.</p>
            <p>
                [Company Address] | <a href="[Privacy Policy Link]">Privacy Policy</a> | <a href="[Terms of Service Link]">Terms of Service</a>
            </p>
            
        </div>
    </div>
</body>

</html>`
if(detail){
  if(!bcrypt.compareSync(password,detail.Password)){
    return res.status(400).send("verificatin failed")
  }
  sendd(email,undefined,message,"Login detected");
  console.log("verified..");
  return res.status(200).send("verified");
}
else{
  console.log("Not verified")
  return res.status(400).send("verification failed")
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

  server.post("/zonapay/logout2",(req,res,next)=>{
    req.logout((err)=>{
    if(err){
      next(err);
    }
    res.status(200).end()
    });
      })

  server.delete("/delete-account", async (req,res)=>{
    console.log("delete path entered")
    try{
if(!req.isAuthenticated()){
  return res.status(400).end()
}
else{
  const found= await User.deleteOne({Email:req.user.Email})
  console.log("Deleted User",found)
return res.status(200).end();
}}
catch(e){
  console.log("This error occured while deleting user",e)
}
      })
      //welcome email 
      const getWelcomeEmail = (user) => {
        const date = DateTime.local().setZone("Africa/Lagos").toFormat("LLL dd yyyy hh:mm a");
        const year = DateTime.local().setZone("Africa/Lagos").toFormat("yyyy");
      
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Your Billsly Account Has Been Created</title>
          <style type="text/css">
              /* Client-specific styles */
              body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
              
              /* Main styles */
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
              }
              
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              
              .header {
                  text-align: center;
                  padding: 20px 0;
                  border-bottom: 1px solid #eaeaea;
              }
              
              .logo {
                  max-width: 150px;
                  height: auto;
              }
              
              .content {
                  padding: 30px 20px;
              }
              
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #2563eb;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: 600;
                  margin: 20px 0;
              }
              
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #666666;
                  border-top: 1px solid #eaeaea;
              }
              
              /* Responsive styles */
              @media screen and (max-width: 600px) {
                  .email-container {
                      width: 100% !important;
                  }
              }
          </style>
      </head>
      <body style="margin: 0; padding: 0;">
          <!-- Email container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                  <td align="center" style="padding: 20px 0;">
                      <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
                          <!-- Header -->
                          <tr>
                              <td class="header">
                                  <img src="https://www.billsly.co/cicon192.png" alt="Billsly Logo" class="logo" width="150" style="display: block; margin: 0 auto;" />
                              </td>
                          </tr>
                          
                          <!-- Content -->
                          <tr>
                              <td class="content">
                                  <h1 style="margin-top: 0;">Welcome to Billsly!</h1>
                                  <p>Your account has been successfully created. We're excited to have you on board!</p>
                                  
                                  <p>Here are your account details:</p>
                                  <ul style="padding-left: 20px; margin: 10px 0;">
                                      <li><strong>Email:</strong> ${user.Email}</li>
                                      <li><strong>Created On:</strong> ${date}</li>
                                  </ul>
                                  
                                  <div style="text-align: center; margin: 25px 0;">
                                      <a href="https://www.billsly.co/login" class="button" style="color: #ffffff;">Login to Your Account</a>
                                  </div>
                                  
                                  <p>If you didn't create this account, please <a href="https://x.com/Zona_it_is" style="color: #2563eb;">contact our support team</a> immediately.</p>
                                  
                                  <p>Best regards,<br>The Billsly Team</p>
                              </td>
                          </tr>
                          
                          <!-- Footer -->
                          <tr>
                              <td class="footer">
                                  <p>© ${year} Billsly. All rights reserved.</p>
                                  <p>
                                      <a href="mailto:support@billsly.co" style="color: #666666; text-decoration: none;">support@billsly.co</a> | 
                                      <a href="https://www.billsly.com/privacy" style="color: #666666; text-decoration: none;">Privacy Policy</a> | 
                                      <a href="https://www.billsly.com/terms" style="color: #666666; text-decoration: none;">Terms of Service</a>
                                  </p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>`;
      };
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
    const message=getWelcomeEmail({Email})
try{
  await createUser(Username,Email,Password);
  sendd("igwebuikea626@gmail.com",`An account has been created ${Email}`,undefined,"Account Creation")
sendd(Email,undefined,message,"Account Creation")
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
  if(!req.isAuthenticated()&&req.headers["passid"]!=="ariwa"){
    res.redirect("/signup")
    return;
  }
  const {nid,plan,Phoneno,amount,type,billcode,itemcode,user}= (req.headers["passid"]=="ariwa")? req.body.data : req.body
    console.log(amount)
  console.log(parseInt(amount))
  let device= null
if(req.headers["passid"]=="ariwa"){
  device=await User.findOne({Email:user})
  }
console.log("device is ",device)
const altid=device?._id
console.log("altid",altid)
const Id = (req.headers["passid"]=="ariwa")? altid:mongoose.Types.ObjectId(req.user._id)  ;
console.log("userfound",Id)
  const usernow=  await User.findById(Id)
const balance=usernow.Balance
const isFundsSufficient= balance>parseInt(amount)
  if(!isFundsSufficient){
    const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
      const history={user:(req.user)?req.user.Email:user,
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
        reference:(req.user)? emailHash(req.user.Email)+"--"+uuidv4() :emailHash(user)+"--"+uuidv4(),
        callback_url: 'https://www.billsly.co/webhookb'
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
        Total:newamount,
      Data:newamount,
      Data_purchases:1
      }})
      console.log("Earning updated for data")
    }
    else{
  console.log("Day will now be created")
  await Earning.create({
  Date:day,
  Earning:(3/100)*newamount,
  Total:newamount,
      Data:newamount,
      Data_purchases:1
  })
  console.log("Earning updated for data for the first time in the day")
    }
    return;
      },2000)
       res.status(200).json(result2);
    }
    else{
      const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
      const history={user:(req.user)?req.user.Email:user,
        tid:undefined,
        time:timeinNigeria,
        amount:parseInt(amount),
        phone:Phoneno,
        network:nid,
        product:type,
      status:"failed"}
      saveHistory(history);
      sendd("igwebuikea626@gmail.com",result2.message,undefined,"Failed payment")
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
  if(!req.isAuthenticated()&&req.headers["passid"]!=="ariwa"){
    res.redirect("/signup")
    return;
  }
const {iuc,amount,biller,item,user}= (req.headers["passid"]=="ariwa")? req.body.data : req.body;
console.log("payload",req.body)
let device= null
if(req.headers["passid"]=="ariwa"){
  device=await User.findOne({Email:user})
  }
console.log("device is ",device)
const altid=device?._id
console.log("altid",altid)
const Id = (req.headers["passid"]=="ariwa")? altid : mongoose.Types.ObjectId(req.user._id) ;
console.log("userfound",Id)
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
  reference:(req.user)? emailHash(req.user.Email)+"--"+uuidv4() :emailHash(user)+"--"+uuidv4(),
  callback_url:"https://www.billsly.co/webhookb"
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
      Total:newamount,
      Cable_tv:newamount,
     Cabletv_purchases:1
    }})
    console.log("Earning updated for cable tv")

  }
  else{
console.log("Day will now be created")
await Earning.create({
Date:day,
Earning: -70,
Total:newamount,
Cable_tv:newamount,
Cabletv_purchases:1
})
console.log("Earning updated for cable tv for the first time in the day")

  }
  return;
    },2000)
   res.status(200).json(data2)}
    else{
      console.log("returned  200 ok response but failed");
    }
  }
  else{
    const now=DateTime.local()
    const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
      const history={user:(req.user)?req.user.Email:user,
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
  if(!req.isAuthenticated()&&req.headers["passid"]!=="ariwa"){
    res.redirect("/signup")
    return;
  }
  console.log(req.body)
  const {iuc,provider,amount,kind,user}=(req.headers["passid"]=="ariwa")? req.body.data : req.body;
  let device= null
if(req.headers["passid"]=="ariwa"){
  device=await User.findOne({Email:user})
  }
console.log("device is ",device)
const altid=device?._id
console.log("altid",altid)
const Id = (req.headers["passid"]=="ariwa")? altid :  mongoose.Types.ObjectId(req.user._id) ;
console.log("userfound",Id)
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
      amount:parseInt(amount)-100,
      reference:(req.user)? emailHash(req.user.Email)+"--"+uuidv4() :emailHash(user)+"--"+uuidv4(),
      callback_url:"https://www.billsly.co/webhookb"
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
      await User.findByIdAndUpdate(Id, { $inc: { Balance: -newamount-100 } },  { new: true } )
      setTimeout( async ()=>{
        const day= DateTime.local().setZone("Africa/Lagos").toFormat("LLLL dd yyyy");
        const found= await Earning.findOne({Date:day});
    if(found){
      console.log("Day found")
      await Earning.updateOne({Date:day},{$inc:{
        Earning: 30,
        Total:newamount,
      Electricity:newamount+100,
      Electricity_purchases:1
      }})
      console.log("Earning updated for electricity")
    }
    else{
  console.log("Day will now be created")
  await Earning.create({
  Date:day,
  Earning: 30,
  Total:newamount,
      Electricity:newamount+100,
      Electricity_purchases:1
  })
  console.log("Earning updated for the first time in the day")
    }
    return;
      },2000)
  res.status(200).json(result);
}

else{
  console.log(result.code);
  res.status(400).send("purchase failed")
}
  }
  else{
    const now=DateTime.local()
    const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
      const history={user:(req.user)?req.user.Email:user,
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
  console.log(req.headers["user-agent"]);
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
//send email  massively
server.post("/sendNote", async (req,res)=>{
  console.log("req body",req.body)
  const {val}=req.body
console.log("Value is ",val)
  console.log("email notification path entered")
  if(!req.isAuthenticated()){
    res.redirect("/login")
  }
  if(!req.user.Admin){
    console.log("A nonAdmin tried to visit the admin page")
    return res.status(200).end()
  }
  try{
await addNote(val)
const email1 =await User.find()
const emails=email1.map((a)=>a.Email)
emails.forEach((a)=>{
  sendd(a,val,undefined,"Notification");
})

res.status(200).end()}
catch(e){
  res.status(400).end()
}


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
    sendd("igwebuikea626@gmail.com",`This top up txn failed for ${req.body.data.customer.email}`,undefined,"Top-up Failure")
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
  console.log(userEmail+" "+"history id has been created")
  }
  flidObj=await Flid.findOne({Customer:userEmail})
  if(flidObj.Ids.includes(transaction_id)){
    console.log("This transaction has already been settled")
    sendd("igwebuikea626@gmail.com","An already verified txn_id  attempted to be verified",undefined,"Duplicate pay-ver alert")
   return  res.status(200).json({message:"this transaction has alrady been settled"})
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
server.post("/change",async (req,res)=>{
  console.log(req.body);
const otp_matcher= otp();
await Otpmodel.deleteOne({Email:req.body.email});
//save otp to database;\
try{
await Otpmodel.create({
  Email:req.body.email,
  Otp:otp_matcher
})}
catch(e){
return res.end()
}
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
                <a href="https://www.billsly.co/#privacy" style="color: #4a90e2;">Privacy Policy</a> | 
                <a href="https://www.billsly.co/#contact" style="color: #4a90e2;">Contact Us</a>
            </p>
        </div>
    </div>
</body>
</html>`
// sendd("arize1524@gmail.com",req.body.email)
sendd(req.body.email,undefined,msg,"Verify OTP")
setTimeout(async ()=>{
   await Otpmodel.deleteOne({Otp:otp_matcher})
},300000);
res.end()
})
server.post("/verifyEmail",async (req,res)=>{
  console.log("verification has started")
  const {rotp}=req.body;
const otps= await Otpmodel.find()
const otp=otps.filter((a)=>a.Otp===rotp)
if(otp.length>0){
return res.status(200).json({message:"Email verified"})
}
else{
  res.status(400).end()
}
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
  const current_user=(req.isAuthenticated())? req.user.Email:req.body.email
  try{
   const exist =await Otpmodel.findOne({Email:current_user});
if(exist&&exist.Otp===otp){
const found=await User.updateOne({Email:(req.isAuthenticated())? req.user.Email:req.body.email},{$set:{Password:bcrypt.hashSync(newpass,10)}},{upsert:false})
await Otpmodel.deleteOne({Otp:otp});
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
  const current_user=req.user.Email;
  try{
    const exist= await Otpmodel.findOne({Email:current_user});
  if(exist&&exist.Otp===otp){
  const found=await User.updateOne({Email:req.user.Email},{$set:{Pin:bcrypt.hashSync(newpin,10)}},{upsert:false});
  await Otpmodel.deleteOne({Otp:otp});
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

server.post("/webhookb", async (req,res)=>{
// await verif(req.body.data.tx_ref)
console.log("THIS IS THE USER",req.user)
const now=DateTime.local()
const timeinNigeria=now.setZone("Africa/Lagos").toFormat('LLLL dd, yyyy hh:mm a')
const obj=req.body.data 
console.log("webhook",obj)
if(obj.status=="success"){
try{ 
sendd("arize1524@gmail.com",` ${obj.customer} has successfully purchased ${obj.network} of ${obj.amount}`,undefined,"Bill success Alert");
const init_user=emailHashRvsl(obj.customer_reference.split("--")[0])
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
  sendd("arize1524@gmail.com",e,undefined,"webhook failure")
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
