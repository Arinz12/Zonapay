// @ts-nocheck
require("dotenv").config();
const Flutterwave = require('flutterwave-node-v3');
const sendd = require("../flib/mailsender");
const { User } = require("./createuser");

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
            response.data.tx_ref === ref) {
            
            // Update user balance
            const updatedUser = await User.findByIdAndUpdate(
                ID, 
                { $inc: { Balance: response.data.amount } },
                { new: true, runValidators: true }
            ).exec();

            if (!updatedUser) {
                throw new Error('User not found');
            }

            console.log(`Funding successful - Ref: ${ref}, Transaction ID: ${transactionId}, Amount: ${response.data.amount}`);
            
            // Send success notification
            await sendd(
                "igwebuikea626@gmail.com",
                `${response.data.amount} NGN has been deposited by ${user} at ${response.data.created_at}`,
                `Transaction ID: ${transactionId}`
            );

            return {
                success: true,
                amount: response.data.amount,
                transactionId,
                user: updatedUser
            };
        } else {
            console.warn('Transaction verification failed:', response.data);
            await sendd(
                "igwebuikea626@gmail.com",
                `FUNDING FAILED for user ${user}`,
                `Transaction ID: ${transactionId}, Status: ${response.data?.status}`
            );
            
            return {
                success: false,
                reason: 'Transaction validation failed',
                data: response.data
            };
        }
    } catch (error) {
        console.error('Verification error:', {
            error: error.message,
            stack: error.stack,
            transactionId,
            ref,
            user
        });

        await sendd(
            "igwebuikea626@gmail.com",
            `FUNDING ERROR for user ${user}`,
            `Error: ${error.message}\nTransaction ID: ${transactionId}`
        );

        throw new Error(`Transaction verification failed: ${error.message}`);
    }
}

module.exports = vet;