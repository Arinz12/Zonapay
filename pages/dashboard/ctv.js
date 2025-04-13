import "@fontsource/roboto"
import { ArrowBackIosRounded, ArrowForward, CheckCircle } from "@mui/icons-material";
import { Paper, Button } from "@mui/material"
import Head from "next/head"
import { useEffect, useState } from "react";
import router from "next/router"
import Delay from "../../components/Delay";
import Link from "next/link";

const Cable=()=>{
const [status,setStatus]=useState(null)
const [processed,setPro]=useState(false)
const [start,setStart]=useState(false)
const[cpp,setCp]=useState("gotv")
const gotvplans= useRef([]);
const starplans= useRef([]);
const dstvplans= useRef([]);

async function val(){
    const valu=document.getElementById("iuc").value;
    const cp=document.getElementById("cp").value;
    const user=document.getElementById("user")
    const opts=["gotv","dstv","startimes"]
    if(cp==="dstv"){
        if(valu.toString().length<11){
        console.log("invalid dstv iuc")
            return
        }
    }
    else{
        if(valu.toString().length<10||!opts.includes(cp)){
        console.log("invalid iuc")
        return
    }}
    user.style.display="block";
    user.style.color="green"
    user.innerHTML="checking..."
    const data={iuc:valu,cableprovider:cp}
    try{
    const resp=await fetch("https://zonapay.onrender.com/api/verify",{method:"POST",body:JSON.stringify(data),headers:{
        "Content-Type": "application/json",
        "Accept": "application/json"
      }})
      if(resp.ok){
        const resp1= await resp.json();
    if(resp1.code=="success"){
        user.innerHTML=resp1.data.customer_name;
        user.style.color="green"
        user.style.display="block";
    }
    else{
        user.innerHTML="failed to verify user"
        user.style.color="red";
        user.style.display="block";
    }
      }
}
    catch(e){
        user.innerHTML="failed to verify user"
        user.style.color="red";
        user.style.display="block";
        console.log("Gotchaa  "+e)
    }
}
function change(){
    setCp(document.getElementById("cp").value);
}
useEffect( ()=>{
  const fetchtv= async ()=>{
 
   try{
     const res= await fetch("https://zonapay.onrender.com/zonapay/ftp",
     {
       method:"post",
     body:JSON.stringify({bille:"BIL122"}),
     headers:{
       "Content-Type":"application/json"
     }
   })
   const res2= await fetch("https://zonapay.onrender.com/zonapay/ftp",
   {
     method:"post",
   body:JSON.stringify({bille:"BIL121"}),
   headers:{
     "Content-Type":"application/json"
   }
 })
 const res3= await fetch("https://zonapay.onrender.com/zonapay/ftp",
 {
   method:"post",
 body:JSON.stringify({bille:"BIL123"}),
 headers:{
   "Content-Type":"application/json"
 }
 })
 
   if(res.ok){
     const resp=await res.json();
   gotvplans.current=resp.data
   
   }else{
     console.log("failed to fetch data plans for gotv")
   }
   if(res2.ok){
     const resp=await res2.json();
   dstvplans.current=resp.data
   }else{
     console.log("failed to fetch data plans for dstv")
   }
   if(res3.ok){
     const resp=await res3.json();
   starplans.current=resp.data
   }else{
     console.log("failed to fetch data plans for startimes")
   }
 
   }
 catch(e){
   console.log("erroR  "+e)
 }}
   fetchtv();
   })

useEffect(()=>{
  if(!status==null){
  setPro(true)}
})


useEffect(()=>{
    document.getElementById("form").onsubmit= async (e)=>{
    e.preventDefault();
    const valu=document.getElementById("iuc").value;
    const cp=document.getElementById("cp").value;
    const pho=document.getElementById("pn").value;
    const ar=Object.values(document.getElementsByName("variation_id"))
    const ele=ar.filter((a)=>a.checked==true)
const dataa={cableprovider:cp,iuc:valu,phone:pho,variation_id:ele[0].value}
    try{
        setStart(true)
        const resp= await fetch("https://zonapay.onrender.com/zonapay/cable",{method:"POST",body:JSON.stringify(dataa),headers:{"Content-Type":"application/json"}})
    if(resp.ok){
    const data2= await resp.json();
    if(data2.code=="failure"){
        throw new Error("something went wrong1")
    }
    setStatus(data2)
    }
    else{
        throw new Error("something went wrong")
    }}
    catch(e){
    console.log("GOTCHAAAAAAA"+e)
    router.push("/dashboard/error")
    }
    finally{
    console.log("done.....")
    setStart(false)
    }
    }},[])

    return(<>
    <Head>
        <title>Cable</title>
        </Head>
       { processed? 
       <div style={{height:"100lvh",width:"100vw"}} className="flex  flex-row items-center justify-center">
      <div className="flex flex-col gap-8 justify-center items-center w-full">
        <div className="flex flex-col gap-2 items-center justify-center">
      <CheckCircle sx={{color:"green",height:"130px",width:"130px"}}/>
      <div style={{fontSize:"25px"}} className="text-black rubik-b">{status.message}</div>
      </div>
        <div style={{border:"4px solid green"}} className="flex flex-col mt-4 space-y-2 text-center w-10/12 p-6 rounded-xl ">
              <div className="text-lg font-semibold flex flex-row justify-between"><span>Transaction id</span><span>{status.data.order_id}</span></div>
             <div className="text-lg font-semibold flex flex-row justify-between"><span>Cable</span><span>{status.data.cable_tv}</span></div>
              <div className="text-lg font-semibold flex flex-row justify-between"><span>Amount</span><span>{status.data.amount}</span></div>
              <div className="text-lg font-semibold flex flex-row justify-between"><span>plan</span><span>{status.data.subscription_plan}</span></div>
              <div className="text-lg font-semibold flex flex-row justify-between"><span>iuc</span><span>{status.data.smartcard_number}</span></div>
          </div>
          <Link href={"/dashboard"} className="rubik-b mt-8">{<Button startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none",backgroundColor:"#1E3A5F"}}>Home</Button>}</Link>
          </div>
  </div>: <div className="" style={{backgroundColor:"whitesmoke"}}>
  <div style={{fontSize:"26px"}} className="rubik-h w-full sticky top-0 text-white bg-blue-600 px-4 py-7 flex flex-row justify-start gap-4 items-center rounded-b-3xl  mb-14">

  <div onClick={()=>{router.back()}} style={{backgroundColor:"white",borderRadius:"50%",height:"30px",width:"30px"}}className="p-6 flex flex-row items-center justify-center"><ArrowBackIosRounded sx={{color:"white"}} className="text-blue-600" /> </div>
  <div>Cable Tv</div>
  
  </div>

            
            <form  method="post" className="w-full" id="form">
                <div className="flex flex-col gap-8 mx-auto p-6 bg-white rounded-xl " style={{width:"100%"}}>
                <select onChange={change} className="focus:outline-none rubik-h p-4 rounded-md " name="cableprovider" id="cp">
                    <option className="rubik-b" value="gotv">GOTV</option>
                    <option className="rubik-b" value="dstv">DSTV</option>
                    <option className="rubik-b" value="startimes">STARTIMES</option>
                </select>
               <div className="flex flex-col"><label htmlFor='iuc' className="rubik-h font-bold" style={{fontSize:"20px"}}>Iuc number</label>
               <input onKeyUp={val}  id="iuc" className="border-0 border-b-4 border-blue-600 focus:outline-none rubik-h font-bold" type="number" name="iuc" placeholder="Decoder number"  /> <span style={{color:"blue"}} id="user" className="hidden font-bold"></span></div>
               <div className= "flex flex-col mt-4"><label htmlFor="pn" className="rubik-h font-bold" style={{fontSize:"20px"}}> Phone number</label>
               <input id="pn" className="  border-0 border-b-4 border-blue-600 focus:outline-none" type="text" placeholder="Enter number" name="phone" /></div>
               
 {(cpp=="gotv")? <div className="grid grid-cols-2 justify-center items-center mt-4 w-full gap-5">
{gotvplans.current.map((opts)=>{(
  <div tabIndex={0}>
  <div data-amount={opts.amount} data-billcode={opts.biller_code} data-itemcode={opts.item_code} className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    {opts.name}
  </div>
</div>
)})}
</div>:null}

{(cpp=="dstv")?<div className="grid grid-cols-2 justify-center items-center mt-4 w-full gap-5">
  
{dstvplans.current.map((opts)=>{(
  <div tabIndex={0}>
  <div data-amount={opts.amount} data-billcode={opts.biller_code} data-itemcode={opts.item_code} className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    {opts.name}
  </div>
</div>
)})}

</div>
:null}

{(cpp=="startimes")?<div className="grid grid-cols-2 justify-center items-center mt-4 w-full gap-5">
  
{starplans.current.map((opts)=>{(
  <div tabIndex={0}>
  <div data-amount={opts.amount} data-billcode={opts.biller_code} data-itemcode={opts.item_code} className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    {opts.name}
  </div>
</div>
)})}
</div>
 :null}
            <Button type="submit" endIcon={<ArrowForward/>} className="p-2 rounded-md bg-blue-600" variant="contained" sx={{textTransform:"none"}}>
                {start? <Delay/> :"proceed"}
                </Button>
                </div>
            </form>
        </div>}
    </>)
}
export async function getServerSideProps(context){
if(!context.req.isAuthenticated()){
    return{
        redirect:{
            destination:"/login",
            permanent:false
        }
    }
}
return {
    props:{}
}
}
export default Cable