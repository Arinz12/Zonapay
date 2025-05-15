const crypto= require("crypto")

function otp(){
    const a= crypto.randomInt(100000,1000000)
        return a;
}
module.exports= {otp}
