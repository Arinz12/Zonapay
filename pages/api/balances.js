// 
require("dotenv").config()
import { User } from "../../Svr_fns/createuser";
export default async function handler(req, res) {
    const arr= await User.find();
    const new_arr=arr.map((a)=>{return a.Balance});
    const total= new_arr.reduce((acc,curr)=>{return acc+curr});
    const resp= await fetch("https://api.flutterwave.com/v3/balances/NGN",{
        method:"GET",
        headers:{
        "Content-Type":"application/json",
    "accept":"application/json",
"Authorization":`Bearer ${process.env.FLW_SECRET_KEY}`
}
});
    if(resp.ok){
const mbal=await resp.json();
if(mbal.status=="success"){
    const obj={
        client_total:total,
        my_total:mbal.data.available_balance,
        Notsettled:mbal.data.ledger_balance
    };
   return  res.status(200).json(obj);
}
    }
    else{
        return res.status(404).send("Error occured"); 
    }
    
}