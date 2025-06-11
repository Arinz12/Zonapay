// @ts-nocheck
require("dotenv").config();
const Flutterwave = require('flutterwave-node-v3');
const { DateTime } = require("luxon");
const sendd = require("../flib/mailsender");
const { User } = require("./createuser");
const { Earning } = require("./Dailyearn");
const { updateFlid } = require("./FlutterwaveIds");

async function vet(ref, transactionId, ID, user) {
    // Validate input parameters
    if (!ref || !transactionId || !ID || !user) {
        console.error('Missing required parameters:', { ref, transactionId, ID, user });
        throw new Error('Invalid parameters for transaction verification');
    }

    console.log('Starting verification for:', { transactionId, ref, user });

    const flw = new Flutterwave(
        process.env.FLW_PUBLIC_KEY, 
        process.env.FLW_SECRET_KEY
    );

    try {
        // Verify transaction with Flutterwave
        const response = await flw.Transaction.verify({ id: transactionId });
        console.log('Verification response:', response);

        // Validate transaction
        if (response.data.status === "successful" &&
            response.data.currency === "NGN" &&
            response.data.tx_ref === ref &&
            response.data.customer.email===user) {
              
            // Update user balance
            const updatedUser = await User.findByIdAndUpdate(
                ID, 
                { $inc: { Balance: response.data.amount } },
                { new: true, runValidators: true }
            ).exec();

            if (!updatedUser) {
                throw new Error('User not found');
            }
          await  updateFlid(updatedUser.Email,transactionId);
          const day=DateTime.local().setZone("Africa/Lagos").toFormat("LLLL dd yyyy");
const found=await Earning.findOne({Date:day});
if (found){
    await Earning.updateOne({Date:day},{$inc:{Earning:(response.data.amount_settled-response.data.amount)}})
    console.log("Earning updated due to funding fees");
}
else{
    await Earning.create({
        Date:day,
        Earning:(response.data.amount_settled-response.data.amount)
    })
    console.log("Earning updated for the day with a funding fee payment")
}
            console.log(`Funding successful - Ref: ${ref}, Transaction ID: ${transactionId}, Amount: ${response.data.amount}`);
            
            // Send success notification
         sendd(
                "igwebuikea626@gmail.com",
                `${response.data.amount} NGN has been deposited by ${user} at ${response.data.created_at}`,undefined,"Funding success"
            );

            return 
        } 
        else {
            console.warn('Transaction verification failed:', response.data);
            await sendd(
                "igwebuikea626@gmail.com",
                `FUNDING FAILED for user ${user}`,undefined,"Fund failed"
            );
            
            return
        }
    }
     catch (error) {
        console.log("Error was caught in the verifyT module",error)

        await sendd(
            "igwebuikea626@gmail.com",
            `FUNDING ERROR for user ${user}`,undefined,"fund failure"
        );
        return
    }
}
module.exports = vet;