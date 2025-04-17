import { ArrowBackIosRounded,CheckCircle,Forward, ForwardRounded } from "@mui/icons-material"
import { Button, Paper, Typography } from "@mui/material"
import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import router from "next/router"
import NumericPad from "../../components/Numpad"
const Elect=()=>{
    const [processed,setProcessed]=useState(false)
    const [details,setDetails]=useState(null)
    const [pincon, setPincon]= useState(false)
    const [showkeypad,setShowKeyPad]=useState(false);
    const [loading,setLoading]=useState(false)
    const electplan=useRef([])
    const [electready,setElectReady]=useState(false)
    const pre=useRef([])
    const post=useRef([])
    const provider=useRef([])
    const acct=useRef([])
    const btn=useRef([])
    const amt=useRef([])
    const [btnready,setBtnready]=useState(true);
     async function veri(){
      const matcher=/^\d{13}$/
      if(!matcher.test(acct.current.value)){
        return
      }
        document.getElementById("userinfo").style.color="blue"
        document.getElementById("userinfo").innerHTML="checking..."
        const type=(pre.current.checked)? "prepaid":"postpaid"

        const epp= document.getElementById("ep").value
      const meter= acct.current.value
      
       const data={iuc:meter,provider:provider.current.value,vid:type}
       const res= await fetch("https://zonapay.onrender.com/api/verify",{method:"POST",body:JSON.stringify(data),headers:{
        "Content-Type":"application/json"
       }})
       if(res.ok){
const result= await res.json();
document.getElementById("userinfo").style.color="green"
console.log("user",result)
document.getElementById("userinfo").innerHTML=result.data.customer_name;}
else{
    document.getElementById("userinfo").style.color="red"
    document.getElementById("userinfo").innerHTML="failed to verify user";
   }
       }
       
     
async function ver1(){
  try{
const billcode=provider.current.value;
    const res=await fetch(`https://zonapay.onrender.com/zonapay/eitemcode`,{
      method:"GET",
      body:JSON.stringify({data:billcode}), headers:{
      "Content-Type":"application/json"}
    })
if(res.ok){
const res1= await res.json();
const fo=res1.data[0];
const fo2=res1.data[1];
pre.current.value =(fo.name.toLowerCase.includes("prepaid"))? fo.item_code:fo2.item_code;
post.current.value =(fo.name.toLowerCase.includes("postpaid"))? fo.item_code:fo2.item_code;
}
else{
throw new Error("failed to get item codes")
}}
catch(e){
  console.log(e)
}
}
useEffect(()=>{
  //fetch electricity discos
  const fetchElect= async ()=>{
    try{
    const billers= await fetch("https://zonapay.onrender.com/zonapay/elects",{
      method:"POST", 
      headers:{
      "Content-Type":"application/json"}
    })
    if(billers.ok){
      const billers1=await billers.json();
      setElectReady(true);
      console.log(billers1.data)
electplan.current=billers1.data
    }
    else{
      throw new Error("failed to fetch items")
    }
  }
  catch(e){
console.log(e)
  }}
  fetchElect()
})
    useEffect(
       ()=>{
        const handleSubmit= async ()=>{
            if(!pincon){
                setShowKeyPad(true)
                return
              } 
              setShowKeyPad(false)
              const type=(pre.current.checked)? pre.current.value:post.current.value
            const data={iuc:acct.current.value,provider:provider.current.value,amount:amt.current.value,kind:type}
            setLoading(true)
            const res= await fetch("https://zonapay.onrender.com/zonapay/electricity",{method:"POST",body:JSON.stringify(data),headers:{
                "Content-Type":"application/json"
            }})
            if(res.ok){
const result= await res.json();

  setDetails(result)
setProcessed(true);
return
}
else{
  setLoading(false)
router.push("/dashboard/error")
}
};
btn.current.addEventListener("click",handleSubmit)
if(pincon&&btn.current){
btn.current.click()
}
return ()=>{
  btn.current.removeEventListener("click",handleSubmit)
}
},[pincon])

    const handlePinSubmit= async (pin)=>{
        const data={pinn:pin}
        try{
      const rep= await fetch("https://zonapay.onrender.com/zonapay/confirmPin",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      if(rep.ok){
        setPincon(true);
        console.log("okayyy") 
      }else{
        console.log("wrong pin")
        setTimeout(()=>{  
      },3000)
      }
      }
      catch(e){
        console.log("error wrong pin")
      }
      }  

    if (processed){
        return (<>
        <div style={{height:"100lvh",width:"100vw"}} className="flex  flex-row items-center justify-center">
      <div className="flex flex-col gap-8 justify-center items-center w-full">
        <div className="flex flex-col gap-4 items-center justify-center">
      <CheckCircle className="scale" sx={{color:"green",height:"130px",width:"130px"}}/>
      <div style={{fontSize:"20px"}} className="text-black rubik-b">{details.message}</div>
      </div>
        <Paper elevated={4} className=" flex flex-col  mt-4 space-y-2 text-center w-10/12 p-6 rounded-xl ">
              <div className="monomaniac-one-regular  flex flex-row  justify-between"><span>Provider</span>
              <span>{details.data.network}</span></div>
              <div className="monomaniac-one-regular  flex flex-row justify-between"><span>M-no</span><span>{details.data.phone_number}</span></div>
              <div className="monomaniac-one-regular  flex flex-row justify-between"><span>Token</span><span>{details.data.token}</span></div>
              <div className="monomaniac-one-regular  flex flex-row justify-between"><span>Units</span><span>{details.data.units}</span></div>
              <div className="monomaniac-one-regular  flex flex-row justify-between"><span>Amount</span><span>{details.data.amount}</span></div>
              
          </Paper>
          <Link href={"/dashboard"} className="rubik-b mt-8 rounded-full w-9/12">{<Button startIcon={<Home /> } variant="contained" sx={{textTransform:"none",backgroundColor:"#1E3A5F"}}>GO to Home</Button>}</Link>
          </div>
  </div> 
        </>

        )
    }
    return(<>
    <Head>
        <title>Electricity</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet"/>
    </Head>
    <div className=" w-full h-full flex flex-col gap-4 items-center" style={{backgroundColor:"whitesmoke",height:"100dvh"}}>
    <div style={{fontSize:"26px"}} className="rubik-h w-full bg-blue-600 text-white px-4 py-7 flex flex-row justify-start gap-4 items-center rounded-b-3xl  mb-9">
    <div onClick={()=>{router.back()}} style={{backgroundColor:"white",borderRadius:"50%",height:"30px",width:"30px"}}className="p-6 flex flex-row items-center justify-center"><ArrowBackIosRounded sx={{color:"white"}} className="text-blue-600" /> </div>
        <div style={{fontSize:"25px"}} className="rubik-h ">Electricity</div>
        
        </div>
    <div className="w-full bg-white rounded-2xl mb-5">
<div className="flex flex-col w-full justify-start p-6 bg-white rounded-xl">
<label  htmlFor="ep" className="ml-3 rubik-h">Provider</label>
<select ref={provider} onChange={ver1} 
id="ep" name="provider" style={{fontSize:"17px"}} className="bg-transparent focus:outline-none ml-3 rubik-b border-t-0 border-l-0 border-r-0 border-b-2 border-blue-600">
    <option style={{fontSize:"15px"}} className="rubik-b">Select provider</option>
    {electready && electplan.current.map((opts)=>
<option  value={opts.data.biller_code}>{opts.description}</option>
    )}
</select>

</div></div>

<div className="flex flex-row w-11/12 mx-auto justify-evenly gap-5 items-center p-4 bg-white rounded-xl">
<div className="flex flex-row justify-center gap-3 rounded-2xl">
<input type="radio" name="pay"  ref={pre}/>
    <label className="rubik-b" htmlFor="pre">Prepaid</label>
</div>
<div className="flex flex-row justify-center gap-3 rounded-2xl">
<input type="radio" name="pay" ref={post}/>

    <label className="rubik-b" htmlFor="post">Postpaid</label>
</div>
</div>
        <div className="flex flex-col w-11/12 mx-auto justify-start p-6 bg-white rounded-xl">
<label  htmlFor="acct" className="ml-3 rubik-h">Meter/Acct No</label>
<input onKeyUp={veri}  ref={acct} type="number" inputMode="numeric" name="meter" className="ac rounded-t-xl focus:outline-none ml-3 border-t-0 border-l-0 border-r-0 border-b-2 border-blue-600 w-11/12 h-12 font-bold " style={{fontSize:"18px"}}/>
<span id='userinfo' className="rubik-b ml-4"></span>
        </div>
        <div className="flex flex-col w-11/12 mx-auto justify-start p-6 bg-white rounded-xl">
<label  htmlFor="amt" className=" ml-3 rubik-h">Amount</label>
<input ref={amt} type={"number"} inputMode="numeric" name="amount" className="ac rounded-t-xl focus:outline-none font-bold ml-3 border-t-0 border-l-0 border-r-0 border-b-2 border-blue-600 w-11/12 h-12 " style={{fontSize:"18px"}} />
        </div>
<div className="mx-auto">
    {btnready && <Button style={{textTransform:"none"}} ref={btn} variant={"contained"} endIcon={<ForwardRounded/>}>Proceed</Button>}
</div>
{loading&&<Delay/>}
{showkeypad&&<NumericPad maxLength={4} onSubmit={handlePinSubmit} hideComp={()=>{setShowKeyPad(false)}}/>}
<div id="delay" style={{backgroundColor:"rgba(0, 0, 0, 0.253)",backdropFilter:"blur(9px)"}} className=" flex-col items-center justify-center  fixed  z-10 w-full bottom-0 h-full shp hidden">
<section className="dots-container">
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
</section>

</div>
    </div>
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
export default Elect