import "@fontsource/roboto"
import { ArrowBack, ArrowBackIosRounded, ArrowForward, CheckCircle } from "@mui/icons-material";
import { Paper, Button } from "@mui/material"
import Head from "next/head"
import { useEffect, useRef, useState } from "react";
import router from "next/router"
import Delay from "../../components/Delay";
import Link from "next/link";
import NumericPad from "../../components/Numpad";
import { FaCheck } from 'react-icons/fa'; 
const Cable=()=>{
const [status,setStatus]=useState(null)
const [processed,setPro]=useState(false)
const [start,setStart]=useState(false);
const[pincon,setPin]=useState(false);
const[cpp,setCp]=useState("")
const gotvplans= useRef([]);
const starplans= useRef([]);
const dstvplans= useRef([]);
const [tvdata,setTv]=useState({})
const btnref=useRef(null)
const [showkeypad,setShowKeyPad]= useState(false);
const [tvready,setTvready]=useState(false)

async function val(){
  let data
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
        console.log("invalid iuc");
        return
    }}
    user.style.display="block";
    user.style.color="blue"
    user.innerHTML="verifying..."
    if(cp=="gotv"){
     data ={iuc:valu,provider:"BIL122",vid:"CB188"}
    }
    else if(cp=="dstv"){
      data ={iuc:valu,provider:"BIL121",vid:"CB177"}
    }
    else{
      data ={iuc:valu,provider:"BIL123",vid:"CB189"}
    }
        try{
    const resp=await fetch("https://www.billsly.co/api/verify",{method:"POST",body:JSON.stringify(data),headers:{
        "Content-Type": "application/json",
        "Accept": "application/json"
      }})
      if(resp.ok){
        const resp1= await resp.json();
        user.innerHTML=resp1.data.name;
        user.style.color="green"
        user.style.display="block";
      }
      else{
        user.innerHTML="failed to verify user"
        user.style.color="red";
        user.style.display="block";
    }
}
    catch(e){
        user.innerHTML="failed to verify user"
        user.style.color="red";
        user.style.display="block";
        console.log("Gotchaa  "+e)
    }
}

useEffect( ()=>{
  const fetchtv= async ()=>{
 
   try{
     const res= await fetch("https://www.billsly.co/zonapay/ftp",
     {
       method:"post",
     body:JSON.stringify({bille:"BIL122"}),
     headers:{
       "Content-Type":"application/json"
     }
   })
   const res2= await fetch("https://www.billsly.co/zonapay/ftp",
   {
     method:"post",
   body:JSON.stringify({bille:"BIL121"}),
   headers:{
     "Content-Type":"application/json"
   }
 })
 const res3= await fetch("https://www.billsly.co/zonapay/ftp",
 {
   method:"post",
 body:JSON.stringify({bille:"BIL123"}),
 headers:{
   "Content-Type":"application/json"
 }
 })
 
   if(res.ok){
     const resp=await res.json();
     console.log(resp.data)
   gotvplans.current=resp.data;
   setTvready(true)
   
   }else{
     console.log("failed to fetch data plans for gotv")
   }
   if(res2.ok){
     const resp=await res2.json();
   dstvplans.current=resp.data
   setTvready(true)
   }else{
     console.log("failed to fetch data plans for dstv")
   }
   if(res3.ok){
     const resp=await res3.json();
   starplans.current=resp.data
   setTvready(true)
   }else{
     console.log("failed to fetch data plans for startimes")
   }
 
   }
 catch(e){
   console.log("erroR  "+e)
 }}
   fetchtv();
   },[]);
useEffect(()=>{
  if(!status==null){
  setPro(true)}
})

const handlePinSubmit= async (pin)=>{
  const data={pinn:pin}
  try{
const rep= await fetch("https://www.billsly.co/zonapay/confirmPin",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
if(rep.ok){
  setPin(true);
  console.log(pincon);
  console.log("okayyy") 
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

//contains actual request to the server 
//it first checks if user pin is confirmed before proceeding.
useEffect(() => {
  const form = document.getElementById("form");
  if (!form) return;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pincon) {
      setShowKeyPad(true); 
      return;
    }

    setShowKeyPad(false);
    
    try {
      setStart(true);
      const response = await fetch("https://www.billsly.co/zonapay/cable", {
        method: "POST",
        body: JSON.stringify({
          iuc: document.getElementById("iuc").value,
          amount: tvdata.amount,
          biller: tvdata.biller,
          item: tvdata.item
        }),
        headers: {
          "Content-Type": "application/json",
          "passid":""
        }
      });

      if (!response.ok) throw new Error("Request failed");
      
      setStatus(await response.json());
      setStart(false)
    } catch (error) {
      console.log("Error:", error);
      router.push("/dashboard/error");
    }
  };

  form.addEventListener("submit", handleSubmit);

  // Auto-submit if pincon is true
  if (pincon && btnref.current) {
    btnref.current.click();
  }

  // Cleanup function
  return () => {
    form.removeEventListener("submit", handleSubmit);
  };
}, [pincon, tvdata, router]); // Proper dependencies
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
      <div style={{backgroundColor:"snow"}} className=" flex flex-col  mt-4 space-y-2 text-center w-11/12 p-6 rounded-xl ">
        <div className="text-lg font-semibold flex flex-row justify-between"><span>status</span><span>{details.status}</span></div>
              <div className="text-lg font-semibold flex flex-row justify-between"><span>Amount</span><span>{status.data.amount}</span></div>
              <div className="text-lg font-semibold flex flex-row justify-between"><span>plan</span><span>{status.data.network}</span></div>
              <div className="text-lg font-semibold flex flex-row justify-between"><span>iuc</span><span>{status.data.phone_number}</span></div>
              <div style={{fontSize:"14px"}} className="text-lg font-semibold flex flex-row justify-between"><span>reference</span><span>{details.data.tx_ref.split("-")[2]}</span></div>
          </div>
          <Link href={"/dashboard"} className="rubik-b mt-8">{<Button startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none",backgroundColor:"#2563EB"}}>Home</Button>}</Link>
          </div>
  </div>: <div className="" style={{backgroundColor:"whitesmoke"}}>
  <div style={{fontSize:"23px"}} className="rubik-h sticky top-0 w-full  bg-white px-4 py-4 flex flex-row justify-start gap-4 items-center rounded-b-3xl z-10  mb-14">

        <div onClick={()=>{router.back()}} style={{}}className="p-2 flex flex-row items-center justify-center"><ArrowBack sx={{color:"#2563EB"}} className=""/> </div>
          <div className="text-blue-600">Cable Tv</div>
          </div>

            <form  method="post" className="w-full" id="form">
                <div className="flex flex-col gap-8 mx-auto p-6 bg-white rounded-xl " style={{width:"100%"}}>
                <select onChange={(e)=>{
const selected= e.target.options[e.target.selectedIndex];
setCp(selected.value);
                }} className="focus:outline-none rubik-h p-4 rounded-md " name="cableprovider" id="cp">
                <option className="rubik-b" value="random">Choose a cable provider</option>
                    <option className="rubik-b" value="gotv">GOTV</option>
                    <option className="rubik-b" value="dstv">DSTV</option>
                    <option className="rubik-b" value="startimes">STARTIMES</option>
                </select>
               <div className="flex flex-col"><label htmlFor='iuc' className="rubik-h font-bold" style={{fontSize:"20px"}}>Iuc number</label>
               <input style={{fontSize:"20px",backgroundColor:"whitesmoke"}} onKeyUp={val}  id="iuc" className="border-b-2 border-0 rounded-xl p-3 border-blue-600 focus:outline-none rubik-h font-bold" type="number" name="iuc" placeholder="XXXXXXXXXX"/> <span style={{color:"blue"}} id="user" className="hidden font-bold"></span></div>
               <div className= "flex-col hidden  mt-4"><label htmlFor="pn" className="rubik-h font-bold" style={{fontSize:"20px"}}>Phone</label>
               <input style={{fontSize:"20px",backgroundColor:"whitesmoke"}} id="pn" className="border-0 rounded-2xl border-blue- p-3 focus:outline-none" type="text" placeholder="000000000000" name="phone" /></div>
   {/* //gotv options */}
 {(cpp=="gotv")&&
 (<div className="grid grid-cols-2 justify-center mb-14 items-center mt-4 w-full gap-5">
{tvready&& gotvplans.current.map((opts)=>(
  <div
   onClick={
    ()=>{
setTv({amount:opts.amount,biller:opts.biller_code,item:opts.item_code})
}
  }   key={opts.item_code} tabIndex={0} className="inline">
  <div style={{background: "linear-gradient(to bottom, #2563eb, #000000)"}} data-amount={opts.amount} data-billcode={opts.biller_code} data-itemcode={opts.item_code} 
  className="gradient-box w-36 relative h-36 rubik-h rounded-lg text-white flex flex-col gap-2 justify-center text-center focus:ring-8 focus:ring-blue-600">
    <span> {opts.biller_name}</span>
   <span> {opts.amount}</span>
   {(tvdata.item==opts.item_code)&& (
  <div style={{
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '50%',
    border: '2px solid green',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <FaCheck style={{ color: 'green', fontSize: '12px' }} />
  </div>
)}
  </div>
</div>
))}
</div>)}

{/* dstv options */}
{(cpp=="dstv")&&(<div className="grid grid-cols-2 mb-14 justify-center items-center mt-4 w-full gap-5">
  
{tvready&& dstvplans.current.map((opts)=>(
  <div onClick={
    ()=>{
setTv({amount:opts.amount,biller:opts.biller_code,item:opts.item_code})
}
  }  key={opts.item_code} tabIndex={0} className="inline">
 <div style={{background: "linear-gradient(to bottom, #2563eb, #000000)"}} data-amount={opts.amount} data-billcode={opts.biller_code} data-itemcode={opts.item_code} 
  className="gradient-box w-36 h-36 relative rubik-h rounded-lg text-white flex flex-col gap-2 justify-center text-center focus:ring-8 focus:ring-blue-600">
    <span> {opts.biller_name}</span>
   <span> {opts.amount}</span>
   {(tvdata.item==opts.item_code)&& (
  <div style={{
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '50%',
    border: '2px solid green',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <FaCheck style={{ color: 'green', fontSize: '12px' }} />
  </div>
)}
  </div>
</div>
))}
</div>)}

{/* startimes option */}
{(cpp=="startimes")&&(<div className="grid mb-14 grid-cols-2 justify-center items-center mt-4 w-full gap-5">
  
{ tvdata && starplans.current.map((opts)=>(
  <div onClick={
    ()=>{
setTv({amount:opts.amount,biller:opts.biller_code,item:opts.item_code})
}
  } key={opts.item_code} tabIndex={0} className="inline">
  <div style={{background: "linear-gradient(to bottom, #2563eb, #000000)"}} data-amount={opts.amount} data-billcode={opts.biller_code} data-itemcode={opts.item_code} 
  className="gradient-box w-36 relative h-36 rubik-h rounded-lg text-white flex flex-col gap-2 justify-center text-center focus:ring-8 focus:ring-blue-600">
   <span> {opts.biller_name}</span>
   <span> {opts.amount}</span>
   {(tvdata.item==opts.item_code)&& (
  <div style={{
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '50%',
    border: '2px solid green',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <FaCheck style={{ color: 'green', fontSize: '12px' }} />
  </div>
)}
  </div>
</div>
))}
</div>)}

{start&&<Delay/>}

    
 {tvdata.item!=undefined &&<div style={{backgroundColor:"rgba(0, 0, 0, 0.253)",backdropFilter:"blur(9px)"}} className="shp fixed left-0 right-0 bottom-0 w-full p-8  rounded-t-2xl z-10 text-center flex flex-row justify-center items-center">
            <Button  ref={btnref} type="submit" endIcon={<ArrowForward/>} className="p-3   w-3/5  mx-auto rounded-2xl  bg-blue-600" variant="contained" sx={{textTransform:"none"}}>
                proceed
                </Button></div>}
                </div>
            </form>
            {showkeypad&& (<NumericPad className="" maxLength={4} onSubmit={handlePinSubmit} hideComp={()=>{setShowKeyPad(false)}}/>)}
    <div id="wrongpin" className="z-20 fixed top-0 w-full pt-4 pb-4 text-red-600 mx-auto bg-blue-600 p-2 rounded-xl text-center hidden shp">Incorrect pin</div>
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