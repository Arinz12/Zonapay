import Link from "next/link"
import Image from 'next/image';
import Head from "next/head"
import { Button,Paper} from "@mui/material";
import { ArrowBack, ArrowBackIosRounded, ArrowForward,Cancel,CheckCircle} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import router from "next/router";
import NumericPad from "../../components/Numpad";
import Delay from "../../components/Delay";

const Data=()=>{
  const [enable,setEnable]= useState(true)
  const [processed,setProcessed]=useState(false)
  const[sucessfull,setSucess]=useState(false)
  const [details,setDetails]=useState(null)
  const[loading,setLoading]=useState(false)
  const[net,setNet]=useState(null);
  const [pincon,setPincon]=useState(false);
  const [price,setPrice]=useState(0);
  const [mtnready,setmtnReady]=useState(false)
  const [gloready,setgloReady]=useState(false)
  const [airtelready,setairtelReady]=useState(false)
  const [vid,setVid]=useState("")
const mtnplans= useRef([]);
const airtelplans= useRef([]);
const gloplans= useRef([]);
const [showkeypad,setShowKeyPad]=useState(false)
const ready=useRef(null)

useEffect( ()=>{
 const fetchdata= async ()=>{

  try{
    const res= await fetch("https://zonapay.onrender.com/zonapay/fdp",
    {
      method:"post",
    body:JSON.stringify({bille:"BIL108"}),
    headers:{
      "Content-Type":"application/json"
    }
  })
  const res2= await fetch("https://zonapay.onrender.com/zonapay/fdp",
  {
    method:"post",
  body:JSON.stringify({bille:"BIL109"}),
  headers:{
    "Content-Type":"application/json"
  }
})
const res3= await fetch("https://zonapay.onrender.com/zonapay/fdp",
{
  method:"post",
body:JSON.stringify({bille:"BIL110"}),
headers:{
  "Content-Type":"application/json"
}
})

  if(res.ok){
    const resp=await res.json();
  mtnplans.current=resp.data
  setmtnReady(true);
  }else{
    console.log("failed to fetch data plans for mtn")
  }
  if(res2.ok){
    const resp=await res2.json();
  gloplans.current=resp.data
  setgloReady(true);
  }else{
    console.log("failed to fetch data plans for glo")
  }
  if(res3.ok){
    const resp=await res3.json();
  airtelplans.current=resp.data
  setairtelReady(true);
  }else{
    console.log("failed to fetch data plans for airtel")
  }

  }
catch(e){
  console.log("erroR  "+e)
}}
  fetchdata();
  })


  useEffect(()=>{
  const mtne=document.getElementById("mtn")
  const airte=document.getElementById("airtel")
  const gloe=document.getElementById("glo")
  const plan= document.getElementById("opts")
  const pho=document.getElementById("phone")
  const nigeriaPhoneRegex = /^(?:\+234|0)(70|80|81|90|91)[0-9]{8}$/;
  const mtnRegex = /^(?:\+234|0)(803|806|808|810|813|814|815|816|817|818|903|906|907|908|913|915|917|918|703|704|706|708|92)\d{7}$/;
  const airtelRegex = /^(?:\+234|0)(701|708|802|808|812|813|814|815|816|902|907|908|912|913|916)\d{7}$/;
  const gloRegex = /^(?:\+234|0)(705|805|807|809|811|813|814|815|905|906|907|913|915)\d{7}$/;

function checknet(pno){
if(mtnRegex.test(pno)){
  mtne.checked=true
  setNet("mtn")
  return
}
else if(airtelRegex.test(pno)){
  airte.checked=true
  setNet("airtel")

  return
}
else if(gloRegex.test(pno)){
  gloe.checked=true;
  setNet("glo")

  return;
}
else{
  return;
}
}
const nps=[mtne,airte,gloe]
nps.forEach((a)=>{
  a.onclick=()=>{
    if( nigeriaPhoneRegex.test(pho.value) ){
      checknet(pho.value)
  setEnable(false)
    }
    else{
      setEnable(true)
    }
  }
})
// plan.onfocus= ()=>{
//   if((plan.value)&&nigeriaPhoneRegex.test(pho.value) ){
//     checknet(pho.value)
// setEnable(false)
//   }
//   else{
//     setEnable(true)
//   }
// }
pho.onkeyup= ()=>{
  if( nigeriaPhoneRegex.test(pho.value) ){
    checknet(pho.value)
setEnable(false)
  }
  else if(nigeriaPhoneRegex.test(pho.value) ){
    checknet(pho.value)
  }
  else{
    setEnable(true)
  }
}

const form=document.getElementById("form");
const handleSubmit = async (e)=>{
  e.preventDefault();
  if(!pincon){
   setShowKeyPad(true)
   return;
  }
  setShowKeyPad(false);
  const formdata= new FormData(e.target)
  //nid,plan,phoneno,,,,amount,type
  formdata.append("amount",price)//eg 1000
  formdata.append("type",vid.type)//eg MTN 2GB 30DAYS
  formdata.append("billcode",vid.biller_code)
  formdata.append("itemcode", vid.item_code)

 try{ 
  setLoading(true)
  const url="https://zonapay.onrender.com/zonapay/data"

  const res= await fetch(url,{method:"POST",body:formdata})
  if(res.ok){
  const res1=await res.json();
setDetails(res1)
setProcessed(true);
setSucess(true)
return
}
  else{
    if(res){
      const res2=await res.json();
      if(res2.code=="insufficientFund"){
    setDetails({error:"Insufficient funds"})
    setProcessed(true)
    return;
      }
      setDetails({error:res2.message});
      setProcessed(true)
      return
    } 
  }
}
  catch(e){
    setPincon(false)
    setLoading(false);
console.error(e)
  }
}
form.addEventListener("submit", handleSubmit);
if(pincon&&ready.current){
ready.current.click()
}

return ()=>{
  form.removeEventListener("submit", handleSubmit);
}
},[pincon])


const handlePinSubmit= async (pin)=>{
  const data={pinn:pin}
  try{
const rep= await fetch("https://zonapay.onrender.com/zonapay/confirmPin",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
if(rep.ok){
  document.getElementById("keyPad").style.display="none"
  console.log(pincon);
  console.log("okayyy") ;
  setPincon(true);
  return
}else{
  document.getElementById("wrongpin").style.display="block"
  console.log("wrong pin")
  setTimeout(()=>{  document.getElementById("wrongpin").style.display="none"
},3000)
}
}
catch(e){
  console.log("error wrong pin")
}
} 

 

if(processed){
  return(<>
  {sucessfull? <div style={{height:"100lvh",width:"100vw"}} className="flex  flex-row items-center justify-center">
      <div className="flex flex-col gap-8 justify-center items-center w-full">
        <div className="flex flex-col gap-2 items-center justify-center">
      <CheckCircle sx={{color:"green",height:"130px",width:"130px"}}/>
      <div style={{fontSize:"25px"}} className="text-black rubik-b">{details.message}</div>
      </div>
        <div className="flex flex-col mt-4 space-y-2 text-center w-10/12 p-6 rounded-xl ">
              <div className="text-lg font-semibold flex flex-row justify-between"><span>reference</span><span>{`TXN ${details.data.reference}`}</span></div>
              <div className="text-lg font-semibold flex flex-row justify-between"><span>Network</span><span>{details.data.network}</span></div>
              <div className="text-lg font-semibold flex flex-row justify-between"><span>Amount</span><span>{details.data.amount}</span></div>
              <div className="text-lg font-semibold flex flex-row justify-between"><span>phone</span><span>{details.data.phone_number}</span></div>
              {/* <div className="text-lg font-semibold flex flex-row justify-between"><span>Code</span><span>{details.data.data_plan}</span></div> */}
          </div>
          <Link href={"/dashboard"} className="rubik-b mt-8">{<Button startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none",backgroundColor:"#1E3A5F"}}>Home</Button>}</Link>
          </div>
  </div> : <div style={{height:"100lvh",width:"100vw"}} className="flex  flex-row items-center justify-center">
    <div className="flex flex-col gap-8 justify-center items-center">
    <Cancel sx={{color:"red",height:"130px",width:"130px"}}/>
      <div className="rubik-h">Something went wrong {" "+" "+details.error}</div>
      <Link href={"/dashboard"} className="rubik-b mt-8">{<Button startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none",backgroundColor:"#1E3A5F"}}>Home</Button>}</Link>
        </div>
</div>}
  </>

  )
}

    return(<>
    <Head>
      <title>Data</title>
    </Head>
    <div style={{backgroundColor:"whitesmoke",height:"100dvh"}} className="flex flex-col items-center mx-auto justify-start w-full md:w-9/12">

    <div style={{fontSize:"30px"}} className="rubik-h w-full text-white bg-blue-600 px-4 py-7 flex flex-row justify-start gap-4 items-center rounded-b-3xl  mb-16">
    <div onClick={()=>{router.back()}} style={{backgroundColor:"white",borderRadius:"50%",height:"30px",width:"30px"}}className="p-6 flex flex-row items-center justify-center"><ArrowBackIosRounded sx={{color:"white"}} className="text-blue-600" /> </div>
        <div style={{fontSize:"26px"}} className="rubik-h ">Data purchase</div>
        
        </div>

<form id="form" style={{backgroundColor:"white"}} className="w-11/12 p-4 rounded-2xl mb-8 flex flex-col" encType="multipart/form-data">
    <div>
    <p className="rubik-h pb-4">Choose your network</p>
    <div className="flex space-x-4">
  <div className="flex items-center">
    <input type="radio" id="mtn" name="nid" value="mtn" className="mr-2" />
    <label htmlFor="mtn"><svg className="rounded-lg" viewBox="0 0 820 820" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><path d="M0 0h820v820H0z" fill="#ffc403"/><path d="M364.5 361.6v93.6h-25.6v-52.5L321.8 428h-13.4l-18.8-25.3v52.5h-23.4v-93.6h23.6l27 36.7 24.2-36.7zM371.9 382.8v-21.2h87.4v21.2h-30.6v72.4h-26.1v-72.4zM555.6 361.6v93.6h-21.5l-44-53.5v53.5h-23.4v-93.6H490l42.1 51.6v-51.6z"/><path d="M410 553c-75.6 0-146.9-14.1-200.7-39.8C153 486.3 122 449.7 122 410s31-76.3 87.3-103.2C263.1 281.1 334.4 267 410 267s146.9 14.1 200.7 39.8C667 333.7 698 370.3 698 410s-31 76.3-87.3 103.2C556.9 538.9 485.6 553 410 553zm0-264.9c-72.6 0-140.6 13.4-191.6 37.8-48.5 23.2-75.3 53.1-75.3 84.2s26.7 61 75.3 84.1c51 24.4 119.1 37.8 191.6 37.8s140.6-13.4 191.6-37.8c48.5-23.1 75.3-53.1 75.3-84.1s-26.7-61-75.3-84.1c-51-24.5-119-37.9-191.6-37.9z"/></svg></label>
  </div>
  <div className="flex items-center">
    <input type="radio" id="airtel" name="nid" value="airtel" className="mr-2" />
    <label htmlFor="airtel"><svg className="rounded-md" height="40" viewBox="-.773 -.587 726 730.4" width="40" xmlns="http://www.w3.org/2000/svg"><path d="m401.327.613c-1.4.4-4.7.8-7.3.9-10.4.2-44 8.7-56.2 14.1-1.1.5-4.2 1.8-7 2.9-7.3 2.8-26.6 12-29.6 14.2-1.4.9-3.7 2.1-5.2 2.4-1.5.4-2.7 1.1-2.7 1.5s-.8 1-1.7 1.4c-1 .3-3.1 1.5-4.8 2.6-1.6 1.1-4 2.4-5.3 3-1.3.5-3.8 2.1-5.6 3.5s-3.6 2.5-3.9 2.5c-2.3 0-34.5 23.4-43.6 31.6-7.4 6.7-21.1 21.3-21.1 22.5 0 .3-.9 1.7-2.1 3-3 3.4-12 17.6-14.6 22.9-1.1 2.5-3.3 6.9-4.7 9.9-4.9 10-6.9 20.9-6.4 33.6.6 12.5 3.4 19 11.9 27.6 8.9 8.9 18.4 12.8 33.4 13.6 10.3.5 17.7-.3 28-3.2 3.3-.9 7.7-2 9.8-2.6 2.1-.5 4.5-1.3 5.5-1.9 2.3-1.2 15.2-7 15.8-7 1.8 0 22.9-12.9 42.4-25.9 12.9-8.6 24.2-16.1 25.2-16.6.9-.6 7-4.2 13.5-8.1 6.5-3.8 14.5-8.4 17.8-10.1s8-4.2 10.5-5.5c2.5-1.2 7.2-3.4 10.5-4.6 3.3-1.3 7.4-3 9-3.7 1.7-.7 4.1-1.8 5.5-2.4 3.9-1.6 12.7-3.2 21.3-3.8 18.6-1.2 31.6 7 38.3 24.2 1.6 4.1 1.9 7.5 1.9 19.5 0 14.6-1.3 22.6-5.2 32-.8 1.9-1.9 4.6-2.5 6-5 12-15.3 29.2-27.1 44.8-11.2 15-35.3 39.9-51.2 53-5.5 4.6-11.6 9.6-13.5 11.2-4.2 3.5-9.1 7-14.5 10.6-2.2 1.4-5.8 3.8-8 5.4-6.2 4.2-22.7 13-32 17-2.7 1.2-6.4 2.8-8.2 3.6-1.7.8-4 1.4-5.1 1.4-1 0-3.3.5-5.1 1.1-6.5 2.3-13.1-2.1-13.1-8.8 0-8.2 3.9-13.4 28.5-37.8 26.6-26.4 29.5-30.3 29.5-40.3 0-10.3-4.9-17.3-15.9-22.9-4.8-2.5-6.6-2.8-15-2.8-9.8 0-15.5 1.4-22.6 5.7-1.6 1-4.1 2.3-5.5 3s-2.7 1.5-3 1.8-2.3 1.8-4.5 3.5c-5.3 4-14.6 13.5-19.9 20.4-3.7 4.8-6.4 9.3-12.7 21.1-5.2 9.8-9.9 28-9.9 38.6 0 21.5 11.2 38.7 28.5 43.6 5.2 1.5 26.4 1.5 33.7.1 7.2-1.5 26-7.3 27.2-8.4.6-.5 1.6-.9 2.4-.9 2.6 0 32.3-15.1 42.5-21.7 2.3-1.5 4.9-3.2 5.9-3.8.9-.5 5.6-3.4 10.5-6.4 4.8-3 9-5.8 9.3-6.1.3-.4 3.7-2.9 7.5-5.5 3.9-2.7 8.4-5.8 10-6.9 1.7-1.2 6.4-4.8 10.5-8.1 26-20.7 49-42.8 62.4-60 2.2-2.7 4.2-5.2 4.5-5.5.8-.6 7.6-10.4 12.3-17.8 2.1-3.1 5.3-8.6 7.1-12.2 1.9-3.6 4.5-8.5 5.8-11s4.1-9 6.3-14.5c2.1-5.5 4.2-10.9 4.6-12 2.8-7.1 7.1-25.4 9-38.5 2.1-14.8.5-39.1-3.6-52.5-1.7-5.5-2.1-6.5-5.8-14.5-8-17.2-20.8-32.8-35.5-43-2-1.4-4.5-3.3-5.6-4.4-3.6-3.2-21.9-11.4-32.6-14.5-5.7-1.7-14.2-3.5-18.9-4.2-10.8-1.4-36.7-2.1-40-.9zm289.9 494.5c-.3.2-4.9 1.1-10.4 2-5.5.8-14.5 2.3-20 3.3l-10 1.7v92c0 99.9-.2 95.7 5.7 108.2 2 4.3 4.8 8 9.1 11.9 10.6 9.7 20.5 12.7 41.6 12.8 18 0 17.3.7 16.9-15.9l-.3-12-7.7-.7c-13.7-1.2-20.3-6.7-21.8-18.1-.4-3.4-.7-46.2-.6-95 .1-84.5-.1-92.6-2.5-90.2zm-276.9 2c-22.2 3.3-29.6 4.7-30.5 5.8-.7.8-.8 32.7-.5 93.7.5 85.2.7 92.9 2.3 97 3.8 9.7 5.8 13.1 10.9 18.2 10.5 10.5 23.9 14.8 45.9 14.8 12.2 0 13.9-.2 14.7-1.8 1-1.9 1.5-19.3.7-23.3-.6-2.5-1-2.6-8.5-3.2-9.5-.6-15.1-3.8-19-10.7l-2.5-4.5-.3-51.8c-.2-38.6 0-52.2.9-53.3s4.3-1.4 15-1.4c16.5 0 15.1 1.6 14.7-17.5l-.3-13-14-.5c-7.7-.3-14.6-.9-15.2-1.3-1-.6-1.3-6.7-1.3-24.8v-23.9l-2.2.1c-1.3.1-6.1.7-10.8 1.4zm-346.5 45.1c-7.5.7-25.5 5-31 7.4-1.1.5-3.1 1.2-4.5 1.6-4.4 1.2-19 8.5-19 9.5 0 .5.9 2.8 1.9 5.2 6.6 14.5 9.1 19.7 9.6 19.7.3 0 1.3-.4 2.3-.9 5.1-2.6 11.3-5.1 16.2-6.6 3-.9 6.6-2.1 8-2.6 5.6-2 20.5-3 27.4-1.9 13.6 2.2 18.6 8.5 19.4 24.6.4 8.9.4 9.1-1.9 9.7-1.3.4-10.5.7-20.4.7-23.8 0-31.1 1.4-46.5 8.9-13.2 6.4-23 18.5-27.7 34.1-2.4 8.3-2.1 23.8.6 32 9 27.2 30.4 43.1 60.2 44.7 27.1 1.5 55-6.6 72.9-21l6.5-5.3.3-52.9c.3-61.3.2-63.4-7.2-78.4-3.3-6.8-14.4-17.6-21.3-20.6-3.2-1.5-6.7-3-7.8-3.5-7.5-3.3-26.5-5.5-38-4.4zm29.5 96.4c.6.8 1 12.7 1 27.1 0 28.4.4 26.6-7 30.5-2.8 1.5-5.9 1.8-15.6 1.9h-12.1l-5-3.4c-2.7-1.8-5.9-4.8-7-6.5-7.4-10.8-6.9-30.1.9-39.6 2.3-2.9 11.1-9 12.7-9 1 0 2.1-.4 2.7-.9 1.4-1.5 6-1.9 17.7-1.7 8.4.1 11 .4 11.7 1.6zm220-94c-19.9 4.7-35.8 13.2-51.8 27.8l-4.2 3.8v147.7c0 1.6 1.5 1.7 21.8 1.5l21.7-.3.3-69.7.2-69.6 3.8-3c4.5-3.6 6.7-4.7 12.5-6.7 6.9-2.3 17.7-3.4 25.8-2.5 4 .4 7.8.6 8.4.3.7-.2 2.5-3.6 4.1-7.6 1.5-4 3.9-9.2 5.1-11.6 3.3-6.3 3-7.9-1.4-8.9-2.1-.5-5.9-1.4-8.6-2-7.1-1.8-28.8-1.3-37.7.8zm217.5.2c-3.3.5-6.4 1.4-6.9 1.9-.6.5-1.6.9-2.4.9s-4.4 1.4-7.9 3.2c-7.7 3.8-19.5 14.7-24.5 22.8-4.4 7.1-9.5 17.7-10.3 21.5-.4 1.6-1 3.9-1.5 5-.4 1.1-1.6 5.4-2.6 9.5-2.7 10.8-2.7 45.4-.1 55.5 2.4 9.3 7.8 23.5 8.8 23.5.5 0 .9.5.9 1.1 0 3.8 11.9 18.9 20.3 25.7 3.7 3 12 7.3 18.2 9.4 6.7 2.3 21.5 4.8 28.1 4.8 14.2 0 39.8-6.1 48.3-11.5 2-1.2 4.7-2.6 6.1-3 3-.9 9.6-5 10.4-6.4.9-1.4-10.3-24.1-11.8-24.1-.7 0-2.5.9-3.9 2s-3.1 2-3.9 2c-.7 0-2.2.6-3.3 1.4-1.1.7-6.3 2.8-11.5 4.6-8.9 3.1-10.4 3.3-23.5 3.4-12.4 0-14.5-.2-18.5-2.1-14-6.7-22-23.6-22-46.4 0-4.9.1-9 .3-9.1.1-.2 22.3-.5 49.2-.8l49-.5-.3-10c-.6-19.6-5.8-46-10.3-52-.4-.6-1.8-3.1-3.1-5.6-5.4-10.7-16.8-19.9-30.3-24.4-9.9-3.4-28-4.4-41-2.3zm21.5 31.8c4.2 1.1 13 8.2 13 10.4 0 .6.7 2.4 1.5 3.9 2.3 4.5 4.1 19.3 2.5 21.2-1 1.3-4.9 1.5-25.1 1.5h-23.9l-.6-2.5c-1.3-5.1 2.2-18.8 6.2-24.1 4.4-5.9 8.3-8.9 14.1-10.6 3.2-.9 6.3-1.5 7-1.3.6.2 3 .9 5.3 1.5zm-366-102.2c-7.6 3.9-9.9 5.8-13.2 10.7-3.2 4.9-3.3 5.3-3.3 15.5v10.6l3.8 5.2c4.5 6.1 7.5 8.3 14.1 10.6 8.9 2.9 16.6 1.8 25.5-3.8 10.7-6.8 14.4-24.2 7.9-37-2.3-4.5-4.3-6.6-10.3-10.4-5.4-3.5-19.1-4.3-24.5-1.4zm24.5 72.2c-1.6.5-6.1 1.4-10 1.9-3.8.5-10.8 1.5-15.5 2.2-4.7.6-8.8 1.5-9.3 1.8-.9.8-1 170.7-.2 172.2.4.5 9.3.9 21 .9 20.4 0 20.5 0 21-2.3.3-1.2.4-41.6.3-89.7-.3-86.7-.3-87.5-2.3-87.7-1.1-.1-3.3.2-5 .7z" fill="#f00"/></svg></label>
  </div>
  <div className="flex items-center">
    <input type="radio" id="glo" name="nid" value="glo" className="mr-2" />
    <label htmlFor="glo"><img src="/images/glo2.png" width={"40px"} height={"40px"} /></label>
  </div>
</div>


    </div>
     

<div className="pt-7">
    <label htmlFor="phone" className="rubik-h pb-3">Phone number</label>
<input style={{fontSize:"25px"}} type="string" inputMode="numeric"  id="phone" name="Phoneno" className="focus:outline-none pl-2 w-full h-12 rubik-h border-0 border-b-2 border-black" /></div>

{net === "mtn" && (
  <div className="pt-7">
    <label htmlFor="opts" className="rubik-h pb-3">Plan</label>
    <select onChange={(e) => {
    // Get the selected option element
    const selectedOption = e.target.options[e.target.selectedIndex];
    // Access the data-amount attribute
    const amount = selectedOption.dataset.amount;
    const vid={item_code:selectedOption.value,biller_code:selectedOption.dataset.billcode,type:selectedOption.innerHTML}
    setVid(vid);
    setPrice(amount);
  }}
      style={{ backgroundColor: "" }}
      className="rubik-b p-4 border-b-2 border-black focus:outline-none" 
      name="plan" 
      id="opts"
    >
      <option value="" className="rubik-b">Choose plan</option>
      {mtnready&&mtnplans.current.map((opt) => (
        <option data-amount={opt.amount} data-billcode={opt.biller_code} key={opt.id} className="rubik-b" value={opt.item_code}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
)}


{net === "airtel" && (
  <div className="pt-7">
    <label htmlFor="opts" className="rubik-h pb-3">Plan</label>
    <select onChange={(e) => {
    // Get the selected option element
    const selectedOption = e.target.options[e.target.selectedIndex];
    // Access the data-amount attribute
    const amount = selectedOption.dataset.amount;
    const vid={item_code:selectedOption.value,biller_code:selectedOption.dataset.billcode,type:selectedOption.innerHTML}
    setVid(vid);
    setPrice(amount);
  }}
      style={{ backgroundColor: "" }}
      className="rubik-b p-4 border-b-2 border-black focus:outline-none" 
      name="plan" 
      id="opts"
    >
      <option value="" className="rubik-b">Choose plan</option>
      {airtelready&&airtelplans.current.map((opt) => (
        <option data-amount={opt.amount} data-billcode={opt.biller_code} key={opt.id} className="rubik-b" value={opt.item_code}>
        {opt.name}
        </option>
      ))}
    </select>
  </div>
)}

{net === "glo" && (
  <div className="pt-7">
    <label htmlFor="opts" className="rubik-h pb-3">Plan</label>
    <select onChange={(e) => {
    // Get the selected option element
    const selectedOption = e.target.options[e.target.selectedIndex];
    // Access the data-amount attribute
    const amount = selectedOption.dataset.amount;
    const vid={item_code:selectedOption.value,biller_code:selectedOption.dataset.billcode,type:selectedOption.innerHTML}
    setVid(vid);
    setPrice(amount);
  }}
      style={{ backgroundColor: "" }}
      className="rubik-b p-4 border-b-2 border-black focus:outline-none" 
      name="plan" 
      id="opts"
    >
      <option value="" className="rubik-b">Choose plan</option>
      {gloready&&gloplans.current.map((opt) => (
        <option data-amount={opt.amount} data-billcode={opt.biller_code} key={opt.id} className="rubik-b" value={opt.item_code}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
)}

{(price>0)?
<input readOnly value={price} style={{fontSize:"15px"}} type="string"  id="phone" name="amount" className="focus:outline-none mt-10 pl-2 w-full h-12 rubik-h border-0 border-b-2 border-black" />:null}
{ loading? <Delay/> : <Button ref={ready} className="text-white mt-12 p-4" disabled={enable} type="submit" variant="contained" endIcon={<ArrowForward/> } sx={{textTransform:"none",borderRadius:"30px"  }} >proceed</Button>}
</form>
<Link href={"/dashboard"} className="rubik-b mt-8">{<Button startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none"}}>Back</Button>}</Link>
{showkeypad&&<NumericPad maxLength={4} onSubmit={handlePinSubmit} hideComp={()=>{setShowKeyPad(false)}}/>}
<div id="wrongpin" className=" z-20 absolute w-full pt-4 pb-4 text-red-600 mx-auto bg-black p-2 rounded-xl text-center hidden shp">Incorrect pin</div>
    </div>
    </>)
}
export async function getServerSideProps(context){
  if(!context.req.isAuthenticated()){
      return {
          redirect: {
            destination: '/login',  // URL to redirect to
            permanent: false,       // Set to true for 301 redirect, false for 302 (default)
          },
        };
  }
return {
  props:{}
}
}
export default Data

