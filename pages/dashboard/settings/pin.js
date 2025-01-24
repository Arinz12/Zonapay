import { ArrowBack, ArrowBackIosRounded, ArrowForward, CheckCircle } from "@mui/icons-material";
import { Button } from "@mui/material"
import Head from "next/head"
import { useEffect, useState } from "react"
import Link from "next/link";
const Pin=()=>{
    const [set,setSet]=useState(false);
    useEffect(()=>{
const form=document.getElementById("form")
form.onsubmit=async (e)=>{
e.preventDefault();
const pin1= document.getElementById('fp')
const pin2= document.getElementById('sp')
if(pin1.value!==pin2.value){
    document.getElementById("message").innerHTML="pin doesn't match"
    pin1.value=""
    pin2.value=""
setTimeout(()=>{document.getElementById("message").innerHTML=""},4000)
    return
}
const data={pin:pin1.value}
try{
const resdata= await fetch("http://localhost:3000/zonapay/setpin",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
if(resdata.ok){
    console.log("done")
    setSet(true)
}

}
catch(e){
    console.log("An error occured check connectivity")
    }}
        }
    ,[])
        if(set){
            return(<>
            <div style={{height:"100lvh",width:"100vw"}} className="flex  flex-row items-center justify-center">
      <div className="flex flex-col gap-8 justify-center items-center w-full">
        <div className="flex flex-col gap-2 items-center justify-center">
      <CheckCircle sx={{color:"green",height:"130px",width:"130px"}}/>
      <div style={{fontSize:"25px"}} className="text-black rubik-b">Pin successfully set</div>
      </div>
          <Link href={"/dashboard"} className="rubik-b mt-8">{<Button startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none",backgroundColor:"#1E3A5F"}}>Home</Button>}</Link>
          </div>
  </div>
            </>)
        }
return(<>

<Head>
</Head>

<div className="mx-auto flex flex-col gap-6 justify-center items-start h-full">
   <Link href="/dashboard/settings">{<div className="absolute left-2 p-3 top-1 inline-block"><ArrowBackIosRounded sx={{color:"white"}}/> </div>}</Link>
    <form className=" w-full mx-auto flex flex-col gap-3 justify-center items-start h-full" id="form" action="" method="post" autoComplete="off">
    <div className="text-5xl mt-8 mb-10 mx-auto text-center rubik-h">Create Pin</div>
   <div className="mx-auto rubik-b w-full text-center">
     <label className="rubik-b" htmlFor="fp">Enter pin</label><br/>
<input maxLength="4" inputMode="numeric" className="border-0 border-b-2 text-center focus:outline-none border-black w-9/12"  type="password" id="fp"/></div>

<div className="mx-auto rubik-b w-full text-center mt-11"> 
<label className="rubik-b" htmlFor="sp">Re-enter pin</label><br/>
<input maxLength="4" inputMode="numeric" className="border-0 border-b-2 text-center focus:outline-none border-black w-9/12 "  type='password'  id="sp"/></div>

<span className="text-red-600 rubik-l mx-auto" id="message"></span>
<div className="absolute w-full flex bottom-1 mx-auto justify-center text-center"><Button endIcon={<ArrowForward/>} className="p-5 w-full rounded-full bg-blue-600 " variant="contained" type="submit">Continue</Button></div>
</form>
</div>
</>)
}
export default Pin
