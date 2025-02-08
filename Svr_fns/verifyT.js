// @ts-nocheck
require("dotenv").config();
const Flutterwave = require('flutterwave-node-v3');
const sendd = require("../flib/mailsender");
const { User } = require("./createuser");

async function vet(ref,transactionId,ID,user){
    console.log(transactionId)
console.log(ref);
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
  try{
    console.log(transactionId)
console.log(ref);
    const response= await flw.Transaction.verify({ id: transactionId });
    console.log(response)
        if (
            response.data.status === "successful"
            && response.data.currency === "NGN"
            &&response.data.tx_ref===ref) {
                await User.findByIdAndUpdate(ID, { $inc: { Balance: response.data.amount } },  { new: true } ).catch(e=>console.log(e))
console.log(`FUNDING WAS SUCCESSFULL.... ${ref} ${transactionId}`);
sendd("igwebuikea626@gmail.com",`${response.data.amount} has been deposited by ${user} at ${response.data.created_at} `)

        } else {
            sendd("igwebuikea626@gmail.com","FUNDING OF YOUR ZONAPAY WALLET FAILED")
        }}
        catch(e){
            console.log(" A verification error occured"+e)
        }
    
   
}
module.exports= vet