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

  <div onClick={()=>{router.back()}} style={{backgroundColor:"white",borderRadius:"50%",height:"30px",width:"30px"}}className="p-6 flex flex-row items-center justify-center"><ArrowBackIosRounded sx={{color:"white"}} className="bg-blue-600" /> </div>
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
<div> <label htmlFor="gotv-smallie">
    <div tabIndex={0} className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center  text-center  focus:ring-8 focus:ring-blue-600">
gotv smallie<br/>1,575
    </div>
</label>
<input className="hidden" name="variation_id" id="gotv-smallie" type="radio" value="gotv-smallie"/></div>

<div><label htmlFor="gotv-jinja">
<div tabIndex={0} className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center  focus:ring-8 focus:ring-blue-600">
gotv jinja<br/>3,300
    </div>
</label>
<input className="hidden" name="variation_id" id="gotv-jinja" type="radio" value="gotv-jinja"/></div>

<div><label htmlFor="gotv-jolli">
<div tabIndex={0} className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center  focus:ring-8 focus:ring-blue-600">
gotv jolli<br/>4,850
    </div>
</label>
<input className="hidden" name="variation_id" id="gotv-jolli" type="radio" value="gotv-jolli"/></div>

<div><label htmlFor="gotv-max">
<div tabIndex={0} className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center  focus:ring-8 focus:ring-blue-600">
gotv max <br/>7,200
    </div>
</label>
<input className="hidden" name="variation_id" id="gotv-max" type="radio" value="gotv-max"/></div>

<div><label htmlFor="gotv-supa">
<div tabIndex={0} className="w-36 rubik-h bg-gray-400 h-36 rounded-lg flex flex-col justify-center text-center  focus:ring-8 focus:ring-blue-600">
gotv supa <br/>15,700
    </div>
</label>
<input className="hidden" name="variation_id" id="gotv-supa" type="radio" value="gotv-supa"/></div>
</div>:null}

{(cpp=="dstv")?<div className="grid grid-cols-2 justify-center items-center mt-4 w-full gap-5">
  

  <div tabIndex={0}>
    <input type="radio" id="dstv-padi" name="variation_id" value="dstv-padi" className="hidden" />
    <label htmlFor="dstv-padi" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      DStv Padi
    </label>
  </div>

  <div>
    <input type="radio" id="dstv-yanga" name="variation_id" value="dstv-yanga" className="hidden" />
    <label htmlFor="dstv-yanga" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      DStv Yanga
    </label>
  </div>

  <div>
    <input type="radio" id="dstv-confam" name="variation_id" value="dstv-confam" className="hidden" />
    <label htmlFor="dstv-confam" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      DStv Confam
    </label>
  </div>

  <div>
    <input type="radio" id="dstv6" name="variation_id" value="dstv6" className="hidden" />
    <label htmlFor="dstv6" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      DStv Asia
    </label>
  </div>

  <div>
    <input type="radio" id="dstv79" name="variation_id" value="dstv79" className="hidden" />
    <label htmlFor="dstv79" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      DStv Compact
    </label>
  </div>
  <div>
  <input type="radio" id="dstv7" name="variation_id" value="dstv7" className="hidden" />
  <label htmlFor="dstv7" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact Plus
  </label>
</div>

<div>
  <input type="radio" id="dstv3" name="variation_id" value="dstv3" className="hidden" />
  <label htmlFor="dstv3" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Premium
  </label>
</div>

<div>
  <input type="radio" id="dstv10" name="variation_id" value="dstv10" className="hidden" />
  <label htmlFor="dstv10" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Premium Asia
  </label>
</div>

<div>
  <input type="radio" id="dstv9" name="variation_id" value="dstv9" className="hidden" />
  <label htmlFor="dstv9" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Premium-French
  </label>
</div>

<div>
  <input type="radio" id="confam-extra" name="variation_id" value="confam-extra" className="hidden" />
  <label htmlFor="confam-extra" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Confam + ExtraView
  </label>
</div>

<div>
  <input type="radio" id="yanga-extra" name="variation_id" value="yanga-extra" className="hidden" />
  <label htmlFor="yanga-extra" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Yanga + ExtraView
  </label>
</div>

<div>
  <input type="radio" id="padi-extra" name="variation_id" value="padi-extra" className="hidden" />
  <label htmlFor="padi-extra" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Padi + ExtraView
  </label>
</div>

<div>
  <input type="radio" id="com-asia" name="variation_id" value="com-asia" className="hidden" />
  <label htmlFor="com-asia" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact + Asia
  </label>
</div>

<div>
  <input type="radio" id="dstv30" name="variation_id" value="dstv30" className="hidden" />
  <label htmlFor="dstv30" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact + Extra View
  </label>
</div>

<div>
  <input type="radio" id="com-frenchtouch" name="variation_id" value="com-frenchtouch" className="hidden" />
  <label htmlFor="com-frenchtouch" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact + French Touch
  </label>
</div>

<div>
  <input type="radio" id="dstv33" name="variation_id" value="dstv33" className="hidden" />
  <label htmlFor="dstv33" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Premium – Extra View
  </label>
</div>

<div>
  <input type="radio" id="dstv40" name="variation_id" value="dstv40" className="hidden" />
  <label htmlFor="dstv40" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact Plus – Asia
  </label>
</div>

<div>
  <input type="radio" id="com-frenchtouch-extra" name="variation_id" value="com-frenchtouch-extra" className="hidden" />
  <label htmlFor="com-frenchtouch-extra" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact + French Touch + ExtraView
  </label>
</div>

<div>
  <input type="radio" id="com-asia-extra" name="variation_id" value="com-asia-extra" className="hidden" />
  <label htmlFor="com-asia-extra" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact + Asia + ExtraView
  </label>
</div>

<div>
  <input type="radio" id="dstv43" name="variation_id" value="dstv43" className="hidden" />
  <label htmlFor="dstv43" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact Plus + French Plus
  </label>
</div>

<div>
  <input type="radio" id="complus-frenchtouch" name="variation_id" value="complus-frenchtouch" className="hidden" />
  <label htmlFor="complus-frenchtouch" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact Plus + French Touch
  </label>
</div>

<div>
  <input type="radio" id="dstv45" name="variation_id" value="dstv45" className="hidden" />
  <label htmlFor="dstv45" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact Plus – Extra View
  </label>
</div>

<div>
  <input type="radio" id="complus-french-extraview" name="variation_id" value="complus-french-extraview" className="hidden" />
  <label htmlFor="complus-french-extraview" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact Plus + FrenchPlus + Extra View
  </label>
</div>

<div>
  <input type="radio" id="dstv47" name="variation_id" value="dstv47" className="hidden" />
  <label htmlFor="dstv47" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact + French Plus
  </label>
</div>

<div>
  <input type="radio" id="dstv48" name="variation_id" value="dstv48" className="hidden" />
  <label htmlFor="dstv48" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Compact Plus + Asia + ExtraView
  </label>
</div>

<div>
  <input type="radio" id="dstv61" name="variation_id" value="dstv61" className="hidden" />
  <label htmlFor="dstv61" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Premium + Asia + Extra View
  </label>
</div>

<div>
  <input type="radio" id="dstv62" name="variation_id" value="dstv62" className="hidden" />
  <label htmlFor="dstv62" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Premium + French + Extra View
  </label>
</div>

<div>
  <input type="radio" id="hdpvr-access-service" name="variation_id" value="hdpvr-access-service" className="hidden" />
  <label htmlFor="hdpvr-access-service" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv HDPVR Access Service
  </label>
</div>

<div>
  <input type="radio" id="frenchplus-addon" name="variation_id" value="frenchplus-addon" className="hidden" />
  <label htmlFor="frenchplus-addon" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv French Plus Add-on
  </label>
</div>

<div>
  <input type="radio" id="asia-addon" name="variation_id" value="asia-addon" className="hidden" />
  <label htmlFor="asia-addon" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv Asian Add-on
  </label>
</div>

<div>
  <input type="radio" id="frenchtouch-addon" name="variation_id" value="frenchtouch-addon" className="hidden" />
  <label htmlFor="frenchtouch-addon" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv French Touch Add-on
  </label>
</div>

<div>
  <input type="radio" id="extraview-access" name="variation_id" value="extraview-access" className="hidden" />
  <label htmlFor="extraview-access" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    ExtraView Access
  </label>
</div>

<div>
  <input type="radio" id="french11" name="variation_id" value="french11" className="hidden" />
  <label htmlFor="french11" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
    DStv French 11
  </label>
</div>

</div>
:null}

{(cpp=="startimes")?<div className="grid grid-cols-2 justify-center items-center mt-4 w-full gap-5">
  <div>
    <label htmlFor="nova">
      <div tabIndex={0} className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
        Startimes Nova
      </div>
    </label>
    <input className="hidden" name="variation_id" id="nova" type="radio" value="nova" />
  </div>

  <div>
    <input type="radio" id="nova" name="variation_id" value="nova" className="hidden" />
    <label htmlFor="nova" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      Startimes Nova
    </label>
  </div>

  <div>
    <input type="radio" id="basic" name="variation_id" value="basic" className="hidden" />
    <label htmlFor="basic" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      Startimes Basic
    </label>
  </div>

  <div>
    <input type="radio" id="smart" name="variation_id" value="smart" className="hidden" />
    <label htmlFor="smart" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      Startimes Smart
    </label>
  </div>

  <div>
    <input type="radio" id="classic" name="variation_id" value="classic" className="hidden" />
    <label htmlFor="classic" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      Startimes Classic
    </label>
  </div>

  <div>
    <input type="radio" id="super" name="variation_id" value="super" className="hidden" />
    <label htmlFor="super" className="w-36 h-36 rubik-h bg-gray-400 rounded-lg flex flex-col justify-center text-center focus:ring-8 focus:ring-blue-600">
      Startimes Super
    </label>
  </div>
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