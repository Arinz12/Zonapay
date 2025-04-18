import dotenv from "dotenv"
dotenv.config()

import {URL} from "url"

export default async function handler(req,res){
if (req.method==="POST"){
    console.log(req.body)
    const {iuc,provider,vid}=req.body
try{
const resp= await fetch(`https://api.flutterwave.com/v3/bill-items/${vid}/validate?code=${provider}&customer=${iuc}`,{method:"GET",
headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${process.env.FLW_SECRET_KEY}`
}
})
if(resp.ok){
const resp1= await resp.json()
res.status(200).json(resp1);
}
else{
    res.status(400).end()
}}
catch(e){
res.status(404).end();
}
}
else{
    res.status(401)
    return;
}
}