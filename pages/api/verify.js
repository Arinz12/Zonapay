import dotenv from "dotenv"
dotenv.config()

import {URL} from "url"

export default async function handler(req,res){
if (req.method==="POST"){
const url=new URL("https://vtu.ng/wp-json/api/v1/verify-customer?username=ArinzechukwuGift&password=ari123Ari@vv");
const iuc= req.body.iuc
const sid=req.body.cableprovider
url.searchParams.append("customer_id", iuc)
url.searchParams.append("service_id", sid)
try{
const resp= await fetch(url.toString(),{method:"GET"})
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