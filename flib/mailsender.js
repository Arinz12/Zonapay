//email algorithm
// Import Nodemailer
require("dotenv").config()
function sendd(emaill,messagee,htmll){
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP server hostname
  port: 465, // Replace with the appropriate port number
  secure: true, // false for TLS - as a boolean not string - but the default is false so just remove this completely
  auth: {
    type:'Login' ,
    user: 'arizegift1432@gmail.com', // Replace with your email address
    pass: process.env.PASS // Replace with your email password or app-specific password
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

// Define email options
if (messagee==undefined){
  let mailOptions = {
    from: 'arizegift1432@gmail.com', // Sender address
    to: emaill, // List of recipients
    subject: 'ZONA ENTERPRISE', // Subject line
    html: htmll, // Plain text body
  };
}else{
  let mailOptions = {
    from: 'arizegift1432@gmail.com', // Sender address
    to: emaill, // List of recipients
    subject: 'ZONA ENTERPRISE', // Subject line
    text: messagee, // Plain text body
  };
}

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error occurred:', error.message);
    return;
  }
  console.log('Email sent successfully!');
  console.log('Message ID:', info.messageId);
});
}
module.exports= sendd