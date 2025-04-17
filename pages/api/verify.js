import dotenv from "dotenv"
dotenv.config()

import {URL} from "url"

export default async function handler(req,res){
if (req.method==="POST"){
    const {iuc,provider,vid}=req.body
const url=`https://api.flutterwave.com/v3/bill-items/${vid}/validate?code=${provider}&customer=${iuc}`

try{
const resp= await fetch(url.toString(),{method:"GET",
headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${process.env.FLW_SECRET_KEY}`
}
})
const resp1= await resp.json()
res.status(200).json(resp1);}
catch(e){
res.status(404);
}
}
else{
    res.status(401)
    return;
}
}