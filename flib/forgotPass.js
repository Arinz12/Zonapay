function otp(){
    return  (crypto.randomBytes(4).readUInt32BE() % 1_000_000).toString()
}
module.exports= {otp}
