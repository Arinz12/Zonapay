require("dotenv").config()
const flutterwave= require("flutterwave-node-v3");
const sendd = require("../flib/mailsender");
const flw= new flutterwave(process.env.FLW_PUBLIC_KEY,process.env.FLW_SECRET_KEY)

async function verif(tx){
    const res=await flw.Transaction.verify({tx_ref:tx});
    console.log(res.data);
    if(res.data.status="successful"){
console.log("Bill payment success")
sendd("arize1524@gmail.com",`Payment was sucessful ${res.data}`,undefined,"Bill success")    
}
    else{
        console.log("Bill payment failed")
    }
}

module.exports={verif}