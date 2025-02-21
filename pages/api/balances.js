// 
import { User } from "../../Svr_fns/createuser";
export default async function handler(req, res) {
    const arr= await User.find();
    const new_arr=arr.filter((a)=>{return a.Balance});
    const total= new_arr.reduce((acc,curr)=>{return acc+curr});
    const resp= await fetch("https://vtu.ng/wp-json/api/v1/balance?username=ArinzechukwuGift&password=ari123Ari@vv",{method:"GET"});
    if(resp.ok){
const mbal=await resp.json();
if(mbal.code=="success"){
    const obj={client_total:total,my_total:mbal.data.balance};
   return  res.status(200).json(obj);
}
    }
    else{
        return res.status(404).send("Error occured"); 
    }
    
}