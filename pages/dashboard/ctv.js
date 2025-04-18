import "@fontsource/roboto"
import { ArrowBackIosRounded, ArrowForward, CheckCircle } from "@mui/icons-material";
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
     console.log(resp.data)
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
   },[]);


useEffect(()=>{
  if(!status==null){
  setPro(true)}
})

const handlePinSubmit= async (pin)=>{
  const data={pinn:pin}
  try{
const rep= await fetch("https://zonapay.onrender.com/zonapay/confirmPin",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
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
      const response = await fetch("https://zonapay.onrender.com/zonapay/cable", {
        method: "POST",
        body: JSON.stringify({
          iuc: document.getElementById("iuc").value,
          amount: tvdata.amount,
          biller: tvdata.biller,
          item: tvdata.item
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Request failed");
      
      setStatus(await response.json());
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
              <div style={{fontSize:"14px"}} className="text-lg font-semibold flex flex-row justify-between"><span>reference</span><span>{details.data.reference}</span></div>
          </div>
          <Link href={"/dashboard"} className="rubik-b mt-8">{<Button startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none",backgroundColor:"#1E3A5F"}}>Home</Button>}</Link>
          </div>
  </div>: <div className="" style={{backgroundColor:"whitesmoke"}}>
  <div style={{fontSize:"26px"}} className="rubik-h z-10 w-full sticky top-0 text-white bg-blue-600 px-4 py-7 flex flex-row justify-start gap-4 items-center rounded-b-3xl  mb-14">

  <div onClick={()=>{router.back()}} style={{backgroundColor:"white",borderRadius:"50%",height:"30px",width:"30px"}}className="p-6 flex flex-row items-center justify-center"><ArrowBackIosRounded sx={{color:"white"}} className="text-blue-600" /> </div>
  <div>Cable Tv</div>
  
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
               <input onKeyUp={val}  id="iuc" className="border-0 border-b-4 border-blue-600 focus:outline-none rubik-h font-bold" type="number" name="iuc" placeholder="Decoder number"  /> <span style={{color:"blue"}} id="user" className="hidden font-bold"></span></div>
               <div className= "flex flex-col mt-4"><label htmlFor="pn" className="rubik-h font-bold" style={{fontSize:"20px"}}> Phone number</label>
               <input id="pn" className="  border-0 border-b-4 border-blue-600 focus:outline-none" type="text" placeholder="Enter number" name="phone" /></div>
   {/* //gotv options */}
 {(cpp=="gotv")&& (<div className="grid grid-cols-2 justify-center items-center mt-4 w-full gap-5">
{gotvplans.current.map((opts)=>(
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
{(cpp=="dstv")&&(<div className="grid grid-cols-2 justify-center items-center mt-4 w-full gap-5">
  
{dstvplans.current.map((opts)=>(
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
{(cpp=="startimes")&&(<div className="grid grid-cols-2 justify-center items-center mt-4 w-full gap-5">
  
{starplans.current.map((opts)=>(
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

    
           {tvdata.item!=undefined &&<Button  ref={btnref} type="submit" endIcon={<ArrowForward/>} className="p-3 fixed left-1 right-1 w-3/5 bottom-1 mx-auto rounded-3xl  bg-blue-600" variant="contained" sx={{textTransform:"none"}}>
                proceed
                </Button>}
                </div>
            </form>
            {showkeypad&& (<NumericPad className="" maxLength={4} onSubmit={handlePinSubmit} hideComp={()=>{setShowKeyPad(false)}}/>)}
    <div id="wrongpin" className="z-20 absolute w-full pt-4 pb-4 text-red-600 mx-auto bg-black p-2 rounded-xl text-center hidden shp">Incorrect pin</div>
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