import { ArrowBackIosRounded,Forward } from "@mui/icons-material"
import { Button, Typography } from "@mui/material"
import Head from "next/head"
import { useEffect } from "react"
import router from "next/router"
const Elect=()=>{
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
       const epp= document.getElementById("ep").value
      const meter= document.getElementById("acct").value
        document.getElementById("amt")
        document.getElementById("pre")
        document.getElementById("post")


        // document.getElementById("btn").addEventListener(click, async ()=>{
        //     const data={iuc:meter,cableprovider:epp}
        //     })
    })
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
<select id="ep" name="provider" style={{fontSize:"17px"}} className=" focus:outline-none ml-3 rubik-b border-t-0 border-l-0 border-r-0 border-b-2 border-blue-600">
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
<input onKeyUp={ver1} id="acct" type="number" inputMode="numeric" name="meter" className="ac rounded-t-xl focus:outline-none ml-3 border-t-0 border-l-0 border-r-0 border-b-2 border-blue-600 w-11/12 h-12 font-bold " style={{backgroundColor:"whitesmoke",fontSize:"18px"}}/>
<span id='userinfo' className="rubik-b ml-4"></span>
        </div>

        <div className="flex flex-col w-11/12 mx-auto justify-start p-6 bg-white rounded-xl">
<label  htmlFor="amt" className=" ml-3 rubik-h">Amount</label>
<input id="amt" type={"number"} inputMode="numeric" name="amount" className="ac rounded-t-xl focus:outline-none font-bold ml-3 border-t-0 border-l-0 border-r-0 border-b-2 border-blue-600 w-11/12 h-12 " style={{backgroundColor:"whitesmoke",fontSize:"18px"}} />
        </div>
<div className="mx-auto">
    <Button variant={"contained"} endIcon={<Forward/>}>Proceed</Button>
</div>
    </div>
    </>)
}
export default Elect