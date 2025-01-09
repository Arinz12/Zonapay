import { ArrowBack, CheckCircle } from "@mui/icons-material";
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
const resdata= await fetch("https://zonapay.onrender.com/zonapay/setpin",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
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
    <form id="form" action="" method="post" autoComplete="off">
    <div>Create Pin</div>
    <label htmlFor="fp">Enter pin</label><br/>
<input className="border-4 border-black w-9/12"  type="password" id="fp"  /><br/>

<label htmlFor="sp">Re-enter pin</label><br/>
<input className="border-4 border-black w-9/12"  type='password'  id="sp"/><br/>
<span className="text-red-600" id="message">...</span>
<Button type="submit">Continue</Button>
</form>
</div>


</>)
}
export default Pin

