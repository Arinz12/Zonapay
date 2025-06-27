const sendd = require("../flib/mailsender");
const Schedule = require("./schedule");

async function bill(){
    let res
    await Schedule.deleteMany({Status:"completed"})
    if(ScheduledDoc.Status=="completed"){
console.log("bill settled already")
return;}
    if(ScheduledDoc.Bill=="airtime"){
        const [nid,amount,Phoneno]=[ScheduledDoc.Nid,ScheduledDoc.Details.amount,ScheduledDoc.Details.customer];
        const data={nid,amount,Phoneno,user:ScheduledDoc.User}
     res= await fetch("https://www.billsly.co/zonapay/airtime",{method:"post",body:JSON.stringify({data}),
    headers:{"Content-Type":"application/json","passid":"ariwa"}

})
}
else if(ScheduledDoc.Bill=="data"){
    const [nid,Phoneno,amount,type,billcode,itemcode]=[ScheduledDoc.Nid,ScheduledDoc.Details.customer,ScheduledDoc.Details.amount,ScheduledDoc.Details.Type,ScheduledDoc.Details.biller_code,ScheduledDoc.Details.item_code];
        const data={nid,Phoneno,amount,type,billcode,itemcode,user:ScheduledDoc.User}
    res= await fetch("https://www.billsly.co/zonapay/data",{method:"post",body:JSON.stringify({data}),
   headers:{"Content-Type":"application/json","passid":"ariwa"}
})}
else if(ScheduledDoc.Bill=="cabletv"){
    const [iuc,amount,biller,item]=[ScheduledDoc.Details.customer,ScheduledDoc.Details.amount,ScheduledDoc.Details.biller_code,ScheduledDoc.Details.item_code]
    const data={iuc,amount,biller,item,user:ScheduledDoc.User}
    res= await fetch("https://www.billsly.co/zonapay/cable",{method:"post",body:JSON.stringify({data}),
   headers:{"Content-Type":"application/json","passid":"ariwa"}
})}
else if(ScheduledDoc.Bill=="elect"){
    const [iuc,provider,amount,kind]=[ScheduledDoc.Details.customer,ScheduledDoc.Details.biller_code,ScheduledDoc.Details.amount,ScheduledDoc.Details.item_code]
    const data={iuc,provider,amount,kind,user:ScheduledDoc.User}
    res= await fetch("https://www.billsly.co/zonapay/electricity",{method:"post",body:JSON.stringify({data}),
   headers:{"Content-Type":"application/json","passid":"ariwa"}
})}
else{
    console.log("Scheduled bill failed1")
}
if(res.ok){
    const identification= ScheduledDoc.Idd
    await Schedule.updateOne({Idd:identification},{$set:{Status:"completed"}},{upsert:false})
    console.log("Scheduled bill has been paid")
    sendd("arize1524@gmail.com", "A scheduled bill has been settled", undefined, "Bill Completed")
}
else{
    console.log("Scheduled bill failed")
    sendd("arize1524@gmail.com", "A scheduled bill has  Failed", undefined, "Bill Completed")

}
}

module.exports=bill