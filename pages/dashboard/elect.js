import { ArrowBackIosRounded,CheckCircle,Forward, ForwardRounded } from "@mui/icons-material"
import { Button, Paper, Typography } from "@mui/material"
import Head from "next/head"
import { useEffect, useState } from "react"
import router from "next/router"
import NumericPad from "../../components/Numpad"
const Elect=()=>{
    const [processed,setProcessed]=useState(false)
    const [details,setDetails]=useState(null)
    const [pincon, setPincon]= useState(false)
     async function veri(){
        document.getElementById("userinfo").style.color="blue"
        document.getElementById("userinfo").innerHTML="checking..."
        const epp= document.getElementById("ep").value
      const meter= document.getElementById("acct").value
       const typ= document.getElementById("pre")
       const typ2= document.getElementById("post")
       const ty=(typ.checked)? typ.value :typ2.value;
       const data={iuc:meter,cableprovider:epp,vid:ty}
       const res= await fetch("https://zonapay.onrender.com/api/verify",{method:"POST",body:JSON.stringify(data),headers:{
        "Content-Type":"application/json"
       }})
       if(res.ok){
const result= await res.json();
if(result.code!="failure"){
document.getElementById("userinfo").style.color="green"
document.getElementById("userinfo").innerHTML=result.data.customer_name;}
else{
    document.getElementById("userinfo").style.color="red"
    document.getElementById("userinfo").innerHTML="failed to verify user";
   }
       }
       else{
        document.getElementById("userinfo").style.color="red"
        document.getElementById("userinfo").innerHTML="failed to verify user";
       }
     }
async function ver1(){
    const epp= document.getElementById("ep").value
    const meter= document.getElementById("acct").value
     const typ= document.getElementById("pre")
     const typ2= document.getElementById("post")
     if(epp && meter && (typ.checked||typ2.checked)){
if(meter.toString().length==13){
    veri()
}else{
    console.log("Not complete yet " + meter+"  " +epp)
    return;
}
     }else{
        console.log("CREDENTIALS problem")
        return
     }
}

    useEffect( async ()=>{
        document.getElementById("btn").addEventListener("click", async ()=>{
            if(!pincon){
                document.getElementById("keyPad").style.display="flex";
                return;
              } 
              document.getElementById("delay").style.display="flex"
              document.getElementById("keyPad").style.display="none";
            const epp= document.getElementById("ep").value
       const meter= document.getElementById("acct").value
       const amount=document.getElementById("amt").value;
       const typ= document.getElementById("pre");
       const typ2= document.getElementById("post");
       const ty=(typ.checked)? typ.value : typ2.value
            const data={iuc:meter,provider:epp,amount,vid:ty}
            const res= await fetch("https://zonapay.onrender.com/zonapay/electricity",{method:"POST",body:JSON.stringify(data),headers:{
                "Content-Type":"application/json"
            }})
            if(res.ok){
const result= await res.json();
if(result.custom_message){
   return router.replace("/dashboard/processing");
}
document.getElementById("delay").style.display="none"
setDetails(result);
setProcessed(true);
return
}
else{
router.replace("/dashoard/error")
}
});
if(pincon){
    document.getElementById("btn").click();
    setPincon(false);
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
              <span>-</span><span>{details.data.electricity}</span></div>
              <div className="monomaniac-one-regular  flex flex-row justify-between"><span>M-no</span><span>-</span><span>{details.data.meter_number}</span></div>
              <div className="monomaniac-one-regular  flex flex-row justify-between"><span>Token</span><span>-</span><span>{details.data.token}</span></div>
              <div className="monomaniac-one-regular  flex flex-row justify-between"><span>Units</span><span>-</span><span>{details.data.units}</span></div>
              <div className="monomaniac-one-regular  flex flex-row justify-between"><span>Amount</span><span>-</span><span>{details.data.amount}</span></div>
              
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
        <span onClick={()=>{router.back()}} className="fixed top-1 left-1"><ArrowBackIosRounded sx={{color:"black"}} /> </span>
    <div className="w-full bg-white rounded-b-2xl mb-5">
<div style={{fontSize:"30px"}} className="rubik-h text-center w-full mb-3 mt-3"> ELECTRICITY</div>
<div className="flex flex-col w-full justify-start p-6 bg-white rounded-xl">
<label  htmlFor="ep" className="ml-3 rubik-h">Provider</label>
<select onChange={ver1} id="ep" name="provider" style={{fontSize:"17px"}} className="bg-transparent focus:outline-none ml-3 rubik-b border-t-0 border-l-0 border-r-0 border-b-2 border-blue-600">
    <option style={{fontSize:"15px"}} className="rubik-b">Select provider</option>
    <option value="enugu-electric" style={{fontSize:"15px"}} className="rubik-b">EEDC</option>
    <option value="abuja-electric" style={{fontSize:"15px"}} className="rubik-b">AEBC</option>
    <option value="ibadan-electric" style={{fontSize:"15px"}} className="rubik-b">IBEDC</option>
    <option value="ikeja-electric" style={{fontSize:"15px"}} className="rubik-b">IKEDC</option>
    <option value="jos-electric" style={{fontSize:"15px"}} className="rubik-b">JEDplc</option>
    <option value="kaduna-electric" style={{fontSize:"15px"}} className="rubik-b">KAEDCO</option>
    <option value="kano-electric" style={{fontSize:"15px"}} className="rubik-b">KEDCO</option>
    <option value="portharcourt-electric" style={{fontSize:"15px"}} className="rubik-b">PHED</option>
</select>

</div></div>
<div className="flex flex-row w-11/12 mx-auto justify-evenly gap-5 items-center p-4 bg-white rounded-xl">
<div className="flex flex-row justify-center gap-3 rounded-2xl">
<input type="radio" name="pay" value={"prepaid"} id="pre"/>
    <label className="rubik-b" htmlFor="pre">Prepaid</label>
</div>
<div className="flex flex-row justify-center gap-3 rounded-2xl">
<input type="radio" name="pay" value="postpaid" id="post"/>

    <label className="rubik-b" htmlFor="post">Postpaid</label>
</div>
</div>
        <div className="flex flex-col w-11/12 mx-auto justify-start p-6 bg-white rounded-xl">
<label  htmlFor="acct" className="ml-3 rubik-h">Meter/Acct No</label>
<input onKeyUp={ver1} id="acct" type="number" inputMode="numeric" name="meter" className="ac rounded-t-xl focus:outline-none ml-3 border-t-0 border-l-0 border-r-0 border-b-2 border-blue-600 w-11/12 h-12 font-bold " style={{fontSize:"18px"}}/>
<span id='userinfo' className="rubik-b ml-4"></span>
        </div>

        <div className="flex flex-col w-11/12 mx-auto justify-start p-6 bg-white rounded-xl">
<label  htmlFor="amt" className=" ml-3 rubik-h">Amount</label>
<input id="amt" type={"number"} inputMode="numeric" name="amount" className="ac rounded-t-xl focus:outline-none font-bold ml-3 border-t-0 border-l-0 border-r-0 border-b-2 border-blue-600 w-11/12 h-12 " style={{fontSize:"18px"}} />
        </div>
<div className="mx-auto">
    <Button id="btn" variant={"contained"} endIcon={<ForwardRounded/>}>Proceed</Button>
</div>
<NumericPad maxLength={4} onSubmit={handlePinSubmit}/>
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
export default Elect