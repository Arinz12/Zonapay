require("dotenv").config()
function sendd(emaill,messagee,htmll,sub){
  const nodemailer = require('nodemailer');
  
  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com', // Replace with your SMTP server hostname
    port: 465, // Replace with the appropriate port number
    secure: true, // false for TLS - as a boolean not string - but the default is false so just remove this completely
    auth: {
      type:'Login' ,
      user: 'support@billsly.co', // Replace with your email address
      pass: process.env.PASS
       // Replace with your email password or app-specific password
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  let mailOptions ;
  // Define email options
  if (messagee==undefined){
    mailOptions = {
      from: '"Billsly" support@billsly.co', // Sender address
      to: emaill, // List of recipients
      subject: sub, // Subject line
      html: htmll, // Plain text body
    };
  }else{
     mailOptions = {
      from: '"Billsly support" support@billsly.co', // Sender address
      to: emaill, // List of recipients
      subject: sub, // Subject line
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