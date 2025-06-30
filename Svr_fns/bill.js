const sendd = require("../flib/mailsender");
const Schedule = require("./schedule");

async function bill(DocfromSchedule){
    try{
    console.log("bill function has started...")
    let res
    await Schedule.deleteMany({Status:"completed"})
    if(DocfromSchedule.Status=="completed"){
console.log("bill settled already")
return;}
    if(DocfromSchedule.Bill=="airtime"){
        console.log("bill recon has started")
        const [nid,amount,Phoneno]=[DocfromSchedule.Nid,DocfromSchedule.Details.amount,DocfromSchedule.Details.customer];
        const data={nid,amount,Phoneno,user:DocfromSchedule.User}
     res= await fetch("https://www.billsly.co/zonapay/airtime",{method:"post",body:JSON.stringify({data}),
    headers:{"Content-Type":"multipart/form-data","passid":"ariwa"}

})
}
else if(DocfromSchedule.Bill=="data"){
    const [nid,Phoneno,amount,type,billcode,itemcode]=[DocfromSchedule.Nid,DocfromSchedule.Details.customer,DocfromSchedule.Details.amount,DocfromSchedule.Details.Type,DocfromSchedule.Details.biller_code,DocfromSchedule.Details.item_code];
        const data={nid,Phoneno,amount,type,billcode,itemcode,user:DocfromSchedule.User}
    res= await fetch("https://www.billsly.co/zonapay/data",{method:"post",body:JSON.stringify({data}),
   headers:{"Content-Type":"application/json","passid":"ariwa"}
})}
else if(DocfromSchedule.Bill=="cabletv"){
    const [iuc,amount,biller,item]=[DocfromSchedule.Details.customer,DocfromSchedule.Details.amount,DocfromSchedule.Details.biller_code,DocfromSchedule.Details.item_code]
    const data={iuc,amount,biller,item,user:DocfromSchedule.User}
    res= await fetch("https://www.billsly.co/zonapay/cable",{method:"post",body:JSON.stringify({data}),
   headers:{"Content-Type":"application/json","passid":"ariwa"}
})}
else if(DocfromSchedule.Bill=="elect"){
    const [iuc,provider,amount,kind]=[DocfromSchedule.Details.customer,DocfromSchedule.Details.biller_code,DocfromSchedule.Details.amount,DocfromSchedule.Details.item_code]
    const data={iuc,provider,amount,kind,user:DocfromSchedule.User}
    res= await fetch("https://www.billsly.co/zonapay/electricity",{method:"post",body:JSON.stringify({data}),
   headers:{"Content-Type":"application/json","passid":"ariwa"}
})}
else{
    console.log("Scheduled bill failed1")
}
if(res.ok){
    const identification= DocfromSchedule.Idd
    await Schedule.updateOne({Idd:identification},{$set:{Status:"completed"}},{upsert:false})
    console.log("Scheduled bill has been paid")
    sendd("arize1524@gmail.com", "A scheduled bill has been settled", undefined, "Bill Completed")
}
else{
    console.log("Scheduled bill failed")
    sendd("arize1524@gmail.com", "A scheduled bill has  Failed", undefined, "Bill Completed")

}}
catch(e){
    console.log("bill function error",e)
}
}

module.exports=bill
